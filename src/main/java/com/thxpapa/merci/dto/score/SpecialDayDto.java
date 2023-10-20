package com.thxpapa.merci.dto.score;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialDayDto {
    private String dateKind;
    private String dateName;
    private String isHoliday;
    private String locdate;
    private String remarks;
    private String seq;
}