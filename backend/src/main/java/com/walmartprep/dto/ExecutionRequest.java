package com.walmartprep.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ExecutionRequest {
    private UUID questionId;
    private String language;
    private String code;
    private String diagramImageBase64;
}
