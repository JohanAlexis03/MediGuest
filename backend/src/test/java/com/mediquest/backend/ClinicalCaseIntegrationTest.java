package com.mediquest.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ClinicalCaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/cases debe retornar el catálogo de casos clínicos iniciales")
    void testGetAllCases() throws Exception {
        mockMvc.perform(get("/api/cases"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].title").exists())
                .andExpect(jsonPath("$[0].specialty").exists());
    }

    @Test
    @DisplayName("GET /api/cases/{id} debe retornar caso completo pero con respuestas seguras")
    void testGetCaseById() throws Exception {
        mockMvc.perform(get("/api/cases/caso-trauma-pelvis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("caso-trauma-pelvis"))
                .andExpect(jsonPath("$.specialty").value("TRAUMA"))
                .andExpect(jsonPath("$.primarySurvey.airway").exists())
                .andExpect(jsonPath("$.vitals.heartRate").value(132))
                .andExpect(jsonPath("$.questions[0].options[0].text").exists())
                // Validar que isCorrect NO existe en el DTO seguro
                .andExpect(jsonPath("$.questions[0].options[0].isCorrect").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/cases/{id}/solve debe evaluar respuesta correcta y calcular 100% de nota")
    void testSolveCaseCorrect() throws Exception {
        String jsonPayload = """
                {
                    "selectedOptionKey": "A",
                    "timeSpentSeconds": 45,
                    "userEmail": "student@mediquest.edu"
                }
                """;

        mockMvc.perform(post("/api/cases/caso-trauma-pelvis/solve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caseId").value("caso-trauma-pelvis"))
                .andExpect(jsonPath("$.isCorrect").value(true))
                .andExpect(jsonPath("$.scorePercentage").value(100))
                .andExpect(jsonPath("$.correctOptionKey").value("A"))
                .andExpect(jsonPath("$.clinicalFeedback").exists());
    }

    @Test
    @DisplayName("GET /api/cases/inexistente debe retornar 404 con catUrl de http.cat")
    void testNotFoundWithHttpCat() throws Exception {
        mockMvc.perform(get("/api/cases/caso-que-no-existe-xyz"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.catUrl").value("https://http.cat/404.jpg"))
                .andExpect(jsonPath("$.error").value("Recurso No Encontrado"));
    }
}
