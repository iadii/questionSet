package com.walmartprep.service;

import com.walmartprep.dto.AiChatRequest;
import com.walmartprep.dto.AiChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();

    public AiChatResponse getInterviewFeedback(AiChatRequest request) {
        String prompt = String.format(
            "You are a technical interviewer at a top tech company (like FAANG or Walmart). " +
            "The candidate is solving a coding problem. " +
            "Here is their current code:\n```%s\n%s\n```\n\n" +
            "Here is the candidate's message or question to you:\n\"%s\"\n\n" +
            "Instructions: \n" +
            "- Be concise, professional, and encouraging.\n" +
            "- Give hints and guide them, but DO NOT provide the direct code solution.\n" +
            "- If they ask if it's optimal, ask them about time and space complexity.",
            request.getLanguage(), request.getCode(), request.getMessage()
        );

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));
        
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                GEMINI_API_URL + apiKey, entity, Map.class
            );

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> candidateContent = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
                    if (!parts.isEmpty()) {
                        String reply = (String) parts.get(0).get("text");
                        return AiChatResponse.builder().reply(reply).build();
                    }
                }
            }
            return AiChatResponse.builder().reply("Sorry, I could not process that request.").build();
        } catch (Exception e) {
            e.printStackTrace();
            return AiChatResponse.builder().reply("Sorry, there was an error connecting to my AI brain. Please check your API key!").build();
        }
    }
}
