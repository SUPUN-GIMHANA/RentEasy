package com.renteasy.util;

import org.springframework.web.util.HtmlUtils;

public final class InputSanitizer {

    private InputSanitizer() {
    }

    public static String sanitizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        return HtmlUtils.htmlEscape(trimmed);
    }

    public static String sanitizeRequired(String value, String fieldName) {
        String sanitized = sanitizeNullable(value);
        if (sanitized == null) {
            throw new RuntimeException(fieldName + " is required");
        }
        return sanitized;
    }

    public static String normalizeEmail(String email) {
        String sanitized = sanitizeRequired(email, "Email");
        return sanitized.toLowerCase();
    }
}