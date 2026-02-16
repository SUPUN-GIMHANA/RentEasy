package com.renteasy.controller;

import com.renteasy.dto.ApiResponse;
import com.renteasy.dto.ItemRequest;
import com.renteasy.dto.ItemDTO;
import com.renteasy.model.Item;
import com.renteasy.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {
    
    private final ItemService itemService;
    
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createItemWithImages(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam(value = "subcategory", required = false) String subcategory,
            @RequestParam("price") String price,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam(value = "minimumRentalPeriod", required = false) String minimumRentalPeriod,
            @RequestParam(value = "maximumRentalPeriod", required = false) String maximumRentalPeriod,
            @RequestParam(value = "available", required = false, defaultValue = "true") String available,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "additionalImageFiles", required = false) MultipartFile[] additionalImageFiles,
            Authentication authentication) {
        try {
            // Create ItemRequest from multipart data
            ItemRequest request = new ItemRequest();
            request.setName(name);
            request.setCategory(category != null ? category.trim() : null);
            if (subcategory != null && !subcategory.trim().isEmpty()) {
                request.setSubcategory(subcategory.trim());
            }
            request.setPrice(new java.math.BigDecimal(price));
            request.setLocation(location);
            request.setDescription(description);
            request.setAvailable(Boolean.parseBoolean(available));
            
            if (minimumRentalPeriod != null && !minimumRentalPeriod.isEmpty()) {
                request.setMinimumRentalPeriod(Integer.parseInt(minimumRentalPeriod));
            }
            if (maximumRentalPeriod != null && !maximumRentalPeriod.isEmpty()) {
                request.setMaximumRentalPeriod(Integer.parseInt(maximumRentalPeriod));
            }
            
            // Convert image files to base64
            List<String> images = new ArrayList<>();
            if (imageFile != null && !imageFile.isEmpty()) {
                String base64Image = "data:" + imageFile.getContentType() + ";base64," + 
                    Base64.getEncoder().encodeToString(imageFile.getBytes());
                request.setImageUrl(base64Image);
            }
            
            if (additionalImageFiles != null && additionalImageFiles.length > 0) {
                for (MultipartFile file : additionalImageFiles) {
                    if (!file.isEmpty()) {
                        String base64Image = "data:" + file.getContentType() + ";base64," + 
                            Base64.getEncoder().encodeToString(file.getBytes());
                        images.add(base64Image);
                    }
                }
                request.setAdditionalImages(images);
            }
            
            // Get user ID or use anonymous
            String userId = "anonymous";
            if (authentication != null && authentication.isAuthenticated()) {
                try {
                    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                    userId = ((com.renteasy.security.UserPrincipal) userDetails).getId();
                } catch (Exception e) {
                    // If principal extraction fails, use anonymous
                    userId = "anonymous";
                }
            }
            
            Item item = itemService.createItem(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Item created successfully", item));
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Error processing image files: " + e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createItem(@Valid @RequestBody ItemRequest request, 
                                       Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            Item item = itemService.createItem(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Item created successfully", item));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable String id,
                                       @Valid @RequestBody ItemRequest request,
                                       Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            Item item = itemService.updateItem(id, request, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Item updated successfully", item));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable String id) {
        try {
            Item item = itemService.getItemById(id);
            itemService.incrementViews(id);
            return ResponseEntity.ok(convertToDTO(item));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<Page<ItemDTO>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Item> items = itemService.getAllItems(page, size);
        return ResponseEntity.ok(items.map(this::convertToDTO));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ItemDTO>> getItemsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String subcategory) {
        System.out.println("ItemController.getItemsByCategory called with category='" + category + "', subcategory='" + subcategory + "', page=" + page);
        Page<Item> items;
        String trimmedCategory = category.trim();
        if (subcategory != null && !subcategory.trim().isEmpty()) {
            String trimmedSubcategory = subcategory.trim();
            System.out.println("Filtering by category AND subcategory: '" + trimmedSubcategory + "'");
            items = itemService.getItemsByCategoryAndSubcategory(trimmedCategory, trimmedSubcategory, page, size);
        } else {
            System.out.println("Filtering by category only");
            items = itemService.getItemsByCategory(trimmedCategory, page, size);
        }
        return ResponseEntity.ok(items.map(this::convertToDTO));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<ItemDTO>> searchItems(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Item> items = itemService.searchItems(query, page, size);
        return ResponseEntity.ok(items.map(this::convertToDTO));
    }
    
    @GetMapping("/boosted")
    public ResponseEntity<List<ItemDTO>> getBoostedItems(
            @RequestParam(defaultValue = "10") int limit) {
        List<Item> items = itemService.getBoostedItems(limit);
        return ResponseEntity.ok(items.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<ItemDTO>> getPopularItems(
            @RequestParam(defaultValue = "10") int limit) {
        List<Item> items = itemService.getPopularItems(limit);
        return ResponseEntity.ok(items.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ItemDTO>> getUserItems(@PathVariable String userId) {
        List<Item> items = itemService.getUserItems(userId);
        return ResponseEntity.ok(items.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/my-items")
    public ResponseEntity<List<ItemDTO>> getMyItems(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<Item> items = itemService.getUserItems(userId);
        return ResponseEntity.ok(items.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable String id, 
                                       Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            itemService.deleteItem(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Item deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    private String getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return "anonymous";
        }
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return ((com.renteasy.security.UserPrincipal) userDetails).getId();
        } catch (Exception e) {
            return "anonymous";
        }
    }
    
    private ItemDTO convertToDTO(Item item) {
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
    }}