package com.walmartprep.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import com.walmartprep.enums.ProgressStatus;

@Data
public class UpdateProgressRequest {
    private ProgressStatus status; 
}
