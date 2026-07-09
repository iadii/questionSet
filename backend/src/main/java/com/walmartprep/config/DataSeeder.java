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

import com.walmartprep.entity.User;
import com.walmartprep.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .enable(com.fasterxml.jackson.databind.MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Creating default test user...");
            User user = new User();
            user.setName("Test User");
            user.setEmail("test@example.com");
            user.setPasswordHash(passwordEncoder.encode("password123"));
            userRepository.save(user);
        }
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
