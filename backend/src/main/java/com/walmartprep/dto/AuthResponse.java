package com.walmartprep.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String name;
    private String email;
    private String targetCompany;
}
