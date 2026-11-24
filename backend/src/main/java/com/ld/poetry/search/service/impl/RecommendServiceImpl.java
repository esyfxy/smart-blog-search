package com.ld.poetry.search.service.impl;

import com.ld.poetry.search.config.SearchProperties;
import com.ld.poetry.search.document.ArticleDocument;
import com.ld.poetry.search.repository.ArticleSearchRepository;
import com.ld.poetry.search.service.RecommendService;
import com.ld.poetry.utils.PoetryUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 推荐服务实现类
 * 
 * @author sara
 * @since 2024-11-17
 */
@Service
public class RecommendServiceImpl implements RecommendService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendServiceImpl.class);

    @Autowired
    private ArticleSearchRepository articleSearchRepository;

    @Autowired
    private SearchProperties searchProperties;

    @Override
    @Cacheable(value = "personalizedRecommendations", key = "#userId + '_' + #size", unless = "#result.isEmpty()")
    public List<ArticleDocument> getPersonalizedRecommendations(Integer userId, Integer size, List<Integer> excludeIds) {
        if (size == null || size <= 0) {
            size = searchProperties.getRecommend().getDefaultSize();
        }
        if (size > searchProperties.getRecommend().getMaxSize()) {
            size = searchProperties.getRecommend().getMaxSize();
        }

        List<ArticleDocument> recommendations = new ArrayList<>();
        
        try {
            // 1. 获取用户历史浏览的文章分类和标签（这里简化处理，实际应该从用户行为表获取）
            // 2. 基于内容的推荐
            List<ArticleDocument> contentBasedRecommendations = getContentBasedRecommendations(userId, size / 2, excludeIds);
            recommendations.addAll(contentBasedRecommendations);
            
            // 3. 基于热度的推荐
            int remainingSize = size - recommendations.size();
            if (remainingSize > 0) {
                List<ArticleDocument> hotRecommendations = getHotArticles(remainingSize, 30);
                // 过滤已推荐的文章
                Set<Integer> existingIds = recommendations.stream().map(ArticleDocument::getId).collect(Collectors.toSet());
                if (excludeIds != null) {
                    existingIds.addAll(excludeIds);
                }
                hotRecommendations = hotRecommendations.stream()
                        .filter(article -> !existingIds.contains(article.getId()))
                        .limit(remainingSize)
                        .collect(Collectors.toList());
                recommendations.addAll(hotRecommendations);
            }
            
        } catch (Exception e) {
            logger.error("获取个性化推荐失败", e);
            // 降级策略：返回热门文章
            return getHotArticles(size, 7);
        }

        return recommendations.stream().limit(size).collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "similarArticles", key = "#articleId + '_' + #size")
    public List<ArticleDocument> getSimilarArticles(Integer articleId, Integer size) {
        if (size == null || size <= 0) {
            size = searchProperties.getRecommend().getDefaultSize();
        }

        try {
            // 先获取原文章信息
            Optional<ArticleDocument> originalArticle = articleSearchRepository.findById(articleId);
            if (!originalArticle.isPresent()) {
                return Collections.emptyList();
            }

            ArticleDocument article = originalArticle.get();
            Pageable pageable = PageRequest.of(0, size);
            
            // 基于分类和标签查找相似文章
            Page<ArticleDocument> similarPage = articleSearchRepository.findSimilarArticles(
                    article.getSortId(), article.getLabelId(), articleId, pageable);
            
            return similarPage.getContent();
            
        } catch (Exception e) {
            logger.error("获取相似文章推荐失败, articleId: {}", articleId, e);
            return Collections.emptyList();
        }
    }

    @Override
    @Cacheable(value = "hotArticles", key = "#size + '_' + #timeRange")
    public List<ArticleDocument> getHotArticles(Integer size, Integer timeRange) {
        if (size == null || size <= 0) {
            size = searchProperties.getRecommend().getDefaultSize();
        }

        try {
            Pageable pageable = PageRequest.of(0, size);
            Page<ArticleDocument> hotPage = articleSearchRepository.findByViewStatusTrueOrderByViewCountDescLikeCountDescCreateTimeDesc(pageable);
            
            List<ArticleDocument> hotArticles = hotPage.getContent();
            
            // 如果指定了时间范围，进行时间过滤
            if (timeRange != null && timeRange > 0) {
                LocalDateTime cutoffTime = LocalDateTime.now().minusDays(timeRange);
                hotArticles = hotArticles.stream()
                        .filter(article -> article.getCreateTime().isAfter(cutoffTime))
                        .collect(Collectors.toList());
            }
            
            return hotArticles;
            
        } catch (Exception e) {
            logger.error("获取热门文章失败", e);
            return Collections.emptyList();
        }
    }

    @Override
    public List<ArticleDocument> getRecommendationsBySortId(Integer sortId, Integer size, List<Integer> excludeIds) {
        if (size == null || size <= 0) {
            size = searchProperties.getRecommend().getDefaultSize();
        }

        try {
            Pageable pageable = PageRequest.of(0, size * 2); // 获取更多数据用于过滤
            Page<ArticleDocument> page = articleSearchRepository.findBySortIdAndViewStatusTrue(sortId, pageable);
            
            List<ArticleDocument> articles = page.getContent();
            
            // 过滤排除的文章
            if (!CollectionUtils.isEmpty(excludeIds)) {
                Set<Integer> excludeSet = new HashSet<>(excludeIds);
                articles = articles.stream()
                        .filter(article -> !excludeSet.contains(article.getId()))
                        .collect(Collectors.toList());
            }
            
            return articles.stream().limit(size).collect(Collectors.toList());
            
        } catch (Exception e) {
            logger.error("根据分类获取推荐失败, sortId: {}", sortId, e);
            return Collections.emptyList();
        }
    }

    @Override
    public List<ArticleDocument> getRecommendationsByLabelId(Integer labelId, Integer size, List<Integer> excludeIds) {
        if (size == null || size <= 0) {
            size = searchProperties.getRecommend().getDefaultSize();
        }

        try {
            Pageable pageable = PageRequest.of(0, size * 2); // 获取更多数据用于过滤
            Page<ArticleDocument> page = articleSearchRepository.findByLabelIdAndViewStatusTrue(labelId, pageable);
            
            List<ArticleDocument> articles = page.getContent();
            
            // 过滤排除的文章
            if (!CollectionUtils.isEmpty(excludeIds)) {
                Set<Integer> excludeSet = new HashSet<>(excludeIds);
                articles = articles.stream()
                        .filter(article -> !excludeSet.contains(article.getId()))
                        .collect(Collectors.toList());
            }
            
            return articles.stream().limit(size).collect(Collectors.toList());
            
        } catch (Exception e) {
            logger.error("根据标签获取推荐失败, labelId: {}", labelId, e);
            return Collections.emptyList();
        }
    }

    @Override
    public Page<ArticleDocument> searchArticles(String keyword, Integer page, Integer size) {
        if (page == null || page < 0) {
            page = 0;
        }
        if (size == null || size <= 0) {
            size = searchProperties.getDefaultPageSize();
        }
        if (size > searchProperties.getMaxPageSize()) {
            size = searchProperties.getMaxPageSize();
        }

        try {
            Pageable pageable = PageRequest.of(page, size);
            
            if (!StringUtils.hasText(keyword)) {
                // 如果没有关键词，返回推荐文章
                return articleSearchRepository.findByRecommendStatusTrueAndViewStatusTrueOrderByViewCountDescCreateTimeDesc(pageable);
            }
            
            // 使用多字段搜索
            return articleSearchRepository.multiFieldSearch(keyword.trim(), pageable);
            
        } catch (Exception e) {
            logger.error("搜索文章失败, keyword: {}", keyword, e);
            // 降级策略：返回空页面
            return Page.empty();
        }
    }

    @Override
    @Cacheable(value = "recommendedArticles", key = "#page + '_' + #size")
    public Page<ArticleDocument> getRecommendedArticles(Integer page, Integer size) {
        if (page == null || page < 0) {
            page = 0;
        }
        if (size == null || size <= 0) {
            size = searchProperties.getDefaultPageSize();
        }

        try {
            Pageable pageable = PageRequest.of(page, size);
            return articleSearchRepository.findByRecommendStatusTrueAndViewStatusTrueOrderByViewCountDescCreateTimeDesc(pageable);
            
        } catch (Exception e) {
            logger.error("获取推荐文章失败", e);
            return Page.empty();
        }
    }

    /**
     * 获取基于内容的推荐
     */
    private List<ArticleDocument> getContentBasedRecommendations(Integer userId, Integer size, List<Integer> excludeIds) {
        // 这里简化处理，实际应该根据用户的历史行为分析偏好
        // 可以从用户浏览历史、点赞历史等获取用户偏好的分类和标签
        
        try {
            // 获取推荐文章作为基础推荐
            Pageable pageable = PageRequest.of(0, size);
            Page<ArticleDocument> recommendedPage = articleSearchRepository.findByRecommendStatusTrueAndViewStatusTrueOrderByViewCountDescCreateTimeDesc(pageable);
            
            List<ArticleDocument> articles = recommendedPage.getContent();
            
            // 过滤排除的文章
            if (!CollectionUtils.isEmpty(excludeIds)) {
                Set<Integer> excludeSet = new HashSet<>(excludeIds);
                articles = articles.stream()
                        .filter(article -> !excludeSet.contains(article.getId()))
                        .collect(Collectors.toList());
            }
            
            return articles;
            
        } catch (Exception e) {
            logger.error("获取基于内容的推荐失败", e);
            return Collections.emptyList();
        }
    }
}
