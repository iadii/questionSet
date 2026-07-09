package com.walmartprep.dto;

import lombok.Data;
import java.util.Map;

@Data
public class UserProfileDTO {
    private String name;
    private String email;
    private String targetCompany;
    private int totalSolved;
    private int easySolved;
    private int mediumSolved;
    private int hardSolved;
    private Map<String, Integer> heatmap;
}
