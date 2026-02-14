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

import java.util.List;

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
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAdditionalImages(request.getAdditionalImages());
        item.setAvailable(request.getAvailable());
        item.setAvailableDates(request.getAvailableDates());
        item.setLocation(request.getLocation());
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
    
    @Transactional
    public Item updateItem(String itemId, ItemRequest request, String userId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this item");
        }
        
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setAdditionalImages(request.getAdditionalImages());
        item.setAvailable(request.getAvailable());
        item.setAvailableDates(request.getAvailableDates());
        item.setLocation(request.getLocation());
        item.setMinimumRentalPeriod(request.getMinimumRentalPeriod());
        item.setMaximumRentalPeriod(request.getMaximumRentalPeriod());
        
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
        return itemRepository.findByCategoryAndAvailableTrue(category, pageable);
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
