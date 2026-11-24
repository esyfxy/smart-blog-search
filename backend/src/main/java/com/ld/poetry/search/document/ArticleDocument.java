package com.ld.poetry.search.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

/**
 * 文章搜索文档实体
 * 
 * @author sara
 * @since 2024-11-17
 */
@Document(indexName = "ablaze_articles")
public class ArticleDocument {

    @Id
    private Integer id;

    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Text)
    private String content;

    @Field(type = FieldType.Text)
    private String preview;

    @Field(type = FieldType.Keyword)
    private String keywords;

    @Field(type = FieldType.Integer)
    private Integer sortId;

    @Field(type = FieldType.Integer)
    private Integer labelId;

    @Field(type = FieldType.Integer)
    private Integer userId;

    @Field(type = FieldType.Integer)
    private Integer viewCount;

    @Field(type = FieldType.Integer)
    private Integer likeCount;

    @Field(type = FieldType.Boolean)
    private Boolean recommendStatus;

    @Field(type = FieldType.Boolean)
    private Boolean viewStatus;

    @Field(type = FieldType.Date)
    private LocalDateTime createTime;

    @Field(type = FieldType.Date)
    private LocalDateTime updateTime;

    @Field(type = FieldType.Keyword)
    private String cover;

    public ArticleDocument() {}

    public ArticleDocument(Integer id, String title, String content, String preview, 
                          String keywords, Integer sortId, Integer labelId, Integer userId,
                          Integer viewCount, Integer likeCount, Boolean recommendStatus,
                          Boolean viewStatus, LocalDateTime createTime, LocalDateTime updateTime,
                          String cover) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.preview = preview;
        this.keywords = keywords;
        this.sortId = sortId;
        this.labelId = labelId;
        this.userId = userId;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.recommendStatus = recommendStatus;
        this.viewStatus = viewStatus;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.cover = cover;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPreview() {
        return preview;
    }

    public void setPreview(String preview) {
        this.preview = preview;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public Integer getSortId() {
        return sortId;
    }

    public void setSortId(Integer sortId) {
        this.sortId = sortId;
    }

    public Integer getLabelId() {
        return labelId;
    }

    public void setLabelId(Integer labelId) {
        this.labelId = labelId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Boolean getRecommendStatus() {
        return recommendStatus;
    }

    public void setRecommendStatus(Boolean recommendStatus) {
        this.recommendStatus = recommendStatus;
    }

    public Boolean getViewStatus() {
        return viewStatus;
    }

    public void setViewStatus(Boolean viewStatus) {
        this.viewStatus = viewStatus;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public String getCover() {
        return cover;
    }

    public void setCover(String cover) {
        this.cover = cover;
    }

    @Override
    public String toString() {
        return "ArticleDocument{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", preview='" + preview + '\'' +
                ", keywords='" + keywords + '\'' +
                ", sortId=" + sortId +
                ", labelId=" + labelId +
                ", userId=" + userId +
                ", viewCount=" + viewCount +
                ", likeCount=" + likeCount +
                ", recommendStatus=" + recommendStatus +
                ", viewStatus=" + viewStatus +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", cover='" + cover + '\'' +
                '}';
    }
}
