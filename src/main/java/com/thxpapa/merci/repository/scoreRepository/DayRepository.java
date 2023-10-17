package com.thxpapa.merci.repository.scoreRepository;

import com.thxpapa.merci.domain.score.Day;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface DayRepository extends JpaRepository<Day, Integer> {

    Day findDayByDate(LocalDate date);
}
