package com.renteasy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
public class ItemRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String subcategory;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private String imageUrl;
    private List<String> additionalImages;
    private Boolean available = true;
    private Set<LocalDate> availableDates;
    private String location;
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private Double latitude;
    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private Double longitude;
    private String ownerPhoneNumber;
    private Integer minimumRentalPeriod;
    private Integer maximumRentalPeriod;
}
