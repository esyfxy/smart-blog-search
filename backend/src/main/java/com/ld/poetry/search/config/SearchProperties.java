package com.ld.poetry.search.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 搜索配置属性类
 * 
 * @author sara
 * @since 2024-11-17
 */
@Component
@ConfigurationProperties(prefix = "search")
public class SearchProperties {

    private String indexName = "ablaze_articles";
    
    private int defaultPageSize = 10;
    
    private int maxPageSize = 100;
    
    private Recommend recommend = new Recommend();

    public String getIndexName() {
        return indexName;
    }

    public void setIndexName(String indexName) {
        this.indexName = indexName;
    }

    public int getDefaultPageSize() {
        return defaultPageSize;
    }

    public void setDefaultPageSize(int defaultPageSize) {
        this.defaultPageSize = defaultPageSize;
    }

    public int getMaxPageSize() {
        return maxPageSize;
    }

    public void setMaxPageSize(int maxPageSize) {
        this.maxPageSize = maxPageSize;
    }

    public Recommend getRecommend() {
        return recommend;
    }

    public void setRecommend(Recommend recommend) {
        this.recommend = recommend;
    }

    public static class Recommend {
        private int defaultSize = 5;
        private int maxSize = 20;
        private double contentWeight = 0.6;
        private double viewWeight = 0.3;
        private double timeWeight = 0.1;
        private int cacheTtl = 300; // 5分钟缓存

        public int getDefaultSize() {
            return defaultSize;
        }

        public void setDefaultSize(int defaultSize) {
            this.defaultSize = defaultSize;
        }

        public int getMaxSize() {
            return maxSize;
        }

        public void setMaxSize(int maxSize) {
            this.maxSize = maxSize;
        }

        public double getContentWeight() {
            return contentWeight;
        }

        public void setContentWeight(double contentWeight) {
            this.contentWeight = contentWeight;
        }

        public double getViewWeight() {
            return viewWeight;
        }

        public void setViewWeight(double viewWeight) {
            this.viewWeight = viewWeight;
        }

        public double getTimeWeight() {
            return timeWeight;
        }

        public void setTimeWeight(double timeWeight) {
            this.timeWeight = timeWeight;
        }

        public int getCacheTtl() {
            return cacheTtl;
        }

        public void setCacheTtl(int cacheTtl) {
            this.cacheTtl = cacheTtl;
        }
    }
}
