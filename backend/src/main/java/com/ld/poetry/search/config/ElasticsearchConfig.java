package com.ld.poetry.search.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

/**
 * Elasticsearch配置类
 * 
 * @author sara
 * @since 2024-11-17
 */
@Configuration
@EnableElasticsearchRepositories(basePackages = "com.ld.poetry.search.repository")
public class ElasticsearchConfig extends AbstractElasticsearchConfiguration {

    @Value("${elasticsearch.host:localhost}")
    private String host;

    @Value("${elasticsearch.port:9200}")
    private int port;

    @Override
    @Bean
    public RestHighLevelClient elasticsearchClient() {
        return new RestHighLevelClient(
                RestClient.builder(new HttpHost(host, port, "http"))
                        .setRequestConfigCallback(requestConfigBuilder ->
                                requestConfigBuilder
                                        .setConnectTimeout(10000)
                                        .setSocketTimeout(30000))
        );
    }
}
