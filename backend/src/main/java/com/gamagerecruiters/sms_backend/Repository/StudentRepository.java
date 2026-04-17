package com.gamagerecruiters.sms_backend.Repository;

import com.gamagerecruiters.sms_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    boolean existsByEmail(String email);

    // Used for mapping JWT "username" (student email) -> Student record.
    Student findByEmail(String email);
}
