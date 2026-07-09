package com.walmartprep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.cache.CacheManager cacheManager() {
		return new org.springframework.cache.concurrent.ConcurrentMapCacheManager("questions", "question");
	}

}
