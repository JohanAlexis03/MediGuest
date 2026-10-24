package com.mediquest.backend.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalMedia {

    @Column(name = "media_type")
    private String mediaType;       // "ecg", "xray", "monitor", "scale", "algorithm"

    @Column(name = "media_title")
    private String title;

    @Column(name = "media_subtitle")
    private String subtitle;
    
    @Column(name = "media_findings", columnDefinition = "TEXT")
    private String findings;
    
    @Column(name = "media_badge_label")
    private String badgeLabel;

    @Column(name = "media_image_url")
    private String imageUrl;

    @Column(name = "media_image_caption")
    private String imageCaption;
}
