package com.thxpapa.merci.repository.scoreRepository;

import com.thxpapa.merci.domain.score.Day;
import com.thxpapa.merci.domain.score.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findTasksByDay(Day day);
}
