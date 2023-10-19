package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.Task;
import com.thxpapa.merci.repository.scoreRepository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public Task createTask(Day day, String content, String eventCd, int reward) {
        Task createdTask = taskRepository.save(Task.builder()
                                .content(content)
                                .eventCd(eventCd)
                                .reward(reward)
                                .day(day)
                                .statusCd("01")
                                .build());

        return createdTask;
    }

    @Override
    public List<Task> getTasksByDay(Day day) {
        return taskRepository.findTasksByDay(day);
    }

    @Override
    public void deleteById(int id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getEventsByMonth(LocalDate startDate, LocalDate endDate) {
        return taskRepository.findAllEventsByDate("01", startDate, endDate);
    }
}
