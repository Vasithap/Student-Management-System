package com.gamagerecruiters.sms_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    // Used by Admin analytics and shown to students in "My Courses"
    @Column(nullable = true)
    private Double feeAmount = 0.0;

    // Course duration (days). Keep simple for assignment requirements.
    @Column(nullable = true)
    private Integer durationDays = 0;
}