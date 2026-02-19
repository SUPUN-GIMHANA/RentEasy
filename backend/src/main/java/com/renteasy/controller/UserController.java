package com.renteasy.controller;

import com.renteasy.dto.ApiResponse;
import com.renteasy.dto.ItemDTO;
import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.repository.ItemRepository;
import com.renteasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    
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

    @GetMapping("/me/saved-items")
    public ResponseEntity<List<ItemDTO>> getSavedItems(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getSavedItems().stream().map(this::convertToItemDTO).collect(Collectors.toList()));
    }

    @PostMapping("/me/saved-items/{itemId}")
    public ResponseEntity<?> saveItem(@PathVariable String itemId, Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        user.getSavedItems().add(item);
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Item saved successfully"));
    }

    @DeleteMapping("/me/saved-items/{itemId}")
    public ResponseEntity<?> unsaveItem(@PathVariable String itemId, Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.getSavedItems().removeIf(item -> item.getId().equals(itemId));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Item removed from saves"));
    }
    
    private String getUserIdFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ((com.renteasy.security.UserPrincipal) userDetails).getId();
    }

    private ItemDTO convertToItemDTO(Item item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory());
        dto.setSubcategory(item.getSubcategory());
        dto.setPrice(item.getPrice());
        dto.setImageUrl(item.getImageUrl());
        dto.setAdditionalImages(item.getAdditionalImages());
        dto.setAvailable(item.getAvailable());
        dto.setAvailableDates(item.getAvailableDates() == null ? null
            : item.getAvailableDates().stream().map(java.time.LocalDate::toString).collect(Collectors.toList()));
        dto.setLocation(item.getLocation());
        dto.setOwnerPhoneNumber(item.getOwnerPhoneNumber());
        dto.setMinimumRentalPeriod(item.getMinimumRentalPeriod());
        dto.setMaximumRentalPeriod(item.getMaximumRentalPeriod());
        dto.setViews(item.getViews());
        dto.setBoosted(item.getBoosted());
        dto.setBoostedUntil(item.getBoostedUntil());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        if (item.getOwner() != null) {
            dto.setOwnerId(item.getOwner().getId());
            dto.setOwnerName(item.getOwner().getFirstName() + " " + item.getOwner().getLastName());
        }
        return dto;
    }
}
