package com.mediquest.backend.service;

import tools.jackson.databind.ObjectMapper;
import com.mediquest.backend.domain.model.ClinicalCase;
import com.mediquest.backend.dto.CaseJsonDto;
import com.mediquest.backend.repository.ClinicalCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.Arrays;
import java.util.Comparator;

@Service
@Slf4j
@RequiredArgsConstructor
public class CaseLoaderService {

    private final ClinicalCaseRepository clinicalCaseRepository;
    private final ObjectMapper objectMapper;

    /**
     * Carga e inserta de forma idempotente todos los casos clínicos definidos en JSON bajo classpath:cases/*.json
     */
    @Transactional
    public int loadCasesFromJson() {
        int loadedCount = 0;
        int skippedCount = 0;

        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath*:cases/*.json");

            if (resources.length == 0) {
                log.info("No se encontraron archivos de casos clínicos en classpath:cases/*.json");
                return 0;
            }

            Arrays.sort(resources, Comparator.comparing(Resource::getFilename));

            int updatedCount = 0;

            for (Resource resource : resources) {
                try (InputStream is = resource.getInputStream()) {
                    CaseJsonDto dto = objectMapper.readValue(is, CaseJsonDto.class);
                    if (dto == null || dto.id() == null) {
                        log.warn("Archivo de caso inválido o sin ID: {}", resource.getFilename());
                        continue;
                    }

                    ClinicalCase existing = clinicalCaseRepository.findById(dto.id()).orElse(null);
                    if (existing == null) {
                        ClinicalCase entity = dto.toEntity();
                        clinicalCaseRepository.save(entity);
                        loadedCount++;
                        log.info("Caso clínico '{}' cargado exitosamente desde {}", dto.id(), resource.getFilename());
                    } else {
                        ClinicalCase updated = dto.toEntity();
                        existing.setTitle(updated.getTitle());
                        existing.setSpecialty(updated.getSpecialty());
                        existing.setDifficulty(updated.getDifficulty());
                        existing.setDispatchContext(updated.getDispatchContext());
                        existing.setScene(updated.getScene());
                        existing.setKinematicsOrOnset(updated.getKinematicsOrOnset());
                        existing.setProtocolReference(updated.getProtocolReference());
                        existing.setPatient(updated.getPatient());
                        existing.setVitals(updated.getVitals());
                        existing.setPrimarySurvey(updated.getPrimarySurvey());
                        existing.setSampleHistory(updated.getSampleHistory());
                        existing.setMedia(updated.getMedia());
                        clinicalCaseRepository.save(existing);
                        updatedCount++;
                    }
                } catch (Exception e) {
                    log.error("Error al procesar archivo de caso {}: {}", resource.getFilename(), e.getMessage(), e);
                }
            }

            log.info("Sincronización de casos completada: {} nuevos cargados, {} actualizados. Total en BD: {}",
                    loadedCount, updatedCount, clinicalCaseRepository.count());

        } catch (Exception e) {
            log.error("Fallo general en la lectura de casos clínicos JSON: {}", e.getMessage(), e);
        }

        return loadedCount;
    }
}
