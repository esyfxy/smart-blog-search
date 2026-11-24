package com.ld.poetry.search.service.impl;

import com.ld.poetry.entity.Article;
import com.ld.poetry.search.config.SearchProperties;
import com.ld.poetry.search.document.ArticleDocument;
import com.ld.poetry.search.repository.ArticleSearchRepository;
import com.ld.poetry.search.service.SearchService;
import com.ld.poetry.service.ArticleService;
import com.ld.poetry.utils.CommonConst;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 搜索服务实现类
 * 
 * @author sara
 * @since 2024-11-17
 */
@Service
public class SearchServiceImpl implements SearchService {

    private static final Logger logger = LoggerFactory.getLogger(SearchServiceImpl.class);

    @Autowired
    private ArticleSearchRepository articleSearchRepository;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private SearchProperties searchProperties;

    @Autowired
    private ElasticsearchRestTemplate elasticsearchRestTemplate;

    @Override
    public void syncArticle(Article article) {
        if (article == null) {
            logger.warn("同步文章为空，跳过同步");
            return;
        }

        try {
            // 只同步可见的文章
            if (article.getViewStatus() != null && article.getViewStatus()) {
                ArticleDocument document = convertToDocument(article);
                articleSearchRepository.save(document);
                logger.info("同步文章成功: {}", article.getId());
            } else {
                // 如果文章不可见，删除索引中的文档
                deleteArticle(article.getId());
            }
        } catch (Exception e) {
            logger.error("同步文章失败: {}", article.getId(), e);
        }
    }

    @Override
    public void deleteArticle(Integer articleId) {
        if (articleId == null) {
            logger.warn("删除文章ID为空，跳过删除");
            return;
        }

        try {
            if (articleSearchRepository.existsById(articleId)) {
                articleSearchRepository.deleteById(articleId);
                logger.info("删除文章索引成功: {}", articleId);
            }
        } catch (Exception e) {
            logger.error("删除文章索引失败: {}", articleId, e);
        }
    }

    @Override
    public void batchSyncArticles(List<Article> articles) {
        if (CollectionUtils.isEmpty(articles)) {
            logger.warn("批量同步文章列表为空，跳过同步");
            return;
        }

        try {
            List<ArticleDocument> documents = articles.stream()
                    .filter(article -> article.getViewStatus() != null && article.getViewStatus())
                    .map(this::convertToDocument)
                    .collect(Collectors.toList());

            if (!CollectionUtils.isEmpty(documents)) {
                articleSearchRepository.saveAll(documents);
                logger.info("批量同步文章成功，数量: {}", documents.size());
            }
        } catch (Exception e) {
            logger.error("批量同步文章失败", e);
        }
    }

    @Override
    public void fullSyncArticles() {
        logger.info("开始全量同步文章数据");
        
        try {
            // 删除现有索引
            if (indexExists()) {
                deleteIndex();
            }
            
            // 创建新索引
            createIndex();
            
            // 获取所有可见文章
            List<Article> allArticles = articleService.lambdaQuery()
                    .eq(Article::getViewStatus, true)
                    .eq(Article::getDeleted, false)
                    .list();
            
            if (!CollectionUtils.isEmpty(allArticles)) {
                // 分批同步，避免内存溢出
                int batchSize = 100;
                for (int i = 0; i < allArticles.size(); i += batchSize) {
                    int endIndex = Math.min(i + batchSize, allArticles.size());
                    List<Article> batch = allArticles.subList(i, endIndex);
                    batchSyncArticles(batch);
                }
                
                logger.info("全量同步文章完成，总数量: {}", allArticles.size());
            } else {
                logger.info("没有找到可同步的文章");
            }
            
        } catch (Exception e) {
            logger.error("全量同步文章失败", e);
        }
    }

    @Override
    public ArticleDocument convertToDocument(Article article) {
        if (article == null) {
            return null;
        }

        ArticleDocument document = new ArticleDocument();
        document.setId(article.getId());
        document.setTitle(article.getArticleTitle());
        
        // 处理文章内容，提取摘要
        String content = article.getArticleContent();
        if (StringUtils.hasText(content)) {
            // 移除HTML标签和特殊字符，生成摘要
            String cleanContent = content.replaceAll("<[^>]+>", "")
                    .replaceAll("[`#>]", "")
                    .trim();
            
            // 截取前500个字符作为摘要
            if (cleanContent.length() > 500) {
                document.setPreview(cleanContent.substring(0, 500));
                document.setContent(cleanContent.substring(0, Math.min(cleanContent.length(), 2000))); // 限制内容长度
            } else {
                document.setPreview(cleanContent);
                document.setContent(cleanContent);
            }
        }
        
        document.setKeywords(article.getKeywords());
        document.setSortId(article.getSortId());
        document.setLabelId(article.getLabelId());
        document.setUserId(article.getUserId());
        document.setViewCount(article.getViewCount() != null ? article.getViewCount() : 0);
        document.setLikeCount(article.getLikeCount() != null ? article.getLikeCount() : 0);
        document.setRecommendStatus(article.getRecommendStatus() != null ? article.getRecommendStatus() : false);
        document.setViewStatus(article.getViewStatus() != null ? article.getViewStatus() : false);
        document.setCreateTime(article.getCreateTime());
        document.setUpdateTime(article.getUpdateTime());
        document.setCover(article.getArticleCover());

        return document;
    }

    @Override
    public boolean indexExists() {
        try {
            return elasticsearchRestTemplate.indexExists(ArticleDocument.class);
        } catch (Exception e) {
            logger.error("检查索引是否存在失败", e);
            return false;
        }
    }

    @Override
    public void createIndex() {
        try {
            if (!elasticsearchRestTemplate.indexExists(ArticleDocument.class)) {
                elasticsearchRestTemplate.createIndex(ArticleDocument.class);
                elasticsearchRestTemplate.putMapping(ArticleDocument.class);
                logger.info("创建Elasticsearch索引成功: {}", searchProperties.getIndexName());
            }
        } catch (Exception e) {
            logger.error("创建Elasticsearch索引失败", e);
        }
    }

    @Override
    public void deleteIndex() {
        try {
            if (elasticsearchRestTemplate.indexExists(ArticleDocument.class)) {
                elasticsearchRestTemplate.deleteIndex(ArticleDocument.class);
                logger.info("删除Elasticsearch索引成功: {}", searchProperties.getIndexName());
            }
        } catch (Exception e) {
            logger.error("删除Elasticsearch索引失败", e);
        }
    }
}
