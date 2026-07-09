package com.walmartprep.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String id;
    private String name;
    private String email;
    private String targetCompany;
}
