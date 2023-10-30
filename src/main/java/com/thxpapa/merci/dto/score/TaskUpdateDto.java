package com.thxpapa.merci.dto.score;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDto {
    private Integer taskId;
    private String content;
    private Integer reward;
    private String eventCd;
    private Boolean doneCd;
}
