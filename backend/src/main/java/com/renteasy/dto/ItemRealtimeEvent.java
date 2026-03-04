package com.renteasy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemRealtimeEvent {
    private String action;
    private String itemId;
    private ItemDTO item;
}
