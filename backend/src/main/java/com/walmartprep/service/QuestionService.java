package com.walmartprep.service;

import com.walmartprep.entity.Question;
import com.walmartprep.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    public Page<Question> getAllQuestions(Pageable pageable) {
        return questionRepository.findAll(pageable);
    }

    public Page<Question> getQuestionsByCategory(String category, Pageable pageable) {
        return questionRepository.findByCategory(category, pageable);
    }

    public Page<Question> getQuestionsByTopic(String topic, Pageable pageable) {
        return questionRepository.findByTopic(topic, pageable);
    }
    
    public Page<Question> getQuestionsByCategoryAndTopic(String category, String topic, Pageable pageable) {
        return questionRepository.findByCategoryAndTopic(category, topic, pageable);
    }

    public Optional<Question> getQuestionById(UUID id) {
        return questionRepository.findById(id);
    }
}
