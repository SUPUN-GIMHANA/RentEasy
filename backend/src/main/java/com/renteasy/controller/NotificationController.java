package com.renteasy.controller;

import com.renteasy.dto.ApiResponse;
import com.renteasy.dto.NotificationDTO;
import com.renteasy.model.Notification;
import com.renteasy.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getMyNotifications(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<NotificationDTO>> getMyNotificationsPaginated(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userId = getUserIdFromAuthentication(authentication);
        Page<Notification> notifications = notificationService.getUserNotificationsPaginated(userId, page, size);
        return ResponseEntity.ok(notifications.map(this::convertToDTO));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id, 
                                       Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            Notification notification = notificationService.markAsRead(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read", convertToDTO(notification)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id,
                                               Authentication authentication) {
        try {
            String userId = getUserIdFromAuthentication(authentication);
            notificationService.deleteNotification(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Notification deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    private String getUserIdFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ((com.renteasy.security.UserPrincipal) userDetails).getId();
    }
    
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType().toString());
        dto.setRead(notification.getRead());
        dto.setRelatedEntityId(notification.getRelatedEntityId());
        dto.setRelatedEntityType(notification.getRelatedEntityType());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
