package com.thxpapa.merci.repository.scoreRepository;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.Task;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findTasksByDay(Day day);

    @Query("SELECT t FROM Task t JOIN FETCH t.day WHERE t.eventCd= :eventCd AND t.day.date BETWEEN :startDate AND :endDate")
    List<Task> findAllEventsByDate(@Param("eventCd") String eventCd, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
