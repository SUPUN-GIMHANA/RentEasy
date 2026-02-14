package com.renteasy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {
    private String id;
    private String title;
    private String message;
    private String type;
    private Boolean read;
    private String relatedEntityId;
    private String relatedEntityType;
    private LocalDateTime createdAt;
}
