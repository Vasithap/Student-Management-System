package com.gamagerecruiters.sms_backend.Controller;

import com.gamagerecruiters.sms_backend.Repository.StudentRepository;
import com.gamagerecruiters.sms_backend.Repository.UserRepository;
import com.gamagerecruiters.sms_backend.entity.User;
import com.gamagerecruiters.sms_backend.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin("http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }


        String username = authentication.getName();
        Student student = studentRepository.findByEmail(username);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student profile not found");
        }

        // Avoid null values for optional course fee fields.
        if (student.getCourse() != null) {
            if (student.getCourse().getFeeAmount() == null) {
                student.getCourse().setFeeAmount(0.0);
            }
            if (student.getCourse().getDurationDays() == null) {
                student.getCourse().setDurationDays(0);
            }
        }

        return ResponseEntity.ok(student);
    }

    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String name) {
        return studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Error: Email is already registered!");
        }

        if (student.getProfileLocked() == null) {
            student.setProfileLocked(false);
        }

        Student saved = studentRepository.save(student);


        if (userRepository.findByUsername(saved.getEmail()) == null) {
            User user = new User();
            user.setUsername(saved.getEmail());
            user.setPassword(passwordEncoder.encode(saved.getNic())); 
            user.setRole("STUDENT");
            userRepository.save(user);
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student details) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));


        student.setFirstName(details.getFirstName());
        student.setLastName(details.getLastName());
        student.setEmail(details.getEmail());
        student.setPhone(details.getPhone());
        student.setAddress(details.getAddress());
        student.setNic(details.getNic());
        student.setGuardianName(details.getGuardianName());
        student.setGuardianPhone(details.getGuardianPhone());
        student.setCourse(details.getCourse());



        return studentRepository.save(student);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody Student incoming) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String username = authentication.getName();
        Student student = studentRepository.findByEmail(username);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student profile not found");
        }

        if (Boolean.TRUE.equals(student.getProfileLocked())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Profile update already used. Contact admin for further changes.");
        }

        // Allow only contact fields for self-update
        if (incoming.getPhone() != null) {
            student.setPhone(incoming.getPhone());
        }
        if (incoming.getAddress() != null) {
            student.setAddress(incoming.getAddress());
        }
        if (incoming.getGuardianName() != null) {
            student.setGuardianName(incoming.getGuardianName());
        }
        if (incoming.getGuardianPhone() != null) {
            student.setGuardianPhone(incoming.getGuardianPhone());
        }

        student.setProfileLocked(true);

        return ResponseEntity.ok(studentRepository.save(student));
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully!";
    }
}