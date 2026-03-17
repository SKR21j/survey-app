package com.surveyapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class ResponseStatsDTO {
    private Long questionId;
    private String questionText;
    private String questionType;
    private List<AnswerCountDTO> answers;
    private int totalResponses;

    @Data
    @NoArgsConstructor
    public static class AnswerCountDTO {
        private String value;
        private long count;

        public AnswerCountDTO(String value, long count) {
            this.value = value;
            this.count = count;
        }
    }
}
