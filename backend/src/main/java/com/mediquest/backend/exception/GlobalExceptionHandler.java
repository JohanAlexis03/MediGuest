package com.mediquest.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        int status = HttpStatus.NOT_FOUND.value();
        ErrorResponseDto error = ErrorResponseDto.builder()
                .status(status)
                .error("Recurso No Encontrado")
                .message(ex.getMessage())
                .catUrl("https://http.cat/" + status + ".jpg")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDto> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        int status = HttpStatus.BAD_REQUEST.value();
        String firstError = ex.getBindingResult().getAllErrors().isEmpty()
                ? "Solicitud inválida"
                : ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        ErrorResponseDto error = ErrorResponseDto.builder()
                .status(status)
                .error("Petición Inválida")
                .message(firstError)
                .catUrl("https://http.cat/" + status + ".jpg")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGeneral(Exception ex, HttpServletRequest request) {
        int status = HttpStatus.INTERNAL_SERVER_ERROR.value();
        ErrorResponseDto error = ErrorResponseDto.builder()
                .status(status)
                .error("Error Interno del Servidor")
                .message("Ocurrió un error inesperado al procesar la solicitud clínica.")
                .catUrl("https://http.cat/" + status + ".jpg")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
