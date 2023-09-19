package com.thxpapa.merci.security.provider;

import com.thxpapa.merci.domain.user.SecurityUser;
import com.thxpapa.merci.security.service.MerciUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;

@RequiredArgsConstructor
public class MerciAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private MerciUserDetailsService merciUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = (String) authentication.getCredentials();

        // verify email
        SecurityUser securityUser = (SecurityUser) merciUserDetailsService.loadUserByUsername(email);

        // verify password
        if (!passwordEncoder.matches(password, securityUser.getMerciUser().getPassword())) {
            throw new BadCredentialsException("BadCredentialsException");
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(securityUser.getMerciUser(), null, securityUser.getAuthorities());

        return authToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
