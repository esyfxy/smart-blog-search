package com.ld.poetry.search.listener;

import com.ld.poetry.entity.Article;
import com.ld.poetry.search.service.SearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * 文章同步监听器
 * 监听文章的增删改操作，自动同步到Elasticsearch
 * 
 * @author sara
 * @since 2024-11-17
 */
@Component
public class ArticleSyncListener {

    private static final Logger logger = LoggerFactory.getLogger(ArticleSyncListener.class);

    @Autowired
    private SearchService searchService;

    /**
     * 监听文章创建事件
     */
    @Async
    @EventListener
    public void handleArticleCreated(ArticleCreatedEvent event) {
        try {
            Article article = event.getArticle();
            logger.info("监听到文章创建事件，开始同步到Elasticsearch: {}", article.getId());
            searchService.syncArticle(article);
        } catch (Exception e) {
            logger.error("处理文章创建事件失败", e);
        }
    }

    /**
     * 监听文章更新事件
     */
    @Async
    @EventListener
    public void handleArticleUpdated(ArticleUpdatedEvent event) {
        try {
            Article article = event.getArticle();
            logger.info("监听到文章更新事件，开始同步到Elasticsearch: {}", article.getId());
            searchService.syncArticle(article);
        } catch (Exception e) {
            logger.error("处理文章更新事件失败", e);
        }
    }

    /**
     * 监听文章删除事件
     */
    @Async
    @EventListener
    public void handleArticleDeleted(ArticleDeletedEvent event) {
        try {
            Integer articleId = event.getArticleId();
            logger.info("监听到文章删除事件，开始从Elasticsearch删除: {}", articleId);
            searchService.deleteArticle(articleId);
        } catch (Exception e) {
            logger.error("处理文章删除事件失败", e);
        }
    }

    /**
     * 文章创建事件
     */
    public static class ArticleCreatedEvent {
        private final Article article;

        public ArticleCreatedEvent(Article article) {
            this.article = article;
        }

        public Article getArticle() {
            return article;
        }
    }

    /**
     * 文章更新事件
     */
    public static class ArticleUpdatedEvent {
        private final Article article;

        public ArticleUpdatedEvent(Article article) {
            this.article = article;
        }

        public Article getArticle() {
            return article;
        }
    }

    /**
     * 文章删除事件
     */
    public static class ArticleDeletedEvent {
        private final Integer articleId;

        public ArticleDeletedEvent(Integer articleId) {
            this.articleId = articleId;
        }

        public Integer getArticleId() {
            return articleId;
        }
    }
}
