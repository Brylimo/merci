package com.thxpapa.merci.repository.scoreRepository;

import com.thxpapa.merci.domain.score.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {
}
