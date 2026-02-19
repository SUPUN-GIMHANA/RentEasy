package com.renteasy.service;

import com.renteasy.dto.ItemRequest;
import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.repository.ItemRepository;
import com.renteasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Item createItem(ItemRequest request, String userId) {
        User owner = resolveOwner(userId);
        
        Item item = new Item();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory() != null ? request.getCategory().trim() : null);
        item.setSubcategory(request.getSubcategory() != null ? request.getSubcategory().trim() : null);
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAdditionalImages(request.getAdditionalImages());
        item.setAvailable(request.getAvailable());
        item.setAvailableDates(request.getAvailableDates());
        item.setLocation(request.getLocation());
        item.setOwnerPhoneNumber(resolveOwnerPhoneNumber(request.getOwnerPhoneNumber(), owner));
        item.setMinimumRentalPeriod(request.getMinimumRentalPeriod());
        item.setMaximumRentalPeriod(request.getMaximumRentalPeriod());
        item.setOwner(owner);
        
        return itemRepository.save(item);
    }

    private User resolveOwner(String userId) {
        if (userId == null || "anonymous".equals(userId)) {
            return getOrCreateAnonymousUser();
        }

        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private User getOrCreateAnonymousUser() {
        return userRepository.findByEmail("anonymous@renteasy.local")
            .orElseGet(() -> {
                User user = new User();
                user.setEmail("anonymous@renteasy.local");
                user.setPassword("anonymous");
                user.setFirstName("Anonymous");
                user.setLastName("User");
                user.setRole(User.Role.USER);
                user.setActive(true);
                user.setEmailVerified(false);
                return userRepository.save(user);
            });
    }

    private String resolveOwnerPhoneNumber(String requestedPhoneNumber, User owner) {
        if (requestedPhoneNumber != null && !requestedPhoneNumber.trim().isEmpty()) {
            return requestedPhoneNumber.trim();
        }

        return owner != null ? owner.getPhoneNumber() : null;
    }
    
    @Transactional
    public Item updateItem(String itemId, ItemRequest request, String userId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this item");
        }
        
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory() != null ? request.getCategory().trim() : null);
        item.setSubcategory(request.getSubcategory() != null ? request.getSubcategory().trim() : null);
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAdditionalImages(request.getAdditionalImages());
        item.setAvailable(request.getAvailable());
        item.setAvailableDates(request.getAvailableDates());
        item.setLocation(request.getLocation());
        item.setOwnerPhoneNumber(resolveOwnerPhoneNumber(request.getOwnerPhoneNumber(), item.getOwner()));
        item.setMinimumRentalPeriod(request.getMinimumRentalPeriod());
        item.setMaximumRentalPeriod(request.getMaximumRentalPeriod());
        
        return itemRepository.save(item);
    }

    @Transactional
    public Item updateAvailableDates(String itemId, Set<LocalDate> availableDates, String userId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this item");
        }

        item.setAvailableDates(availableDates == null ? new HashSet<>() : new HashSet<>(availableDates));
        return itemRepository.save(item);
    }

    @Transactional
    public Item boostItem(String itemId, int durationDays, String userId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to boost this item");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentBoostUntil = item.getBoostedUntil();
        LocalDateTime boostStart = (currentBoostUntil != null && currentBoostUntil.isAfter(now)) ? currentBoostUntil : now;

        item.setBoosted(true);
        item.setBoostedUntil(boostStart.plusDays(durationDays));

        return itemRepository.save(item);
    }
    
    @Transactional(readOnly = true)
    public Item getItemById(String itemId) {
        return itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
    }
    
    @Transactional
    public void incrementViews(String itemId) {
        Item item = getItemById(itemId);
        item.setViews(item.getViews() + 1);
        itemRepository.save(item);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> getAllItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.findByAvailableTrue(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> getItemsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String trimmedCategory = category != null ? category.trim() : category;
        return itemRepository.findByCategoryAndAvailableTrue(trimmedCategory, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> getItemsByCategoryAndSubcategory(String category, String subcategory, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String trimmedCategory = category != null ? category.trim() : category;
        String trimmedSubcategory = subcategory != null ? subcategory.trim() : subcategory;
        System.out.println("Filtering items by category: '" + trimmedCategory + "' and subcategory: '" + trimmedSubcategory + "'");
        Page<Item> results = itemRepository.findByCategoryAndSubcategoryAndAvailableTrue(trimmedCategory, trimmedSubcategory, pageable);
        System.out.println("Found " + results.getTotalElements() + " items");
        return results;
    }
    
    @Transactional(readOnly = true)
    public Page<Item> searchItems(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.searchItems(searchTerm, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Item> getBoostedItems(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return itemRepository.findBoostedItems(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Item> getPopularItems(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return itemRepository.findPopularItems(pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Item> getUserItems(String userId) {
        return itemRepository.findByOwnerId(userId);
    }
    
    @Transactional
    public void deleteItem(String itemId, String userId) {
        Item item = getItemById(itemId);
        
        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this item");
        }
        
        itemRepository.delete(item);
    }
}
