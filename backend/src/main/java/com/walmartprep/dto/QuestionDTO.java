package com.walmartprep.dto;

import lombok.Data;

import java.util.UUID;
import java.util.List;

@Data
public class QuestionDTO {
    private UUID id;
    private String title;
    private String description;
    private com.walmartprep.enums.Category category;
    private String topic;
    private com.walmartprep.enums.Difficulty difficulty;
    private String leetcodeUrl;
    private String articleUrl;
    private String videoUrl;
    private List<String> companyTags;
    private Integer frequency;
    private List<String> hints;

    public static QuestionDTO fromEntity(com.walmartprep.entity.Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTitle(question.getTitle());
        dto.setDescription(question.getDescription());
        dto.setCategory(question.getCategory());
        dto.setTopic(question.getTopic());
        dto.setDifficulty(question.getDifficulty());
        dto.setLeetcodeUrl(question.getLeetcodeUrl());
        dto.setArticleUrl(question.getArticleUrl());
        dto.setVideoUrl(question.getVideoUrl());
        dto.setCompanyTags(question.getCompanyTags());
        dto.setFrequency(question.getFrequency());
        dto.setHints(question.getHints());
        return dto;
    }
}
