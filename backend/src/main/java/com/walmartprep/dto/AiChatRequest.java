package com.walmartprep.dto;

import lombok.Data;

@Data
public class AiChatRequest {
    private String code;
    private String language;
    private String message;
}
