package com.thxpapa.merci.service.user;

import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.repository.userRepository.MerciUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerciUserServiceImpl implements MerciUserService {

    private final MerciUserRepository merciUserRepository;

    @Override
    public List<MerciUser> getAllMerciUsers() {
        List<MerciUser> merciUsers = merciUserRepository.findAll();
        return merciUsers;
    }
}
