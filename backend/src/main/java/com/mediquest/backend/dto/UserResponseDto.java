package com.mediquest.backend.dto;

import com.mediquest.backend.domain.enums.Role;

public record UserResponseDto(
    Long id,
    String name,
    String email,
    Role role
) {}
