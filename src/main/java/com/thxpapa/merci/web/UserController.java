package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.dto.UserRegisterRequestDto;
import com.thxpapa.merci.repository.userRepository.MerciUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/user")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final MerciUserRepository merciUserRepository;
    @PostMapping("/join")
    public String join(@ModelAttribute UserRegisterRequestDto userRegisterRequestDto) {
        log.debug("join starts!");

        merciUserRepository.save(MerciUser.builder()
                                .name(userRegisterRequestDto.getName())
                                .email(userRegisterRequestDto.getEmail())
                                .username(userRegisterRequestDto.getUsername())
                                .password(passwordEncoder.encode(userRegisterRequestDto.getPassword()))
                                .intro(userRegisterRequestDto.getIntro())
                                .statusCd("01")
                                .build());
        return "geo/map";
    }
}
