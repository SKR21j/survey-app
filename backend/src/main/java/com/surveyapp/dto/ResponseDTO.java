package com.surveyapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResponseDTO {

    private Long id;

    @NotNull(message = "Survey ID is required")
    private Long surveyId;

    private Long userId;

    private List<AnswerDTO> answers;

    private LocalDateTime submittedAt;

    @Data
    public static class AnswerDTO {
        @NotNull(message = "Question ID is required")
        private Long questionId;

        private String value;
    }
}
