package com.renteasy.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {
    
    public static String getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ((com.renteasy.security.UserPrincipal) userDetails).getId();
    }
    
    public static boolean isCurrentUser(Authentication authentication, String userId) {
        String currentUserId = getCurrentUserId(authentication);
        return currentUserId.equals(userId);
    }
}
