package com.renteasy.controller;

import com.renteasy.dto.AdvertisementRequest;
import com.renteasy.dto.ApiResponse;
import com.renteasy.model.Advertisement;
import com.renteasy.repository.AdvertisementRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/advertisements")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementRepository advertisementRepository;

    @GetMapping
    public ResponseEntity<?> getAllAdvertisements() {
        try {
            return ResponseEntity.ok(advertisementRepository.findAllByOrderByCreatedAtDesc());
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError()
                .body(new ApiResponse(false, "Failed to load advertisements: " + e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveAdvertisements() {
        try {
            return ResponseEntity.ok(advertisementRepository.findAllActiveAds(LocalDateTime.now()));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError()
                .body(new ApiResponse(false, "Failed to load active advertisements: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createAdvertisement(@Valid @RequestBody AdvertisementRequest request) {
        try {
            Advertisement advertisement = new Advertisement();
            advertisement.setTitle(request.getTitle());
            advertisement.setDescription(request.getDescription());
            advertisement.setImageUrl(request.getImageUrl());
            advertisement.setLinkUrl(request.getLinkUrl());
            advertisement.setPosition(request.getPosition());
            advertisement.setActive(request.getActive() != null ? request.getActive() : true);
            advertisement.setStartDate(request.getStartDate());
            advertisement.setEndDate(request.getEndDate());
            advertisement.setCost(request.getCost());

            Advertisement savedAd = advertisementRepository.save(advertisement);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Advertisement created successfully", savedAd));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAdStatus(@PathVariable String id, @RequestParam boolean active) {
        try {
            Advertisement advertisement = advertisementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found"));

            advertisement.setActive(active);
            Advertisement updated = advertisementRepository.save(advertisement);
            return ResponseEntity.ok(new ApiResponse(true, "Advertisement status updated", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
}
