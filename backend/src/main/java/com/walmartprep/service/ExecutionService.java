package com.walmartprep.service;

import com.walmartprep.dto.ExecutionRequest;
import com.walmartprep.dto.ExecutionResponse;
import com.walmartprep.entity.Question;
import com.walmartprep.entity.Submission;
import com.walmartprep.entity.User;
import com.walmartprep.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExecutionService {

    @Value("${judge0.api.key}")
    private String judge0ApiKey;
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final SubmissionRepository submissionRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

    private int getLanguageId(String language) {
        return switch (language.toLowerCase()) {
            case "java" -> 62;
            case "python" -> 71;
            case "javascript" -> 63;
            case "c++", "cpp" -> 54;
            default -> 71; // Default to Python if unknown
        };
    }

    public ExecutionResponse executeCode(User user, Question question, ExecutionRequest request) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("source_code", request.getCode());
        requestBody.put("language_id", getLanguageId(request.getLanguage()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
        headers.set("X-RapidAPI-Key", judge0ApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        ExecutionResponse execResponse = ExecutionResponse.builder().build();
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setQuestion(question);
        submission.setLanguage(request.getLanguage());
        submission.setCode(request.getCode());
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(JUDGE0_URL, entity, Map.class);
            Map<String, Object> body = response.getBody();
            
            if (body != null) {
                String stdout = (String) body.get("stdout");
                String compileOutput = (String) body.get("compile_output");
                String stderr = (String) body.get("stderr");
                String timeStr = (String) body.get("time");
                Number memoryNum = (Number) body.get("memory");
                Map<String, Object> statusObj = (Map<String, Object>) body.get("status");
                
                String description = statusObj != null ? (String) statusObj.get("description") : "Unknown Error";
                int runtimeMs = timeStr != null ? (int)(Float.parseFloat(timeStr) * 1000) : 0;
                int memoryKb = memoryNum != null ? memoryNum.intValue() : 0;
                
                String finalOutput = "";
                if (compileOutput != null && !compileOutput.trim().isEmpty()) {
                    finalOutput = compileOutput;
                } else if (stderr != null && !stderr.trim().isEmpty()) {
                    finalOutput = stderr;
                } else if (stdout != null) {
                    finalOutput = stdout;
                }
                
                String dbStatus = description.equals("Accepted") ? "ACCEPTED" : 
                                  description.contains("Compilation Error") ? "COMPILATION_ERROR" : 
                                  "RUNTIME_ERROR";
                                  
                submission.setStatus(dbStatus);
                submission.setRuntimeMs(runtimeMs);
                submission.setMemoryKb(memoryKb);
                
                execResponse.setStatus(dbStatus);
                execResponse.setRuntimeMs(runtimeMs);
                execResponse.setMemoryKb(memoryKb);
                execResponse.setOutput(description + "\n\nOutput:\n" + finalOutput);
            }
        } catch (Exception e) {
            submission.setStatus("SYSTEM_ERROR");
            execResponse.setStatus("SYSTEM_ERROR");
            execResponse.setOutput("Failed to connect to execution engine. Check Judge0 API Key.\n" + e.getMessage());
        }

        submissionRepository.save(submission);
        return execResponse;
    }

    public ExecutionResponse evaluateDesign(User user, Question question, ExecutionRequest request) {
        ExecutionResponse execResponse = ExecutionResponse.builder().build();
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setQuestion(question);
        submission.setLanguage("whiteboard");
        submission.setCode("Diagram Evaluation");
        
        try {
            String prompt = String.format(
                "You are a Staff Engineer / System Design Interviewer at a top tech company. " +
                "The candidate has drawn an architecture diagram for the question: '%s'.\n" +
                "Description: %s\n\n" +
                "Evaluate it based on:\n" +
                "1. Are all core requirements met?\n" +
                "2. Are there any single points of failure?\n" +
                "3. Is the database choice appropriate?\n" +
                "4. Is caching / load balancing used correctly?\n\n" +
                "Return your evaluation as a JSON string (do not include markdown codeblocks, just the raw JSON) with the following structure:\n" +
                "{\n" +
                "  \"score\": 85,\n" +
                "  \"strengths\": [\"Good use of Load Balancer\", \"Cache helps with read load\"],\n" +
                "  \"weaknesses\": [\"Database is a single point of failure\"],\n" +
                "  \"improvement\": \"Add a read-replica or switch to a NoSQL DB for high scale.\"\n" +
                "}",
                question.getTitle(), question.getDescription()
            );

            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);
            
            // Extract base64 without prefix if exists
            String base64Data = request.getDiagramImageBase64();
            if (base64Data.contains(",")) {
                base64Data = base64Data.split(",")[1];
            }
            
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mime_type", "image/png");
            inlineData.put("data", base64Data);
            
            Map<String, Object> imagePart = new HashMap<>();
            imagePart.put("inline_data", inlineData);
            
            Map<String, Object> content = new HashMap<>();
            content.put("parts", java.util.List.of(textPart, imagePart));
            
            requestBody.put("contents", java.util.List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, entity, Map.class);
            Map<String, Object> body = response.getBody();
            
            if (body != null && body.containsKey("candidates")) {
                java.util.List<Map<String, Object>> candidates = (java.util.List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidateContent = (Map<String, Object>) candidates.get(0).get("content");
                    java.util.List<Map<String, Object>> parts = (java.util.List<Map<String, Object>>) candidateContent.get("parts");
                    if (!parts.isEmpty()) {
                        String reply = (String) parts.get(0).get("text");
                        // Clean up markdown block if present
                        if (reply.startsWith("```json")) {
                            reply = reply.replace("```json\n", "").replace("\n```", "");
                        } else if (reply.startsWith("```")) {
                            reply = reply.replace("```\n", "").replace("\n```", "");
                        }
                        
                        submission.setStatus("Evaluated");
                        submission.setRuntimeMs(0);
                        submission.setMemoryKb(0);
                        
                        execResponse.setStatus("Evaluated");
                        execResponse.setRuntimeMs(0);
                        execResponse.setMemoryKb(0);
                        execResponse.setOutput(reply);
                    }
                }
            } else {
                throw new RuntimeException("Failed to generate content from AI");
            }
        } catch (Exception e) {
            e.printStackTrace();
            submission.setStatus("SYSTEM_ERROR");
            execResponse.setStatus("SYSTEM_ERROR");
            execResponse.setOutput("Evaluation Failed: " + e.getMessage());
        }
        
        submissionRepository.save(submission);
        return execResponse;
    }
}
