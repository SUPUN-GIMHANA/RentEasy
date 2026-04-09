package com.renteasy.service;

import com.renteasy.dto.ItemRequest;
import com.renteasy.model.Item;
import com.renteasy.model.User;
import com.renteasy.repository.ItemRepository;
import com.renteasy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ItemService itemService;

    private User owner;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId("user-1");
        owner.setEmail("owner@test.com");
        owner.setPassword("hashed");
        owner.setFirstName("Owner");
        owner.setLastName("User");
        owner.setRole(User.Role.USER);
    }

    @Test
    void createItem_shouldPersistMappedFields() {
        ItemRequest request = new ItemRequest();
        request.setName("Camera");
        request.setDescription("4K camera");
        request.setCategory("electronics");
        request.setSubcategory("Cameras");
        request.setPrice(BigDecimal.valueOf(4500));
        request.setAvailable(true);
        request.setAvailableDates(Set.of());
        request.setLocation("Colombo");
        request.setOwnerPhoneNumber("0771234567");

        when(userRepository.findById("user-1")).thenReturn(Optional.of(owner));
        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Item result = itemService.createItem(request, "user-1");

        ArgumentCaptor<Item> captor = ArgumentCaptor.forClass(Item.class);
        verify(itemRepository).save(captor.capture());
        Item saved = captor.getValue();

        assertEquals("Camera", saved.getName());
        assertEquals("electronics", saved.getCategory());
        assertEquals(owner, saved.getOwner());
        assertEquals("0771234567", saved.getOwnerPhoneNumber());
        assertNotNull(result);
    }

    @Test
    void deleteItem_shouldThrowWhenRequesterIsNotOwner() {
        Item item = new Item();
        item.setId("item-1");
        item.setOwner(owner);

        when(itemRepository.findById("item-1")).thenReturn(Optional.of(item));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> itemService.deleteItem("item-1", "other-user"));

        assertEquals("You don't have permission to delete this item", ex.getMessage());
    }
}
