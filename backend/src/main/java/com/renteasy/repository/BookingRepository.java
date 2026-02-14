package com.renteasy.repository;

import com.renteasy.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    List<Booking> findByUserId(String userId);
    
    Page<Booking> findByUserId(String userId, Pageable pageable);
    
    List<Booking> findByItemId(String itemId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.item.owner.id = :ownerId")
    List<Booking> findByItemOwnerId(@Param("ownerId") String ownerId);
    
    @Query("SELECT b FROM Booking b WHERE b.item.id = :itemId AND " +
           "b.status NOT IN ('CANCELLED', 'REFUNDED') AND " +
           "((b.startDate <= :endDate) AND (b.endDate >= :startDate))")
    List<Booking> findConflictingBookings(@Param("itemId") String itemId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}
