package com.mediquest.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDto {
    private Integer status;
    private String error;
    private String message;
    private String catUrl;          // Integración directa con http.cat (ej: https://http.cat/404.jpg)
    private String path;
    private LocalDateTime timestamp;
}
