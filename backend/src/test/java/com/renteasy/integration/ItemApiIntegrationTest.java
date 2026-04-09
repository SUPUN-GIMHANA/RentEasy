package com.renteasy.integration;

import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.repository.ItemRepository;
import com.renteasy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ItemApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setup() {
        itemRepository.deleteAll();
        userRepository.deleteAll();

        User owner = new User();
        owner.setEmail("integration-owner@test.com");
        owner.setPassword("hashed");
        owner.setFirstName("Integration");
        owner.setLastName("Owner");
        owner.setRole(User.Role.USER);
        owner.setActive(true);
        owner.setEmailVerified(true);
        User persistedOwner = userRepository.save(owner);

        Item item = new Item();
        item.setName("Integration Camera");
        item.setCategory("electronics");
        item.setPrice(BigDecimal.valueOf(6000));
        item.setAvailable(true);
        item.setOwner(persistedOwner);
        item.setAdditionalImages(new ArrayList<>());
        item.setAvailableDates(new HashSet<>());
        itemRepository.save(item);
    }

    @Test
    void getAllItems_shouldReturnPaginatedItems() throws Exception {
        mockMvc.perform(get("/api/items?page=0&size=10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].name").value("Integration Camera"))
            .andExpect(jsonPath("$.content[0].category").value("electronics"));
    }
}
