package com.thxpapa.merci.dto.score;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDayDto {
    private LocalDate date;
    private String name;
    private String tagCd;
}
