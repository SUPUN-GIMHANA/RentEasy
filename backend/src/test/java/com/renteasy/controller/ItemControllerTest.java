package com.renteasy.controller;

import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.service.ItemRealtimePublisher;
import com.renteasy.service.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ItemControllerTest {

    @Mock
    private ItemService itemService;

    @Mock
    private ItemRealtimePublisher itemRealtimePublisher;

    @InjectMocks
    private ItemController itemController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(itemController).build();
    }

    @Test
    void getItemById_shouldReturnItemDto() throws Exception {
        User owner = new User();
        owner.setId("user-1");
        owner.setFirstName("John");
        owner.setLastName("Doe");

        Item item = new Item();
        item.setId("123e4567-e89b-12d3-a456-426614174000");
        item.setName("Camera");
        item.setCategory("electronics");
        item.setPrice(BigDecimal.valueOf(3000));
        item.setAvailable(true);
        item.setAdditionalImages(new ArrayList<>());
        item.setAvailableDates(new HashSet<>());
        item.setOwner(owner);

        when(itemService.getItemById(item.getId())).thenReturn(item);

        mockMvc.perform(get("/api/items/{id}", item.getId())
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(item.getId()))
            .andExpect(jsonPath("$.name").value("Camera"))
            .andExpect(jsonPath("$.ownerId").value("user-1"));
    }
}
