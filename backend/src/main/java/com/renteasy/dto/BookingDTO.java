package com.renteasy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO {
    private String id;
    private String itemId;
    private String itemName;
    private String itemImage;
    private String userId;
    private String userName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer rentalDays;
    private BigDecimal totalPrice;
    private String status;
    private String deliveryAddress;
    private String specialInstructions;
    private String paymentStatus;
    private String paymentTransactionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
