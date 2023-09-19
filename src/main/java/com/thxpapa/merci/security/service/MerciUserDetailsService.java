package com.thxpapa.merci.security.service;

import com.thxpapa.merci.domain.user.MerciUser;
import com.thxpapa.merci.domain.user.SecurityUser;
import com.thxpapa.merci.repository.userRepository.MerciUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MerciUserDetailsService implements UserDetailsService {

    private final MerciUserRepository merciUserRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        MerciUser merciUser = merciUserRepository.findByEmail(email);

        if (merciUser == null) {
            throw new UsernameNotFoundException("UsernameNotfoundException");
        }

        List<GrantedAuthority> roles = new ArrayList<>();
        roles.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new SecurityUser(merciUser, roles);
    }
}
