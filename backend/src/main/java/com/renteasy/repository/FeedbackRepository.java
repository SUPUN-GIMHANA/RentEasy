package com.renteasy.repository;

import com.renteasy.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {
    
    Optional<Feedback> findByBookingId(String bookingId);
    
    List<Feedback> findByUserId(String userId);
    
    List<Feedback> findByBookingItemId(String itemId);
    
    Boolean existsByBookingId(String bookingId);
}
