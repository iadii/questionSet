package com.walmartprep.controller;

import com.walmartprep.entity.Question;
import com.walmartprep.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development, allow all origins
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<Page<Question>> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String topic,
            Pageable pageable) {
        
        if (category != null && topic != null) {
            return ResponseEntity.ok(questionService.getQuestionsByCategoryAndTopic(category, topic, pageable));
        } else if (category != null) {
            return ResponseEntity.ok(questionService.getQuestionsByCategory(category, pageable));
        } else if (topic != null) {
            return ResponseEntity.ok(questionService.getQuestionsByTopic(topic, pageable));
        }
        return ResponseEntity.ok(questionService.getAllQuestions(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable UUID id) {
        return questionService.getQuestionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
