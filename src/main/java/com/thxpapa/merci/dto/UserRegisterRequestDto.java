package com.thxpapa.merci.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRegisterRequestDto {
    private String name;
    private String email;
    private String username;
    private String password;
    private String intro;
}
