package com.mediquest.backend.service;

import com.mediquest.backend.domain.enums.Role;
import com.mediquest.backend.domain.model.User;
import com.mediquest.backend.dto.LoginRequestDto;
import com.mediquest.backend.dto.RegisterRequestDto;
import com.mediquest.backend.dto.UserResponseDto;
import com.mediquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponseDto register(RegisterRequestDto request) {
        String cleanEmail = request.email().toLowerCase().trim();
        if (userRepository.findByEmail(cleanEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo electrónico ya está registrado en el sistema.");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(cleanEmail)
                .passwordHash(request.password())
                .role(Role.ROLE_STUDENT)
                .build();

        User saved = userRepository.save(user);
        return new UserResponseDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    @Transactional(readOnly = true)
    public UserResponseDto login(LoginRequestDto request) {
        String cleanEmail = request.email().toLowerCase().trim();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas: correo o clave no coinciden."));

        if (!user.getPasswordHash().equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas: correo o clave no coinciden.");
        }

        return new UserResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
