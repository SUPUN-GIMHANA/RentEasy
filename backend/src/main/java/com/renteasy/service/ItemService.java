package com.renteasy.service;

import com.renteasy.dto.ItemRequest;
import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.repository.ItemRepository;
import com.renteasy.repository.UserRepository;
import com.renteasy.util.InputSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private static final int MAX_ITEM_IMAGES = 5;
    
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public Item createItem(ItemRequest request, String userId) {
        User owner = resolveOwner(userId);
        PreparedImages preparedImages = prepareImages(request.getImageUrl(), request.getAdditionalImages());
        
        Item item = new Item();
        item.setName(InputSanitizer.sanitizeRequired(request.getName(), "Name"));
        item.setDescription(InputSanitizer.sanitizeNullable(request.getDescription()));
        item.setCategory(InputSanitizer.sanitizeRequired(request.getCategory(), "Category"));
        item.setSubcategory(InputSanitizer.sanitizeNullable(request.getSubcategory()));
        item.setPrice(request.getPrice());
        item.setImageUrl(preparedImages.mainImageUrl());
        item.setAdditionalImages(preparedImages.additionalImageUrls());
        item.setAvailable(request.getAvailable());
        item.setAvailableDates(request.getAvailableDates());
        item.setLocation(InputSanitizer.sanitizeNullable(request.getLocation()));
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
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
                user.setPassword(passwordEncoder.encode("anonymous-local-user"));
                user.setFirstName("Anonymous");
                user.setLastName("User");
                user.setRole(User.Role.USER);
                user.setActive(true);
                user.setEmailVerified(false);
                return userRepository.save(user);
            });
    }

    private String resolveOwnerPhoneNumber(String requestedPhoneNumber, User owner) {
        String sanitizedPhoneNumber = InputSanitizer.sanitizeNullable(requestedPhoneNumber);
        if (sanitizedPhoneNumber != null) {
            return sanitizedPhoneNumber;
        }

        return owner != null ? owner.getPhoneNumber() : null;
    }
    
    @Transactional
    public Item updateItem(String itemId, ItemRequest request, String userId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        PreparedImages preparedImages = prepareImages(request.getImageUrl(), request.getAdditionalImages());
        
        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this item");
        }
        
        item.setName(InputSanitizer.sanitizeRequired(request.getName(), "Name"));
        item.setDescription(InputSanitizer.sanitizeNullable(request.getDescription()));
        item.setCategory(InputSanitizer.sanitizeRequired(request.getCategory(), "Category"));
        item.setSubcategory(InputSanitizer.sanitizeNullable(request.getSubcategory()));
        item.setPrice(request.getPrice());
        item.setImageUrl(preparedImages.mainImageUrl());
        item.setAdditionalImages(preparedImages.additionalImageUrls());
        item.setAvailable(request.getAvailable());
        item.setAvailableDates(request.getAvailableDates());
        item.setLocation(InputSanitizer.sanitizeNullable(request.getLocation()));
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
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
        return itemRepository.findByCategoryAndSubcategoryAndAvailableTrue(trimmedCategory, trimmedSubcategory, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> searchItems(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.searchItems(InputSanitizer.sanitizeNullable(searchTerm), pageable);
    }

    @Transactional(readOnly = true)
    public Page<Item> searchItemsByLocation(String location, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.searchItemsByLocation(InputSanitizer.sanitizeNullable(location), pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> getBoostedItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("boostedUntil").descending());
        return itemRepository.findBoostedItems(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> getPopularItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("views").descending());
        return itemRepository.findPopularItems(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Item> getUserItems(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.findByOwnerId(userId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Item> getNearbyItems(double latitude, double longitude, double radiusKm, int page, int size) {
        if (radiusKm <= 0) {
            throw new RuntimeException("Radius must be greater than 0");
        }

        double latDelta = radiusKm / 111.0d;
        double cosLat = Math.cos(Math.toRadians(latitude));
        double lngDelta = radiusKm / (111.0d * Math.max(Math.abs(cosLat), 0.01d));

        double minLat = Math.max(-90.0d, latitude - latDelta);
        double maxLat = Math.min(90.0d, latitude + latDelta);
        double minLng = Math.max(-180.0d, longitude - lngDelta);
        double maxLng = Math.min(180.0d, longitude + lngDelta);

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        int candidateSize = Math.max(safeSize * 3, safeSize);

        Pageable candidatePageable = PageRequest.of(safePage, candidateSize, Sort.by("createdAt").descending());
        Page<Item> candidatesPage = itemRepository.findNearbyCandidates(minLat, maxLat, minLng, maxLng, candidatePageable);

        List<Item> nearby = candidatesPage.getContent().stream()
            .filter(item -> {
                double distance = calculateDistanceKm(latitude, longitude, item.getLatitude(), item.getLongitude());
                return distance <= radiusKm;
            })
            .collect(Collectors.toList());

        nearby.sort((a, b) -> {
            double distanceA = calculateDistanceKm(latitude, longitude, a.getLatitude(), a.getLongitude());
            double distanceB = calculateDistanceKm(latitude, longitude, b.getLatitude(), b.getLongitude());
            return Double.compare(distanceA, distanceB);
        });

        if (nearby.size() > safeSize) {
            nearby = nearby.subList(0, safeSize);
        }

        return new PageImpl<>(nearby, PageRequest.of(safePage, safeSize), candidatesPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Map<String, Double> getDistancesByItemId(double latitude, double longitude, List<Item> items) {
        return items.stream().collect(Collectors.toMap(
            Item::getId,
            item -> calculateDistanceKm(latitude, longitude, item.getLatitude(), item.getLongitude())
        ));
    }

    private double calculateDistanceKm(double fromLat, double fromLng, double toLat, double toLng) {
        final double earthRadiusKm = 6371.0;

        double dLat = Math.toRadians(toLat - fromLat);
        double dLng = Math.toRadians(toLng - fromLng);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(fromLat)) * Math.cos(Math.toRadians(toLat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }
    
    @Transactional
    public void deleteItem(String itemId, String userId) {
        Item item = getItemById(itemId);
        
        if (!item.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this item");
        }
        
        itemRepository.delete(item);
    }

    private PreparedImages prepareImages(String imageUrl, List<String> additionalImages) {
        List<String> normalizedImages = new ArrayList<>();

        String normalizedMainImage = normalizeImageUrl(imageUrl);
        if (normalizedMainImage != null) {
            normalizedImages.add(normalizedMainImage);
        }

        if (additionalImages != null) {
            for (String additionalImage : additionalImages) {
                String normalizedAdditionalImage = normalizeImageUrl(additionalImage);
                if (normalizedAdditionalImage != null) {
                    normalizedImages.add(normalizedAdditionalImage);
                }
            }
        }

        List<String> distinctImages = new ArrayList<>(new LinkedHashSet<>(normalizedImages));
        if (distinctImages.size() > MAX_ITEM_IMAGES) {
            throw new RuntimeException("Maximum 5 images are allowed per item");
        }

        if (distinctImages.isEmpty()) {
            return new PreparedImages(null, new ArrayList<>());
        }

        String mainImage = distinctImages.get(0);
        List<String> additional = new ArrayList<>(distinctImages.subList(1, distinctImages.size()));
        return new PreparedImages(mainImage, additional);
    }

    private String normalizeImageUrl(String imageUrl) {
        return InputSanitizer.sanitizeNullable(imageUrl);
    }

    private record PreparedImages(String mainImageUrl, List<String> additionalImageUrls) {}
}
