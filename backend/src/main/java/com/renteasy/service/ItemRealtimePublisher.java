package com.renteasy.service;

import com.renteasy.dto.ItemDTO;
import com.renteasy.dto.ItemRealtimeEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemRealtimePublisher {

    private static final String ITEM_TOPIC = "/topic/items";

    private final SimpMessagingTemplate messagingTemplate;

    public void publishCreated(String itemId, ItemDTO item) {
        publish("CREATED", itemId, item);
    }

    public void publishUpdated(String itemId, ItemDTO item) {
        publish("UPDATED", itemId, item);
    }

    public void publishDeleted(String itemId) {
        publish("DELETED", itemId, null);
    }

    private void publish(String action, String itemId, ItemDTO item) {
        messagingTemplate.convertAndSend(ITEM_TOPIC, new ItemRealtimeEvent(action, itemId, item));
    }
}
