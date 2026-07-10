package com.walmartprep.controller;

import com.walmartprep.dto.ExecutionRequest;
import com.walmartprep.dto.ExecutionResponse;
import com.walmartprep.entity.Question;
import com.walmartprep.entity.Submission;
import com.walmartprep.entity.User;
import com.walmartprep.repository.QuestionRepository;
import com.walmartprep.repository.SubmissionRepository;
import com.walmartprep.repository.UserRepository;
import com.walmartprep.service.ExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/execute")
@RequiredArgsConstructor
public class ExecutionController {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ExecutionService executionService;

    @PostMapping
    public ResponseEntity<ExecutionResponse> executeCode(@RequestBody ExecutionRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        
        Question question = null;
        if (request.getQuestionId() != null) {
            question = questionRepository.findById(request.getQuestionId()).orElse(null);
        }
        if (question == null) {
            question = questionRepository.findAll().stream().findFirst().orElseThrow();
        }
        
        ExecutionResponse response;
        if (request.getDiagramImageBase64() != null && !request.getDiagramImageBase64().isEmpty()) {
            response = executionService.evaluateDesign(user, question, request);
        } else {
            response = executionService.executeCode(user, question, request);
        }
        
        return ResponseEntity.ok(response);
    }
}
