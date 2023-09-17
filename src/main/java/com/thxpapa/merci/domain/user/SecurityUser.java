package com.thxpapa.merci.domain.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class SecurityUser extends User {

    private final MerciUser merciUser;

    public SecurityUser(MerciUser merciUser, Collection<? extends GrantedAuthority> authorities) {
        super(merciUser.getEmail(), merciUser.getPassword(), authorities);
        this.merciUser = merciUser;
    }

    public MerciUser getMerciUser() {
        return merciUser;
    }
}
