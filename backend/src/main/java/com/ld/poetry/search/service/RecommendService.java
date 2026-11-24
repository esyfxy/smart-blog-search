package com.ld.poetry.search.service;

import com.ld.poetry.search.document.ArticleDocument;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * 推荐服务接口
 * 
 * @author sara
 * @since 2024-11-17
 */
public interface RecommendService {

    /**
     * 获取个性化推荐文章
     * 
     * @param userId 用户ID
     * @param size 推荐数量
     * @param excludeIds 排除的文章ID列表
     * @return 推荐文章列表
     */
    List<ArticleDocument> getPersonalizedRecommendations(Integer userId, Integer size, List<Integer> excludeIds);

    /**
     * 获取相似文章推荐
     * 
     * @param articleId 文章ID
     * @param size 推荐数量
     * @return 相似文章列表
     */
    List<ArticleDocument> getSimilarArticles(Integer articleId, Integer size);

    /**
     * 获取热门文章推荐
     * 
     * @param size 推荐数量
     * @param timeRange 时间范围（天数）
     * @return 热门文章列表
     */
    List<ArticleDocument> getHotArticles(Integer size, Integer timeRange);

    /**
     * 获取基于分类的推荐
     * 
     * @param sortId 分类ID
     * @param size 推荐数量
     * @param excludeIds 排除的文章ID列表
     * @return 推荐文章列表
     */
    List<ArticleDocument> getRecommendationsBySortId(Integer sortId, Integer size, List<Integer> excludeIds);

    /**
     * 获取基于标签的推荐
     * 
     * @param labelId 标签ID
     * @param size 推荐数量
     * @param excludeIds 排除的文章ID列表
     * @return 推荐文章列表
     */
    List<ArticleDocument> getRecommendationsByLabelId(Integer labelId, Integer size, List<Integer> excludeIds);

    /**
     * 搜索文章
     * 
     * @param keyword 关键词
     * @param page 页码
     * @param size 每页大小
     * @return 搜索结果
     */
    Page<ArticleDocument> searchArticles(String keyword, Integer page, Integer size);

    /**
     * 获取推荐文章（系统推荐状态为true的文章）
     * 
     * @param page 页码
     * @param size 每页大小
     * @return 推荐文章列表
     */
    Page<ArticleDocument> getRecommendedArticles(Integer page, Integer size);
}
