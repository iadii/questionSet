package com.walmartprep.controller;

import com.walmartprep.dto.UpdateProgressRequest;
import com.walmartprep.dto.UserProgressDTO;
import com.walmartprep.service.UserProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development
@PreAuthorize("hasRole('USER')")
public class UserProgressController {

    private final UserProgressService userProgressService;

    @GetMapping
    public ResponseEntity<com.walmartprep.dto.ApiResponse<List<UserProgressDTO>>> getProgress(@AuthenticationPrincipal String email) {
        if (email == null) {
            return ResponseEntity.status(401).body(com.walmartprep.dto.ApiResponse.error("Unauthorized"));
        }
        return ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(userProgressService.getUserProgress(email), "Progress fetched successfully"));
    }

    @PostMapping("/{questionId}")
    public ResponseEntity<com.walmartprep.dto.ApiResponse<UserProgressDTO>> updateProgress(
            @AuthenticationPrincipal String email,
            @PathVariable UUID questionId,
            @Valid @RequestBody UpdateProgressRequest request) {
        
        if (email == null) {
            return ResponseEntity.status(401).body(com.walmartprep.dto.ApiResponse.error("Unauthorized"));
        }
        return ResponseEntity.ok(com.walmartprep.dto.ApiResponse.success(userProgressService.updateProgress(email, questionId, request.getStatus(), request.getConfidence()), "Progress updated successfully"));
    }
}
