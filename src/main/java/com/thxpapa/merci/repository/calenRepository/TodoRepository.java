package com.thxpapa.merci.repository.calenRepository;

import com.thxpapa.merci.domain.calen.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Integer> {
}
