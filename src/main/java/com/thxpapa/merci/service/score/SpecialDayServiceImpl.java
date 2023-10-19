package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.SpecialDay;
import com.thxpapa.merci.dto.score.SpecialDayDto;
import com.thxpapa.merci.repository.scoreRepository.SpecialDayRepository;
import com.thxpapa.merci.util.SpecialDayUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpecialDayServiceImpl implements SpecialDayService {

    private final SpecialDayUtil specialDayUtil;

    private final SpecialDayRepository specialDayRepository;

    @Override
    public void updateSpecialDay() {
        final int startYear = 2004;
        final int endYear = LocalDate.now().plusYears(2).getYear();

        try {
            Long idx = 0L;
            LocalDate ld = null;
            String lastId = specialDayRepository.selectLastId();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

            if (lastId!=null) {
                String[] buff = lastId.split(SpecialDay.idSplitter);
                if (buff.length > 1) {
                    ld = LocalDate.parse(buff[0], formatter);
                    idx = Long.parseLong(buff[1]);
                }
            }

            for (int solYear = startYear; solYear <= endYear; solYear++) {
                if (ld != null && solYear < ld.getYear()) {
                    continue;
                }

                log.info(solYear + " year holiday data is being stored..");

                List<SpecialDayDto> specialDayList = specialDayUtil.getRestDeInfo(String.valueOf(solYear));

                for (SpecialDayDto element: specialDayList) {
                    LocalDate date = LocalDate.parse(element.getLocdate(), formatter);

                    if (ld != null && !date.isAfter(ld)) {
                        continue;
                    }

                    Boolean isHoliday = element.getIsHoliday().equals("N") ? false : true;

                    specialDayRepository.save(SpecialDay.builder()
                            .specialDayUid(element.getLocdate()+SpecialDay.idSplitter+(++idx))
                            .dateName(element.getDateName())
                            .holidayCd(isHoliday)
                            .date(date)
                            .statusCd("01")
                            .build());
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Override
    public List<SpecialDay> getSpecialDaysByMonth(LocalDate startDate, LocalDate endDate) {
        return specialDayRepository.findAllByDateBetween(startDate, endDate);
    }
}