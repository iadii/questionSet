package com.walmartprep.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ExecutionResponse {
    private String status;
    private String output;
    private Integer runtimeMs;
    private Integer memoryKb;
}
