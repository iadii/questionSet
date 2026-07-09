package com.walmartprep.service;

import com.walmartprep.entity.Question;
import com.walmartprep.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    @Cacheable(value = "questions", key = "'all_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Question> getAllQuestions(Pageable pageable) {
        return questionRepository.findAll(pageable);
    }

    @Cacheable(value = "questions", key = "'cat_' + #category + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Question> getQuestionsByCategory(String category, Pageable pageable) {
        return questionRepository.findByCategory(com.walmartprep.enums.Category.valueOf(category.toUpperCase()), pageable);
    }

    @Cacheable(value = "questions", key = "'topic_' + #topic + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Question> getQuestionsByTopic(String topic, Pageable pageable) {
        return questionRepository.findByTopic(topic, pageable);
    }
    
    @Cacheable(value = "questions", key = "'cat_topic_' + #category + '_' + #topic + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Question> getQuestionsByCategoryAndTopic(String category, String topic, Pageable pageable) {
        return questionRepository.findByCategoryAndTopic(com.walmartprep.enums.Category.valueOf(category.toUpperCase()), topic, pageable);
    }

    @Cacheable(value = "question", key = "#id")
    public Optional<Question> getQuestionById(UUID id) {
        return questionRepository.findById(id);
    }
}
