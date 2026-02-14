package com.renteasy.controller;

import com.renteasy.dto.ApiResponse;
import com.renteasy.dto.FeedbackRequest;
import com.renteasy.model.Feedback;
import com.renteasy.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {
    
    private final FeedbackService feedbackService;
    
    @PostMapping
    public ResponseEntity<?> createFeedback(@Valid @RequestBody FeedbackRequest request,
                                           Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            Feedback feedback = feedbackService.createFeedback(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Feedback submitted successfully", feedback));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable String id) {
        try {
            Feedback feedback = feedbackService.getFeedbackById(id);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Feedback>> getItemFeedbacks(@PathVariable String itemId) {
        List<Feedback> feedbacks = feedbackService.getItemFeedbacks(itemId);
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getUserFeedbacks(@PathVariable String userId) {
        List<Feedback> feedbacks = feedbackService.getUserFeedbacks(userId);
        return ResponseEntity.ok(feedbacks);
    }
    
    private String getUserIdFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ((com.renteasy.security.UserPrincipal) userDetails).getId();
    }
}
