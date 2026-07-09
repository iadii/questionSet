package com.walmartprep.controller;

import com.walmartprep.dto.UserProfileDTO;
import com.walmartprep.entity.User;
import com.walmartprep.entity.UserProgress;
import com.walmartprep.enums.ProgressStatus;
import com.walmartprep.repository.SubmissionRepository;
import com.walmartprep.repository.UserProgressRepository;
import com.walmartprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final SubmissionRepository submissionRepository;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email).orElseThrow();
        
        List<UserProgress> progressList = userProgressRepository.findByUserId(user.getId());
        int easy = 0, medium = 0, hard = 0, total = 0;
        
        for (UserProgress p : progressList) {
            if (p.getStatus() == ProgressStatus.SOLVED) {
                total++;
                if (p.getQuestion().getDifficulty() == com.walmartprep.enums.Difficulty.EASY) easy++;
                else if (p.getQuestion().getDifficulty() == com.walmartprep.enums.Difficulty.MEDIUM) medium++;
                else if (p.getQuestion().getDifficulty() == com.walmartprep.enums.Difficulty.HARD) hard++;
            }
        }
        
        List<Object[]> heatmapData = submissionRepository.countSubmissionsByDate(user.getId());
        Map<String, Integer> heatmap = new HashMap<>();
        for (Object[] row : heatmapData) {
            String date = row[0].toString();
            Integer count = ((Number) row[1]).intValue();
            heatmap.put(date, count);
        }
        
        UserProfileDTO dto = new UserProfileDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setTotalSolved(total);
        dto.setEasySolved(easy);
        dto.setMediumSolved(medium);
        dto.setHardSolved(hard);
        dto.setHeatmap(heatmap);
        
        return ResponseEntity.ok(dto);
    }
}
