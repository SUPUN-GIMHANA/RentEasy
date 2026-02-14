package com.renteasy.service;

import com.renteasy.dto.FeedbackRequest;
import com.renteasy.model.Booking;
import com.renteasy.model.Feedback;
import com.renteasy.model.User;
import com.renteasy.repository.BookingRepository;
import com.renteasy.repository.FeedbackRepository;
import com.renteasy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    
    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Feedback createFeedback(FeedbackRequest request, String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if user made this booking
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only provide feedback for your own bookings");
        }
        
        // Check if booking is completed
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("You can only provide feedback for completed bookings");
        }
        
        // Check if feedback already exists
        if (feedbackRepository.existsByBookingId(booking.getId())) {
            throw new RuntimeException("Feedback already exists for this booking");
        }
        
        Feedback feedback = new Feedback();
        feedback.setBooking(booking);
        feedback.setUser(user);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        
        return feedbackRepository.save(feedback);
    }
    
    @Transactional(readOnly = true)
    public Feedback getFeedbackById(String feedbackId) {
        return feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }
    
    @Transactional(readOnly = true)
    public List<Feedback> getItemFeedbacks(String itemId) {
        return feedbackRepository.findByBookingItemId(itemId);
    }
    
    @Transactional(readOnly = true)
    public List<Feedback> getUserFeedbacks(String userId) {
        return feedbackRepository.findByUserId(userId);
    }
}
