package com.mediquest.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("POST /api/auth/login con credenciales válidas debe retornar 200 y datos del usuario")
    void testLoginSuccess() throws Exception {
        String jsonPayload = """
                {
                    "email": "student@mediquest.edu",
                    "password": "password123"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("student@mediquest.edu"))
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.role").value("ROLE_STUDENT"));
    }

    @Test
    @DisplayName("POST /api/auth/login con contraseña incorrecta debe retornar 401 Unauthorized")
    void testLoginInvalidPassword() throws Exception {
        String jsonPayload = """
                {
                    "email": "student@mediquest.edu",
                    "password": "wrongpassword"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/register debe crear un nuevo usuario y retornar 201 Created")
    void testRegisterNewUser() throws Exception {
        String email = "paula.test" + System.currentTimeMillis() + "@mediquest.edu";
        String jsonPayload = String.format("""
                {
                    "name": "Paula Gómez",
                    "email": "%s",
                    "password": "segura2026password"
                }
                """, email);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Paula Gómez"))
                .andExpect(jsonPath("$.email").value(email.toLowerCase()))
                .andExpect(jsonPath("$.role").value("ROLE_STUDENT"));
    }
}
