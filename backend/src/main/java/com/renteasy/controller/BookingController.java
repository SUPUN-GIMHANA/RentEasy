package com.renteasy.controller;

import com.renteasy.dto.ApiResponse;
import com.renteasy.dto.BookingRequest;
import com.renteasy.dto.BookingDTO;
import com.renteasy.model.Booking;
import com.renteasy.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request,
                                          Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            Booking booking = bookingService.createBooking(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Booking created successfully", convertToDTO(booking)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id,
                                                 @RequestParam Booking.BookingStatus status,
                                                 Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            Booking booking = bookingService.updateBookingStatus(id, status, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Booking status updated", convertToDTO(booking)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(convertToDTO(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/my-bookings/paginated")
    public ResponseEntity<Page<BookingDTO>> getMyBookingsPaginated(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = getUserIdFromAuthentication(authentication);
        Page<Booking> bookings = bookingService.getUserBookingsPaginated(userId, page, size);
        return ResponseEntity.ok(bookings.map(this::convertToDTO));
    }
    
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<BookingDTO>> getItemBookings(@PathVariable String itemId) {
        List<Booking> bookings = bookingService.getItemBookings(itemId);
        return ResponseEntity.ok(bookings.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/owner")
    public ResponseEntity<List<BookingDTO>> getOwnerBookings(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<Booking> bookings = bookingService.getOwnerBookings(userId);
        return ResponseEntity.ok(bookings.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    private String getUserIdFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ((com.renteasy.security.UserPrincipal) userDetails).getId();
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        if (booking.getItem() != null) {
            dto.setItemId(booking.getItem().getId());
            dto.setItemName(booking.getItem().getName());
            dto.setItemImage(booking.getItem().getImageUrl());
        }
        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
        }
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setRentalDays(booking.getRentalDays());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus().toString());
        dto.setDeliveryAddress(booking.getDeliveryAddress());
        dto.setSpecialInstructions(booking.getSpecialInstructions());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentTransactionId(booking.getPaymentTransactionId());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }
}
