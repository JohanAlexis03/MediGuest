package com.mediquest.backend.config;

import com.mediquest.backend.domain.enums.Role;
import com.mediquest.backend.domain.model.User;
import com.mediquest.backend.repository.UserRepository;
import com.mediquest.backend.service.CaseLoaderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CaseLoaderService caseLoaderService;

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        caseLoaderService.loadCasesFromJson();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Usuarios ya inicializados en la base de datos.");
            return;
        }

        User student = User.builder()
                .name("Estudiante APH")
                .email("student@mediquest.edu")
                .passwordHash("password123")
                .role(Role.ROLE_STUDENT)
                .build();

        User teacher = User.builder()
                .name("Profesor Instructor APH")
                .email("docente@mediquest.edu")
                .passwordHash("password123")
                .role(Role.ROLE_TEACHER)
                .build();

        userRepository.saveAll(List.of(student, teacher));
        log.info("Usuarios semilla creados exitosamente (student@mediquest.edu, docente@mediquest.edu).");
    }
}
