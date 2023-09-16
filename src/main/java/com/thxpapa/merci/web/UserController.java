package com.thxpapa.merci.web;

import com.thxpapa.merci.domain.user.User;
import com.thxpapa.merci.dto.UserRegisterRequestDto;
import com.thxpapa.merci.repository.userRepository.UserRepository;
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
    private final UserRepository userRepository;
    @PostMapping("/join")
    public String join(@ModelAttribute UserRegisterRequestDto userRegisterRequestDto) {
        log.debug("join starts!");

        userRepository.save(User.builder()
                                .name(userRegisterRequestDto.getName())
                                .email(userRegisterRequestDto.getEmail())
                                .nickname(userRegisterRequestDto.getNickname())
                                .password(passwordEncoder.encode(userRegisterRequestDto.getPassword()))
                                .intro(userRegisterRequestDto.getIntro())
                                .statusCd("01")
                                .build());
        return "geo/map";
    }
}
