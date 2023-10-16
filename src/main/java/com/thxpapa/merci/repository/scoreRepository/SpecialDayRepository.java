package com.thxpapa.merci.repository.scoreRepository;

import com.thxpapa.merci.domain.score.SpecialDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpecialDayRepository extends JpaRepository<SpecialDay, String> {
    @Query("SELECT m.specialDayUid FROM SpecialDay m WHERE CAST(SUBSTRING(m.specialDayUid, 1, LOCATE('::', m.specialDayUid) - 1) AS INTEGER) = (SELECT MAX(CAST(SUBSTRING(m2.specialDayUid, 1, LOCATE('::', m.specialDayUid) - 1) AS INTEGER)) FROM SpecialDay m2)")
    String selectLastId();
}
