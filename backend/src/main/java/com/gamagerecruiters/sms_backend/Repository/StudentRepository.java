package com.gamagerecruiters.sms_backend.Repository;

import com.gamagerecruiters.sms_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
