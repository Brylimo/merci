package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.SpecialDay;

import java.time.LocalDate;
import java.util.List;

public interface SpecialDayService {
    void updateSpecialDay();
    List<SpecialDay> getSpecialDaysByMonth(LocalDate startDate, LocalDate endDate);
}
