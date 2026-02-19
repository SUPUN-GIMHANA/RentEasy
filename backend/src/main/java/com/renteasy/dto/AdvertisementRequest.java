package com.renteasy.dto;

import com.renteasy.model.Advertisement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdvertisementRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String linkUrl;

    @NotNull(message = "Position is required")
    private Advertisement.AdPosition position;

    private Boolean active = true;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private BigDecimal cost;
}
