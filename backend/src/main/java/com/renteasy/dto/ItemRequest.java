package com.renteasy.dto;

import jakarta.validation.constraints.NotBlank;
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
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private String imageUrl;
    private List<String> additionalImages;
    private Boolean available = true;
    private Set<LocalDate> availableDates;
    private String location;
    private Integer minimumRentalPeriod;
    private Integer maximumRentalPeriod;
}
