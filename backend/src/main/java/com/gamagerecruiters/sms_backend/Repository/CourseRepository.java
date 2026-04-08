package com.gamagerecruiters.sms_backend.Repository;

import com.gamagerecruiters.sms_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}