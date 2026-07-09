package com.walmartprep.controller;

import com.walmartprep.dto.QuestionDTO;
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
    public ResponseEntity<com.walmartprep.dto.ApiResponse<Page<QuestionDTO>>> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String topic,
            Pageable pageable) {
        
        Page<QuestionDTO> result;
        if (category != null && topic != null) {
            result = questionService.getQuestionsByCategoryAndTopic(category, topic, pageable).map(QuestionDTO::fromEntity);
        } else if (category != null) {
            result = questionService.getQuestionsByCategory(category, pageable).map(QuestionDTO::fromEntity);
        } else if (topic != null) {
            result = questionService.getQuestionsByTopic(topic, pageable).map(QuestionDTO::fromEntity);
        } else {
            result = questionService.getAllQuestions(pageable).map(QuestionDTO::fromEntity);
        }
        return ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(result, "Questions fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<QuestionDTO>> getQuestionById(@PathVariable UUID id) {
        return questionService.getQuestionById(id)
                .map(QuestionDTO::fromEntity)
                .map(dto -> ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(dto, "Question fetched successfully")))
                .orElse(ResponseEntity.status(404).body(com.walmartprep.dto.ApiResponse.error("Question not found")));
    }
}
