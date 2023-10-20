package com.thxpapa.merci.repository.scoreRepository;

import com.thxpapa.merci.domain.score.SpecialDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SpecialDayRepository extends JpaRepository<SpecialDay, String> {
    @Query("SELECT s.specialDayUid FROM SpecialDay s WHERE CAST(SUBSTRING(s.specialDayUid, 1, LOCATE('::', s.specialDayUid) - 1) AS INTEGER) = (SELECT MAX(CAST(SUBSTRING(s2.specialDayUid, 1, LOCATE('::', s.specialDayUid) - 1) AS INTEGER)) FROM SpecialDay s2)")
    String selectLastId();

    @Query(value = "SELECT MAX(s.specialDayUid) FROM SpecialDay s WHERE s.datStId = :datStId")
    String selectLastIdByDatStId(@Param("datStId") String datStId);

    List<SpecialDay> findAllByDateBetween(LocalDate startDate, LocalDate endDate);
}
