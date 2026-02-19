package com.renteasy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemDTO {
    private String id;
    private String name;
    private String description;
    private String category;
    private String subcategory;
    private BigDecimal price;
    private String imageUrl;
    private List<String> additionalImages;
    private Boolean available;
    private List<String> availableDates;
    private String location;
    private Integer minimumRentalPeriod;
    private Integer maximumRentalPeriod;
    private String ownerPhoneNumber;
    private Integer views;
    private Boolean boosted;
    private LocalDateTime boostedUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerId;
    private String ownerName;
}
