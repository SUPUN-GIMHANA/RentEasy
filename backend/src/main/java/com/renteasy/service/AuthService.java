package com.renteasy.service;

import com.renteasy.dto.LoginRequest;
import com.renteasy.dto.SignupRequest;
import com.renteasy.dto.JwtResponse;
import com.renteasy.model.User;
import com.renteasy.repository.UserRepository;
import com.renteasy.security.JwtTokenProvider;
import com.renteasy.util.InputSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public User registerUser(SignupRequest signupRequest) {
        String email = InputSanitizer.normalizeEmail(signupRequest.getEmail());

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already taken!");
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFirstName(InputSanitizer.sanitizeRequired(signupRequest.getFirstName(), "First name"));
        user.setLastName(InputSanitizer.sanitizeRequired(signupRequest.getLastName(), "Last name"));
        user.setPhoneNumber(InputSanitizer.sanitizeNullable(signupRequest.getPhoneNumber()));
        user.setAddress(InputSanitizer.sanitizeNullable(signupRequest.getAddress()));
        user.setCity(InputSanitizer.sanitizeNullable(signupRequest.getCity()));
        user.setCountry(InputSanitizer.sanitizeNullable(signupRequest.getCountry()));
        user.setRole(User.Role.USER);
        user.setActive(true);
        
        return userRepository.save(user);
    }
    
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        String normalizedEmail = InputSanitizer.normalizeEmail(loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                normalizedEmail,
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new JwtResponse(
            jwt,
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole().name()
        );
    }
}
