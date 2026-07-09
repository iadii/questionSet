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
}
