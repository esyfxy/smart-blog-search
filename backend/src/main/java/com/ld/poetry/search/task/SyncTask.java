package com.ld.poetry.search.task;

import com.ld.poetry.search.service.SearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 同步任务
 * 
 * @author sara
 * @since 2024-11-17
 */
@Component
public class SyncTask {

    private static final Logger logger = LoggerFactory.getLogger(SyncTask.class);

    @Autowired
    private SearchService searchService;

    /**
     * 应用启动后执行初始化
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        logger.info("应用启动完成，开始检查Elasticsearch索引");
        
        try {
            // 检查索引是否存在，不存在则创建
            if (!searchService.indexExists()) {
                logger.info("Elasticsearch索引不存在，开始创建索引并进行全量同步");
                searchService.createIndex();
                // 异步执行全量同步，避免阻塞应用启动
                new Thread(() -> {
                    try {
                        Thread.sleep(5000); // 等待5秒确保应用完全启动
                        searchService.fullSyncArticles();
                    } catch (Exception e) {
                        logger.error("启动时全量同步失败", e);
                    }
                }).start();
            } else {
                logger.info("Elasticsearch索引已存在，跳过初始化同步");
            }
        } catch (Exception e) {
            logger.error("应用启动时检查Elasticsearch索引失败", e);
        }
    }

    /**
     * 定时同步任务
     * 每天凌晨2点执行全量同步，确保数据一致性
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduledFullSync() {
        logger.info("开始执行定时全量同步任务");
        
        try {
            searchService.fullSyncArticles();
            logger.info("定时全量同步任务完成");
        } catch (Exception e) {
            logger.error("定时全量同步任务失败", e);
        }
    }

    /**
     * 定时健康检查
     * 每小时检查一次Elasticsearch连接状态
     */
    @Scheduled(fixedRate = 3600000) // 1小时 = 3600000毫秒
    public void healthCheck() {
        try {
            boolean indexExists = searchService.indexExists();
            if (!indexExists) {
                logger.warn("Elasticsearch索引不存在，尝试重新创建");
                searchService.createIndex();
            }
        } catch (Exception e) {
            logger.error("Elasticsearch健康检查失败", e);
        }
    }
}
