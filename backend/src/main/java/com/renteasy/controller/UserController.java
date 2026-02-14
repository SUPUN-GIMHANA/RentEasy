package com.renteasy.controller;

import com.renteasy.model.User;
import com.renteasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Don't send password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Don't send password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody User userUpdate, 
                                          Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update only allowed fields
        if (userUpdate.getFirstName() != null) user.setFirstName(userUpdate.getFirstName());
        if (userUpdate.getLastName() != null) user.setLastName(userUpdate.getLastName());
        if (userUpdate.getPhoneNumber() != null) user.setPhoneNumber(userUpdate.getPhoneNumber());
        if (userUpdate.getAddress() != null) user.setAddress(userUpdate.getAddress());
        if (userUpdate.getCity() != null) user.setCity(userUpdate.getCity());
        if (userUpdate.getCountry() != null) user.setCountry(userUpdate.getCountry());
        if (userUpdate.getProfileImageUrl() != null) user.setProfileImageUrl(userUpdate.getProfileImageUrl());
        
        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        
        return ResponseEntity.ok(savedUser);
    }
    
    private String getUserIdFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ((com.renteasy.security.UserPrincipal) userDetails).getId();
    }
}
