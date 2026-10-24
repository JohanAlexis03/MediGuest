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

            for (Resource resource : resources) {
                try (InputStream is = resource.getInputStream()) {
                    CaseJsonDto dto = objectMapper.readValue(is, CaseJsonDto.class);
                    if (dto == null || dto.id() == null) {
                        log.warn("Archivo de caso inválido o sin ID: {}", resource.getFilename());
                        continue;
                    }

                    if (clinicalCaseRepository.existsById(dto.id())) {
                        skippedCount++;
                        continue;
                    }

                    ClinicalCase entity = dto.toEntity();
                    clinicalCaseRepository.save(entity);
                    loadedCount++;
                    log.info("Caso clínico '{}' cargado exitosamente desde {}", dto.id(), resource.getFilename());
                } catch (Exception e) {
                    log.error("Error al procesar archivo de caso {}: {}", resource.getFilename(), e.getMessage(), e);
                }
            }

            log.info("Sincronización de casos completada: {} nuevos cargados, {} existentes omitidos. Total en BD: {}",
                    loadedCount, skippedCount, clinicalCaseRepository.count());

        } catch (Exception e) {
            log.error("Fallo general en la lectura de casos clínicos JSON: {}", e.getMessage(), e);
        }

        return loadedCount;
    }
}
