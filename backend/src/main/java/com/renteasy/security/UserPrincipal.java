package com.renteasy.security;

// Make UserPrincipal a public class so it can be accessed from controllers
public class UserPrincipal implements org.springframework.security.core.userdetails.UserDetails {
    private String id;
    private String email;
    private String password;
    private java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities;
    
    public UserPrincipal(String id, String email, String password, 
                        java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }
    
    public static UserPrincipal create(com.renteasy.model.User user) {
        java.util.Collection<org.springframework.security.core.GrantedAuthority> authorities = 
            java.util.Collections.singleton(
                new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name())
            );
        
        return new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPassword(),
            authorities
        );
    }
    
    public String getId() {
        return id;
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
}
