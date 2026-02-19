package com.renteasy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "LONGTEXT")
    private String description;
    
    @Column(nullable = false)
    private String category;
    
    private String subcategory;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;
    
    @ElementCollection
    @CollectionTable(name = "item_images", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private List<String> additionalImages = new ArrayList<>();
    
    @Column(nullable = false)
    private Boolean available = true;
    
    @ElementCollection
    @CollectionTable(name = "item_available_dates", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "available_date")
    private Set<LocalDate> availableDates = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "owner_phone_number")
    private String ownerPhoneNumber;
    
    private String location;
    private Integer minimumRentalPeriod = 1; // days
    private Integer maximumRentalPeriod = 30; // days
    
    @Column(nullable = false)
    private Integer views = 0;
    
    @Column(nullable = false)
    private Boolean boosted = false;
    
    private LocalDateTime boostedUntil;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private Set<Booking> bookings = new HashSet<>();
    
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private Set<Comment> comments = new HashSet<>();
    
    @ManyToMany(mappedBy = "savedItems")
    private Set<User> savedByUsers = new HashSet<>();
}
