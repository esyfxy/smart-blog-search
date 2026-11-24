package com.ld.poetry.search.repository;

import com.ld.poetry.search.document.ArticleDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 文章搜索Repository
 * 
 * @author sara
 * @since 2024-11-17
 */
@Repository
public interface ArticleSearchRepository extends ElasticsearchRepository<ArticleDocument, Integer> {

    /**
     * 根据标题和内容搜索文章
     */
    @Query("{\"bool\":{\"must\":[{\"match\":{\"viewStatus\":true}}],\"should\":[{\"match\":{\"title\":\"?0\"}},{\"match\":{\"content\":\"?0\"}},{\"match\":{\"keywords\":\"?0\"}}]}}")
    Page<ArticleDocument> findByTitleOrContentOrKeywords(String keyword, Pageable pageable);

    /**
     * 根据分类ID查找文章
     */
    Page<ArticleDocument> findBySortIdAndViewStatusTrue(Integer sortId, Pageable pageable);

    /**
     * 根据标签ID查找文章
     */
    Page<ArticleDocument> findByLabelIdAndViewStatusTrue(Integer labelId, Pageable pageable);

    /**
     * 查找推荐文章
     */
    Page<ArticleDocument> findByRecommendStatusTrueAndViewStatusTrueOrderByViewCountDescCreateTimeDesc(Pageable pageable);

    /**
     * 查找热门文章
     */
    Page<ArticleDocument> findByViewStatusTrueOrderByViewCountDescLikeCountDescCreateTimeDesc(Pageable pageable);

    /**
     * 根据用户ID查找文章
     */
    Page<ArticleDocument> findByUserIdAndViewStatusTrue(Integer userId, Pageable pageable);

    /**
     * 查找相似文章（基于分类和标签）
     */
    @Query("{\"bool\":{\"must\":[{\"match\":{\"viewStatus\":true}},{\"bool\":{\"must_not\":[{\"term\":{\"id\":\"?2\"}}]}}],\"should\":[{\"term\":{\"sortId\":\"?0\"}},{\"term\":{\"labelId\":\"?1\"}}]}}")
    Page<ArticleDocument> findSimilarArticles(Integer sortId, Integer labelId, Integer excludeId, Pageable pageable);

    /**
     * 多字段搜索
     */
    @Query("{\"bool\":{\"must\":[{\"match\":{\"viewStatus\":true}}],\"should\":[{\"multi_match\":{\"query\":\"?0\",\"fields\":[\"title^2\",\"content\",\"keywords^1.5\"],\"type\":\"best_fields\"}}]}}")
    Page<ArticleDocument> multiFieldSearch(String keyword, Pageable pageable);

    /**
     * 根据ID列表查找文章
     */
    List<ArticleDocument> findByIdInAndViewStatusTrue(List<Integer> ids);
}
