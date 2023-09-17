package com.thxpapa.merci.repository.userRepository;

import com.thxpapa.merci.domain.user.MerciUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerciUserRepository extends JpaRepository<MerciUser, Integer> {
    MerciUser findByEmail(String email);
}
