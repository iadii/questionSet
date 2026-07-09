package com.walmartprep.service;

import com.walmartprep.dto.UserProgressDTO;
import com.walmartprep.entity.Question;
import com.walmartprep.entity.User;
import com.walmartprep.entity.UserProgress;
import com.walmartprep.repository.QuestionRepository;
import com.walmartprep.repository.UserProgressRepository;
import com.walmartprep.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public List<UserProgressDTO> getUserProgress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userProgressRepository.findByUserId(user.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserProgressDTO updateProgress(String email, UUID questionId, com.walmartprep.enums.ProgressStatus status, String confidence) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        UserProgress progress = userProgressRepository.findByUserIdAndQuestionId(user.getId(), questionId)
                .orElse(new UserProgress());
        
        if (progress.getId() == null) {
            progress.setUser(user);
            progress.setQuestion(question);
        }

        progress.setStatus(status);

        // SRS Logic
        if (com.walmartprep.enums.ProgressStatus.SOLVED.equals(status)) {
            int days = 3; // Default
            if ("EASY".equalsIgnoreCase(confidence)) {
                days = 7;
            } else if ("HARD".equalsIgnoreCase(confidence)) {
                days = 1;
            } else if ("MEDIUM".equalsIgnoreCase(confidence)) {
                days = 3;
            }
            progress.setNextRevisionDate(LocalDate.now().plusDays(days));
        } else if (com.walmartprep.enums.ProgressStatus.REVISION_NEEDED.equals(status)) {
            progress.setNextRevisionDate(LocalDate.now().plusDays(1));
        } else {
            progress.setNextRevisionDate(null);
        }

        userProgressRepository.save(progress);
        return toDTO(progress);
    }

    private UserProgressDTO toDTO(UserProgress progress) {
        UserProgressDTO dto = new UserProgressDTO();
        dto.setQuestionId(progress.getQuestion().getId());
        dto.setStatus(progress.getStatus());
        if (progress.getNextRevisionDate() != null) {
            dto.setNextRevisionDate(progress.getNextRevisionDate().toString());
        }
        return dto;
    }
}
