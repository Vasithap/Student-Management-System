package com.gamagerecruiters.sms_backend.Controller;

import com.gamagerecruiters.sms_backend.Repository.CourseRepository;
import com.gamagerecruiters.sms_backend.Repository.StudentRepository;
import com.gamagerecruiters.sms_backend.entity.Course;
import com.gamagerecruiters.sms_backend.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/courses")
@CrossOrigin("http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Course> getAllCourses() {
        List<Course> courselist = courseRepository.findAll();
        return courselist;
    }

    @GetMapping("/search")
    public List<Course> searchCourses(@RequestParam String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        if (course.getFeeAmount() == null) {
            course.setFeeAmount(0.0);
        }
        if (course.getDurationDays() == null) {
            course.setDurationDays(0);
        }
        return courseRepository.save(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        if (courseDetails.getFeeAmount() != null) {
            course.setFeeAmount(courseDetails.getFeeAmount());
        }
        if (courseDetails.getDurationDays() != null) {
            course.setDurationDays(courseDetails.getDurationDays());
        }
        return courseRepository.save(course);
    }

    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return "Course deleted successfully!";
    }
}