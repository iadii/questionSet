package com.walmartprep.controller;

import com.walmartprep.dto.AiChatRequest;
import com.walmartprep.dto.AiChatResponse;
import com.walmartprep.dto.ApiResponse;
import com.walmartprep.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chatWithInterviewer(@RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.getInterviewFeedback(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Success"));
    }
}
