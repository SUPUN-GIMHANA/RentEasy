package com.renteasy.service;

import com.renteasy.dto.BookingRequest;
import com.renteasy.model.Booking;
import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.repository.BookingRepository;
import com.renteasy.repository.ItemRepository;
import com.renteasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public Booking createBooking(BookingRequest request, String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Item item = itemRepository.findById(request.getItemId())
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (!item.getAvailable()) {
            throw new RuntimeException("Item is not available for booking");
        }
        
        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            item.getId(), request.getStartDate(), request.getEndDate()
        );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Item is already booked for the selected dates");
        }
        
        // Calculate rental days and total price
        long rentalDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal totalPrice = item.getPrice().multiply(BigDecimal.valueOf(rentalDays));
        
        Booking booking = new Booking();
        booking.setItem(item);
        booking.setUser(user);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setRentalDays((int) rentalDays);
        booking.setTotalPrice(totalPrice);
        booking.setDeliveryAddress(request.getDeliveryAddress());
        booking.setSpecialInstructions(request.getSpecialInstructions());
        booking.setStatus(Booking.BookingStatus.PENDING);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Create notification for item owner
        notificationService.createNotification(
            item.getOwner().getId(),
            "New Booking Request",
            "You have a new booking request for " + item.getName(),
            "BOOKING_CONFIRMED"
        );
        
        return savedBooking;
    }
    
    @Transactional
    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if user is owner or the one who made the booking
        boolean isOwner = booking.getItem().getOwner().getId().equals(userId);
        boolean isBooker = booking.getUser().getId().equals(userId);
        
        if (!isOwner && !isBooker) {
            throw new RuntimeException("You don't have permission to update this booking");
        }
        
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        
        // Notify relevant parties
        if (status == Booking.BookingStatus.CONFIRMED) {
            notificationService.createNotification(
                booking.getUser().getId(),
                "Booking Confirmed",
                "Your booking for " + booking.getItem().getName() + " has been confirmed",
                "BOOKING_CONFIRMED"
            );
        } else if (status == Booking.BookingStatus.CANCELLED) {
            notificationService.createNotification(
                booking.getUser().getId(),
                "Booking Cancelled",
                "Your booking for " + booking.getItem().getName() + " has been cancelled",
                "BOOKING_CANCELLED"
            );
        }
        
        return updatedBooking;
    }
    
    @Transactional(readOnly = true)
    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    @Transactional(readOnly = true)
    public Page<Booking> getUserBookingsPaginated(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return bookingRepository.findByUserId(userId, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<Booking> getItemBookings(String itemId) {
        return bookingRepository.findByItemId(itemId);
    }
    
    @Transactional(readOnly = true)
    public List<Booking> getOwnerBookings(String ownerId) {
        return bookingRepository.findByItemOwnerId(ownerId);
    }
}
