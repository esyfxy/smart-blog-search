# Elasticsearch 博客推荐系统

## 概述

基于 Elasticsearch 的博客推荐系统，提供智能文章推荐、搜索和相关文章发现功能。

## 功能特性

### 1. 智能推荐
- **个性化推荐**: 基于用户行为和偏好的个性化文章推荐
- **相似文章**: 基于内容相似度的文章推荐
- **热门文章**: 基于浏览量和点赞数的热门文章推荐
- **分类推荐**: 基于文章分类的推荐
- **标签推荐**: 基于文章标签的推荐

### 2. 搜索功能
- **全文搜索**: 支持标题、内容、关键词的全文搜索
- **多字段搜索**: 智能权重分配的多字段搜索
- **分页查询**: 支持分页的搜索结果

### 3. 数据同步
- **实时同步**: 文章增删改时自动同步到 Elasticsearch
- **批量同步**: 支持批量数据同步
- **全量同步**: 支持全量数据重建
- **定时同步**: 定时任务保证数据一致性

## 技术架构

### 核心组件
```
├── config/                 # 配置类
│   ├── ElasticsearchConfig.java    # ES配置
│   └── SearchProperties.java       # 搜索属性配置
├── document/               # 文档实体
│   └── ArticleDocument.java        # 文章搜索文档
├── repository/             # 数据访问层
│   └── ArticleSearchRepository.java # 文章搜索Repository
├── service/                # 服务层
│   ├── RecommendService.java        # 推荐服务接口
│   ├── SearchService.java           # 搜索服务接口
│   └── impl/                        # 服务实现
├── controller/             # 控制器
│   └── RecommendController.java     # 推荐控制器
├── listener/               # 事件监听器
│   └── ArticleSyncListener.java     # 同步监听器
└── task/                   # 定时任务
    └── SyncTask.java               # 同步任务
```

## API 接口

### 推荐接口

#### 1. 个性化推荐
```http
GET /api/recommend/articles?size=5&excludeIds=1,2,3
```

#### 2. 相似文章推荐
```http
GET /api/recommend/similar/{articleId}?size=5
```

#### 3. 热门文章推荐
```http
GET /api/recommend/hot?size=10&timeRange=30
```

#### 4. 分类推荐
```http
GET /api/recommend/sort/{sortId}?size=10&excludeIds=1,2,3
```

#### 5. 标签推荐
```http
GET /api/recommend/label/{labelId}?size=10&excludeIds=1,2,3
```

#### 6. 文章搜索
```http
GET /api/recommend/search?keyword=关键词&page=0&size=10
```

#### 7. 系统推荐
```http
GET /api/recommend/system?page=0&size=10
```

## 配置说明

### application-elasticsearch.yml
```yaml
# Elasticsearch连接配置
elasticsearch:
  host: localhost
  port: 9200
  username: 
  password: 

# 搜索功能配置
search:
  index-name: ablaze_articles      # 索引名称
  default-page-size: 10            # 默认分页大小
  max-page-size: 100              # 最大分页大小
  recommend:
    default-size: 5               # 默认推荐数量
    max-size: 20                  # 最大推荐数量
    content-weight: 0.6           # 内容权重
    view-weight: 0.3              # 浏览量权重
    time-weight: 0.1              # 时间权重
    cache-ttl: 300                # 缓存TTL(秒)
```

## 部署指南

### 1. 安装 Elasticsearch
```bash
# 使用 Docker 安装
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  elasticsearch:7.17.9
```

### 2. 安装 IK 分词器 (可选)
```bash
# 进入容器
docker exec -it elasticsearch bash

# 安装 IK 分词器
./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.17.9/elasticsearch-analysis-ik-7.17.9.zip

# 重启容器
docker restart elasticsearch
```

### 3. 配置应用
在 `application.yml` 中添加：
```yaml
spring:
  profiles:
    include: elasticsearch
```

### 4. 启动应用
应用启动时会自动：
- 检查 Elasticsearch 连接
- 创建索引（如果不存在）
- 执行全量数据同步

## 监控与运维

### 1. 健康检查
系统提供定时健康检查，每小时检查一次 Elasticsearch 连接状态。

### 2. 日志监控
关键操作都有详细的日志记录：
- 数据同步日志
- 搜索查询日志
- 错误异常日志

### 3. 缓存策略
- Redis 缓存推荐结果
- 缓存 TTL 可配置
- 支持缓存预热

## 性能优化

### 1. 索引优化
- 合理设置分片和副本数
- 使用 IK 分词器提升中文搜索效果
- 定期清理无用数据

### 2. 查询优化
- 使用 bool 查询组合条件
- 合理设置字段权重
- 避免深度分页

### 3. 缓存优化
- 热门推荐结果缓存
- 用户个性化推荐缓存
- 搜索结果分页缓存

## 故障排除

### 常见问题

1. **Elasticsearch 连接失败**
   - 检查 ES 服务是否启动
   - 验证连接配置是否正确
   - 检查网络连通性

2. **索引创建失败**
   - 检查 ES 集群状态
   - 验证索引配置是否正确
   - 检查磁盘空间是否充足

3. **数据同步异常**
   - 查看同步日志
   - 检查数据库连接
   - 验证数据格式是否正确

4. **搜索结果不准确**
   - 检查分词器配置
   - 调整字段权重
   - 优化查询条件

### 日志分析
```bash
# 查看同步日志
grep "sync" application.log

# 查看搜索日志  
grep "search" application.log

# 查看错误日志
grep "ERROR" application.log
```

## 扩展开发

### 1. 自定义推荐算法
实现 `RecommendService` 接口，添加自定义推荐逻辑。

### 2. 添加新的搜索字段
1. 修改 `ArticleDocument` 添加新字段
2. 更新索引映射配置
3. 修改转换逻辑

### 3. 集成机器学习
可以集成机器学习模型，提供更智能的推荐算法。

## 版本历史

- v1.0.0: 基础搜索和推荐功能
- v1.1.0: 添加缓存支持
- v1.2.0: 优化推荐算法
- v1.3.0: 添加定时同步任务
