package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Day day, String task, String eventCd, int reward);
    List<Task> getTasksByDay(Day day);
    void deleteById(int id);
}
