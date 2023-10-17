package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.repository.scoreRepository.DayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class DayServiceImpl implements DayService {

    private final DayRepository dayRepository;

    @Override
    public Day createDay(LocalDate date) {
        Day createdDay = dayRepository.save(Day.builder()
                                .date(date)
                                .statusCd("01")
                                .build());

        return createdDay;
    }

    @Override
    public Day findOneDay(LocalDate date) {
        Day day = dayRepository.findDayByDate(date);

        return day;
    }
}
