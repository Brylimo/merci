package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.Task;
import com.thxpapa.merci.dto.score.TaskUpdateDto;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    Task createTask(Day day, String task, String eventCd, int reward);
    List<Task> getTasksByDay(Day day);
    Task updateTask(TaskUpdateDto taskUpdateDto);
    void deleteById(int id);
    List<Task> getEventsByMonth(LocalDate startDate, LocalDate endDate);
    Integer getTodayScore(Day day);
}
