package com.thxpapa.merci.repository.userRepository;

import com.thxpapa.merci.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserUid(Integer userUid);
}
