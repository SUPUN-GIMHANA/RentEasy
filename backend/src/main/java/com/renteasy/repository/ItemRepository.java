package com.renteasy.repository;

import com.renteasy.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {
    
    Page<Item> findByAvailableTrue(Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.available = true AND LOWER(i.category) = LOWER(:category)")
    Page<Item> findByCategoryAndAvailableTrue(@Param("category") String category, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.available = true AND " +
           "LOWER(i.category) = LOWER(:category) AND " +
           "i.subcategory IS NOT NULL AND " +
           "LOWER(TRIM(i.subcategory)) = LOWER(TRIM(:subcategory))")
    Page<Item> findByCategoryAndSubcategoryAndAvailableTrue(@Param("category") String category, 
                                                            @Param("subcategory") String subcategory, 
                                                            Pageable pageable);
    
    List<Item> findByOwnerId(String ownerId);
    
    @Query("SELECT i FROM Item i WHERE i.available = true AND " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Item> searchItems(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.boosted = true AND i.boostedUntil > CURRENT_TIMESTAMP " +
           "AND i.available = true ORDER BY i.boostedUntil DESC")
    List<Item> findBoostedItems(Pageable pageable);
    
    @Query("SELECT i FROM Item i ORDER BY i.views DESC")
    List<Item> findPopularItems(Pageable pageable);
}
