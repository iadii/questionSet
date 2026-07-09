package com.walmartprep.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.walmartprep.entity.Question;
import com.walmartprep.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (questionRepository.count() == 0) {
            log.info("Database is empty. Seeding questions from JSON...");
            seedData("data/dsa.json");
            seedData("data/lld.json");
            seedData("data/hld.json");
            seedData("data/walmart_previous.json");
            log.info("Seeding completed.");
        } else {
            log.info("Database is not empty. Skipping seed.");
        }
    }

    private void seedData(String path) {
        try {
            InputStream is = new ClassPathResource(path).getInputStream();
            List<Question> questions = objectMapper.readValue(is, new TypeReference<List<Question>>(){});
            questionRepository.saveAll(questions);
            log.info("Seeded {} from {}", questions.size(), path);
        } catch (Exception e) {
            log.error("Unable to save questions from {}: {}", path, e.getMessage());
        }
    }
}
