package com.ld.poetry.search.service;

import com.ld.poetry.entity.Article;
import com.ld.poetry.search.document.ArticleDocument;

import java.util.List;

/**
 * 搜索服务接口
 * 
 * @author sara
 * @since 2024-11-17
 */
public interface SearchService {

    /**
     * 同步单个文章到Elasticsearch
     * 
     * @param article 文章实体
     */
    void syncArticle(Article article);

    /**
     * 删除Elasticsearch中的文章
     * 
     * @param articleId 文章ID
     */
    void deleteArticle(Integer articleId);

    /**
     * 批量同步文章到Elasticsearch
     * 
     * @param articles 文章列表
     */
    void batchSyncArticles(List<Article> articles);

    /**
     * 全量同步文章数据
     */
    void fullSyncArticles();

    /**
     * 将Article实体转换为ArticleDocument
     * 
     * @param article 文章实体
     * @return 文章搜索文档
     */
    ArticleDocument convertToDocument(Article article);

    /**
     * 检查索引是否存在
     * 
     * @return 是否存在
     */
    boolean indexExists();

    /**
     * 创建索引
     */
    void createIndex();

    /**
     * 删除索引
     */
    void deleteIndex();
}
