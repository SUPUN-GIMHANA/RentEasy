package com.renteasy.repository;

import com.renteasy.model.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, String> {

       List<Advertisement> findAllByOrderByCreatedAtDesc();

       List<Advertisement> findByActiveTrueOrderByCreatedAtDesc();
    
    @Query("SELECT a FROM Advertisement a WHERE a.active = true AND " +
           "a.startDate <= :now AND a.endDate >= :now AND a.position = :position")
    List<Advertisement> findActiveAdsByPosition(@Param("position") Advertisement.AdPosition position,
                                                 @Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Advertisement a WHERE a.active = true AND " +
           "a.startDate <= :now AND a.endDate >= :now")
    List<Advertisement> findAllActiveAds(@Param("now") LocalDateTime now);
}
