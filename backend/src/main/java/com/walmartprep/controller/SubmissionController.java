package com.walmartprep.controller;

import com.walmartprep.entity.Submission;
import com.walmartprep.entity.User;
import com.walmartprep.repository.SubmissionRepository;
import com.walmartprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Map<String, Object>>> getSubmissionsForQuestion(@PathVariable UUID questionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        List<Submission> submissions = submissionRepository.findByUserIdAndQuestionIdOrderBySubmittedAtDesc(user.getId(), questionId);

        List<Map<String, Object>> result = submissions.stream().map(s -> Map.<String, Object>of(
                "id", s.getId().toString(),
                "status", s.getStatus(),
                "language", s.getLanguage(),
                "runtimeMs", s.getRuntimeMs() != null ? s.getRuntimeMs() : 0,
                "memoryKb", s.getMemoryKb() != null ? s.getMemoryKb() : 0,
                "submittedAt", s.getSubmittedAt().toString()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
