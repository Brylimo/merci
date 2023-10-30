package com.thxpapa.merci.service.score;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.Task;
import com.thxpapa.merci.dto.score.TaskUpdateDto;
import com.thxpapa.merci.repository.scoreRepository.TaskRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    @PersistenceContext
    private EntityManager em;
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
        return taskRepository.findTasksByDayOrderByModDtAsc(day);
    }

    @Override
    @Transactional
    public Task updateTask(TaskUpdateDto taskUpdateDto) {
        Task task = taskRepository.findById(taskUpdateDto.getTaskId()).orElse(null);
        return task.updateTask(em, taskUpdateDto);
    }

    @Override
    public void deleteById(int id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<Task> getEventsByMonth(LocalDate startDate, LocalDate endDate) {
        return taskRepository.findAllEventsByDate("01", startDate, endDate);
    }

    @Override
    public Integer getTodayScore(Day day) {
        return taskRepository.sumRewardsByDay(day);
    }
}
