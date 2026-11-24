package com.ld.poetry.search.controller;

import com.ld.poetry.config.PoetryResult;
import com.ld.poetry.search.document.ArticleDocument;
import com.ld.poetry.search.service.RecommendService;
import com.ld.poetry.utils.PoetryUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 推荐控制器
 * 
 * @author sara
 * @since 2024-11-17
 */
@RestController
@RequestMapping("/api/recommend")
public class RecommendController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendController.class);

    @Autowired
    private RecommendService recommendService;

    /**
     * 获取个性化推荐文章
     * 
     * @param size 推荐数量，默认5
     * @param excludeIds 排除的文章ID，用逗号分隔
     * @return 推荐文章列表
     */
    @GetMapping("/articles")
    public PoetryResult<List<ArticleDocument>> getPersonalizedRecommendations(
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(required = false) String excludeIds) {
        
        try {
            Integer userId = PoetryUtil.getUserId();
            
            List<Integer> excludeIdList = Collections.emptyList();
            if (StringUtils.hasText(excludeIds)) {
                excludeIdList = Arrays.stream(excludeIds.split(","))
                        .map(String::trim)
                        .filter(StringUtils::hasText)
                        .map(Integer::valueOf)
                        .collect(Collectors.toList());
            }
            
            List<ArticleDocument> recommendations = recommendService.getPersonalizedRecommendations(userId, size, excludeIdList);
            return PoetryResult.success(recommendations);
            
        } catch (Exception e) {
            logger.error("获取个性化推荐失败", e);
            return PoetryResult.fail("获取推荐失败");
        }
    }

    /**
     * 获取相似文章推荐
     * 
     * @param articleId 文章ID
     * @param size 推荐数量，默认5
     * @return 相似文章列表
     */
    @GetMapping("/similar/{articleId}")
    public PoetryResult<List<ArticleDocument>> getSimilarArticles(
            @PathVariable Integer articleId,
            @RequestParam(defaultValue = "5") Integer size) {
        
        try {
            List<ArticleDocument> similarArticles = recommendService.getSimilarArticles(articleId, size);
            return PoetryResult.success(similarArticles);
            
        } catch (Exception e) {
            logger.error("获取相似文章推荐失败, articleId: {}", articleId, e);
            return PoetryResult.fail("获取相似文章失败");
        }
    }

    /**
     * 获取热门文章推荐
     * 
     * @param size 推荐数量，默认10
     * @param timeRange 时间范围（天数），默认30天
     * @return 热门文章列表
     */
    @GetMapping("/hot")
    public PoetryResult<List<ArticleDocument>> getHotArticles(
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "30") Integer timeRange) {
        
        try {
            List<ArticleDocument> hotArticles = recommendService.getHotArticles(size, timeRange);
            return PoetryResult.success(hotArticles);
            
        } catch (Exception e) {
            logger.error("获取热门文章失败", e);
            return PoetryResult.fail("获取热门文章失败");
        }
    }

    /**
     * 根据分类获取推荐文章
     * 
     * @param sortId 分类ID
     * @param size 推荐数量，默认10
     * @param excludeIds 排除的文章ID，用逗号分隔
     * @return 推荐文章列表
     */
    @GetMapping("/sort/{sortId}")
    public PoetryResult<List<ArticleDocument>> getRecommendationsBySortId(
            @PathVariable Integer sortId,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String excludeIds) {
        
        try {
            List<Integer> excludeIdList = Collections.emptyList();
            if (StringUtils.hasText(excludeIds)) {
                excludeIdList = Arrays.stream(excludeIds.split(","))
                        .map(String::trim)
                        .filter(StringUtils::hasText)
                        .map(Integer::valueOf)
                        .collect(Collectors.toList());
            }
            
            List<ArticleDocument> recommendations = recommendService.getRecommendationsBySortId(sortId, size, excludeIdList);
            return PoetryResult.success(recommendations);
            
        } catch (Exception e) {
            logger.error("根据分类获取推荐失败, sortId: {}", sortId, e);
            return PoetryResult.fail("获取分类推荐失败");
        }
    }

    /**
     * 根据标签获取推荐文章
     * 
     * @param labelId 标签ID
     * @param size 推荐数量，默认10
     * @param excludeIds 排除的文章ID，用逗号分隔
     * @return 推荐文章列表
     */
    @GetMapping("/label/{labelId}")
    public PoetryResult<List<ArticleDocument>> getRecommendationsByLabelId(
            @PathVariable Integer labelId,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String excludeIds) {
        
        try {
            List<Integer> excludeIdList = Collections.emptyList();
            if (StringUtils.hasText(excludeIds)) {
                excludeIdList = Arrays.stream(excludeIds.split(","))
                        .map(String::trim)
                        .filter(StringUtils::hasText)
                        .map(Integer::valueOf)
                        .collect(Collectors.toList());
            }
            
            List<ArticleDocument> recommendations = recommendService.getRecommendationsByLabelId(labelId, size, excludeIdList);
            return PoetryResult.success(recommendations);
            
        } catch (Exception e) {
            logger.error("根据标签获取推荐失败, labelId: {}", labelId, e);
            return PoetryResult.fail("获取标签推荐失败");
        }
    }

    /**
     * 搜索文章
     * 
     * @param keyword 搜索关键词
     * @param page 页码，从0开始，默认0
     * @param size 每页大小，默认10
     * @return 搜索结果
     */
    @GetMapping("/search")
    public PoetryResult<Page<ArticleDocument>> searchArticles(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        try {
            Page<ArticleDocument> searchResults = recommendService.searchArticles(keyword, page, size);
            return PoetryResult.success(searchResults);
            
        } catch (Exception e) {
            logger.error("搜索文章失败, keyword: {}", keyword, e);
            return PoetryResult.fail("搜索失败");
        }
    }

    /**
     * 获取系统推荐文章
     * 
     * @param page 页码，从0开始，默认0
     * @param size 每页大小，默认10
     * @return 推荐文章列表
     */
    @GetMapping("/system")
    public PoetryResult<Page<ArticleDocument>> getRecommendedArticles(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        try {
            Page<ArticleDocument> recommendedArticles = recommendService.getRecommendedArticles(page, size);
            return PoetryResult.success(recommendedArticles);
            
        } catch (Exception e) {
            logger.error("获取系统推荐文章失败", e);
            return PoetryResult.fail("获取系统推荐失败");
        }
    }
}
