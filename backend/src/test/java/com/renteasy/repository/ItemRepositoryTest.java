package com.renteasy.repository;

import com.renteasy.model.Item;
import com.renteasy.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class ItemRepositoryTest {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByCategoryAndAvailableTrue_shouldReturnMatchingItems() {
        User owner = new User();
        owner.setEmail("repo-owner@test.com");
        owner.setPassword("hashed");
        owner.setFirstName("Repo");
        owner.setLastName("Owner");
        owner.setRole(User.Role.USER);
        owner.setActive(true);
        owner.setEmailVerified(true);
        User persistedOwner = userRepository.save(owner);

        Item item = new Item();
        item.setName("DSLR Camera");
        item.setCategory("electronics");
        item.setPrice(BigDecimal.valueOf(5000));
        item.setAvailable(true);
        item.setOwner(persistedOwner);
        item.setAdditionalImages(new ArrayList<>());
        item.setAvailableDates(new HashSet<>());
        itemRepository.save(item);

        Page<Item> result = itemRepository.findByCategoryAndAvailableTrue("electronics", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("DSLR Camera", result.getContent().get(0).getName());
    }
}
