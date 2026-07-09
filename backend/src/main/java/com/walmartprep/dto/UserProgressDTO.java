package com.walmartprep.dto;

import lombok.Data;
import java.util.UUID;

import com.walmartprep.enums.ProgressStatus;

@Data
public class UserProgressDTO {
    private UUID questionId;
    private ProgressStatus status;
    private String nextRevisionDate;
}
