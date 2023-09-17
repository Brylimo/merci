package com.thxpapa.merci.service.user;

import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.dto.UserRegisterRequestDto;

import java.util.List;

public interface MerciUserService {
    List<MerciUser> getAllMerciUsers();
    MerciUser createMerciUser(UserRegisterRequestDto userRegisterRequestDto);
}
