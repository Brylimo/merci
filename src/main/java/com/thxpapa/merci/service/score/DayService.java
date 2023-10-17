package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.Day;

import java.time.LocalDate;

public interface DayService {
    Day createDay(LocalDate date);

    Day findOneDay(LocalDate date);
}