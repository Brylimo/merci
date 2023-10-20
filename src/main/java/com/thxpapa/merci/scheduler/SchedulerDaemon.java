package com.thxpapa.merci.scheduler;

import com.thxpapa.merci.service.score.SpecialDayService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class SchedulerDaemon {

    private final SpecialDayService specialDayService;

    @PostConstruct
    public void init() {
        fetchSpecialDayData();
    }

    static private boolean lock = false;

    // 매년 1월 1일 실행
    @Scheduled(cron = "0 0 0 1 1 *")
    public void fetchSpecialDayData() {
        if (lock) return;
        lock = true;

        log.debug("fetchSpecialDayData scheduler starts!");

        try {
            specialDayService.updateHoliday();
            specialDayService.updateAnniversary();
        } catch (Exception e) {
            log.debug("Failed fetching special day data");
        }
        lock = false;
    }
}
