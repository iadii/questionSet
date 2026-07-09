package com.walmartprep.controller;

import com.walmartprep.dto.ExecutionRequest;
import com.walmartprep.dto.ExecutionResponse;
import com.walmartprep.entity.Question;
import com.walmartprep.entity.Submission;
import com.walmartprep.entity.User;
import com.walmartprep.repository.QuestionRepository;
import com.walmartprep.repository.SubmissionRepository;
import com.walmartprep.repository.UserRepository;
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
    private final SubmissionRepository submissionRepository;

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
        
        // Mock compilation & execution delay
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Mock response
        boolean isSuccess = !request.getCode().contains("error");
        
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setQuestion(question);
        submission.setLanguage(request.getLanguage());
        submission.setCode(request.getCode());
        submission.setStatus(isSuccess ? "ACCEPTED" : "WRONG_ANSWER");
        submission.setRuntimeMs(isSuccess ? 42 : 0);
        submission.setMemoryKb(isSuccess ? 34212 : 0);
        
        submissionRepository.save(submission);
        
        ExecutionResponse response = ExecutionResponse.builder()
                .status(submission.getStatus())
                .output(isSuccess ? "All test cases passed!\nRuntime: 42ms\nMemory: 34.2MB" : "Compilation Error or Wrong Answer.\nPlease check your logic.")
                .runtimeMs(submission.getRuntimeMs())
                .memoryKb(submission.getMemoryKb())
                .build();
                
        return ResponseEntity.ok(response);
    }
}
