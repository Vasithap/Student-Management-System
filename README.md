# Student Management System

## Overview
This project is a full stack `Student Management System` built with:

- `Next.js` for the frontend
- `Spring Boot` for the backend REST API
- `PostgreSQL (Supabase)` for the database
- `JWT` for authentication

The system currently focuses mainly on two working roles:

- `ADMIN`
- `STUDENT`

`STAFF` exists as a role value in the authentication model, but the main completed business flow is currently centered on `ADMIN` and `STUDENT`.

## Main Features
### Authentication and Authorization
- JWT-based authentication
- Role-based route and API protection
- Student login using `Email + NIC`
- Admin login using `Username + Password`
- Passwords are hashed before storage

### Student Management
- Admin can register students
- Admin can edit student records
- Admin can delete student records
- Admin can assign one course to each student
- Student login account is auto-created during student registration

### Student Self Service
- Student can log into the website after being registered by admin
- Student can see only their own profile
- Student can see only the course assigned to them
- Student can update personal contact details one time only
- After the one-time update, the profile becomes locked for student editing
- Admin can still edit the student after the profile is locked

### Course Management
- Admin can create courses
- Admin can update courses
- Admin can delete courses
- Course data includes:
  - title
  - description
  - fee amount
  - duration in days

### Dashboard
- Admin dashboard displays:
  - total student count
  - total course count
- Students are redirected to their own profile page instead of the admin dashboard

## Business Flow
### Admin Registers a Student
The admin creates a student using the student management form with:

- First Name
- Last Name
- Identity / NIC
- Digital Mail
- Contact Phone
- Guardian Name
- Guardian Phone
- Course Assignment
- Residential Location

When the admin saves the student:

- a row is created in the `students` table
- a row is automatically created in the `users` table
- the student login account is generated as:
  - `username = student email`
  - `password = student NIC`
  - `role = STUDENT`

The password is stored as a hashed value, not plain text.

### Student Login Flow
Student signs in using:

- `Email`
- `NIC`

After login:

- the student is redirected to `/my-profile`
- only the logged-in student's own details are loaded
- only that student's assigned course is shown

### One-Time Profile Update Rule
Student is allowed to update only these personal contact fields:

- phone
- address
- guardian name
- guardian phone

After the first successful self-update:

- `profileLocked` becomes `true`
- student editing is disabled permanently
- the student can only view the profile afterward
- admin remains able to update the same student later

## Technology Stack
### Frontend
- `Next.js 16`
- `React 19`
- `TypeScript`
- `Axios`
- `Tailwind CSS`

### Backend
- `Spring Boot 4`
- `Spring Web MVC`
- `Spring Data JPA`
- `Spring Security`
- `JWT (jjwt)`
- `Lombok`

### Database
- `PostgreSQL`
- `Supabase`

## Project Structure
```text
student-management-system/
|-- backend/
|   |-- src/main/java/com/gamagerecruiters/sms_backend/
|   |   |-- Controller/
|   |   |-- Repository/
|   |   |-- config/
|   |   |-- entity/
|   |   `-- security/
|   `-- src/main/resources/
|
|-- frontend/
|   |-- app/
|   |   |-- courses/
|   |   |-- dashboard/
|   |   |-- login/
|   |   |-- my-profile/
|   |   `-- students/
|   |-- components/
|   `-- lib/
|
`-- README.md
```

## Backend Architecture
### Entities
- `User`
  - stores authentication account details
  - fields: `id`, `username`, `password`, `role`
- `Student`
  - stores student profile details
  - fields include `firstName`, `lastName`, `email`, `phone`, `address`, `nic`, `guardianName`, `guardianPhone`, `profileLocked`, `course`
- `Course`
  - stores course details
  - fields include `title`, `description`, `feeAmount`, `durationDays`

### Repositories
- `UserRepository`
- `StudentRepository`
- `CourseRepository`

### Controllers
- `AuthController`
  - handles login and manual user registration
- `StudentController`
  - admin CRUD for students
  - student self-profile fetch
  - student one-time self-update
  - auto student account creation at registration time
- `CourseController`
  - course CRUD and course search
- `UserController`
  - general user CRUD

### Security Layer
- `SecurityConfig`
  - configures endpoint access by role
- `JwtUtils`
  - token generation and validation
- `JwtAuthenticationFilter`
  - extracts JWT and loads user role into Spring Security context

## Frontend Pages
### `/`
- still the default Next.js starter home page
- can be replaced later with a custom landing page

### `/login`
- shared login page
- students use `Email + NIC`
- admin uses `Username + Password`

### `/dashboard`
- admin dashboard page
- displays summary counts
- students are redirected away from this page

### `/students`
- admin-only page
- register students
- edit student details
- delete students
- assign course during registration

### `/courses`
- admin-only page
- create, edit, delete courses
- manage fee amount and duration

### `/my-profile`
- student-only page
- view own profile
- view assigned course
- update contact details once

## API Summary
### Authentication
- `POST /api/auth/register`
  - manually create a user
- `POST /api/auth/login`
  - login and receive JWT token

### Students
- `GET /api/students`
  - admin only
- `GET /api/students/search`
  - admin only
- `POST /api/students`
  - admin only
  - creates the student and auto-creates a `STUDENT` login account
- `PUT /api/students/{id}`
  - admin only
- `DELETE /api/students/{id}`
  - admin only
- `GET /api/students/me`
  - student only
- `PUT /api/students/me`
  - student only
  - allowed once only

### Courses
- `GET /api/courses`
  - admin only in the current implementation
- `GET /api/courses/search`
  - admin only
- `POST /api/courses`
  - admin only
- `PUT /api/courses/{id}`
  - admin only
- `DELETE /api/courses/{id}`
  - admin only

### Users
- `GET /api/users`
- `GET /api/users/search`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

## Current Access Rules
- `ADMIN`
  - can access `/dashboard`
  - can manage students
  - can manage courses
- `STUDENT`
  - can access `/my-profile`
  - can fetch only own profile
  - can update own contact details only once

## Setup Instructions
### Prerequisites
- `Node.js`
- `npm`
- `Java 17`
- `Maven`
- `PostgreSQL` or `Supabase`

### Clone the Project
```bash
git clone <repository-url>
cd student-management-system
```

### Backend Setup
```bash
cd backend
mvn spring-boot:run
```

Or build it first:

```bash
mvn -DskipTests package
```

Backend default URL:

- `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend default URL:

- `http://localhost:3000`

## Configuration Notes
The backend currently reads database configuration from `backend/src/main/resources/application.properties`.

Recommended improvement:

- move all database credentials and secrets out of source code
- use environment variables for production

Example placeholder configuration:

```properties
spring.datasource.url=jdbc:postgresql://<host>:5432/<database>
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.jpa.hibernate.ddl-auto=update
```

## How to Use
### Admin Workflow
1. Log in as admin.
2. Create courses in `/courses`.
3. Register students in `/students`.
4. Assign a course during student registration.
5. Edit or delete student records whenever needed.

### Student Workflow
1. Wait until admin registers the account.
2. Log in using registered email and NIC.
3. Open `/my-profile`.
4. Check personal details and assigned course.
5. Update contact information one time only.
6. After saving once, the profile becomes locked.

## Important Implementation Notes
- Student email is used as the login username.
- Student NIC is used as the initial login password.
- Student cannot change email, NIC, or assigned course.
- Passwords are stored in hashed form.
- Password fields are write-only in API serialization.
- Student-course relation is currently `one student -> one course`.
- The home page is still the default Next.js starter page.

## Known Limitations
- No default seeded admin account yet
- No password reset flow yet
- No attendance tracking yet
- No progress tracking yet
- No payment history yet
- No revenue analytics yet
- No deployment guide yet
- No service layer or DTO separation yet

## Suggested Future Improvements
- Seed a default admin account during first startup
- Add many-to-many enrollments instead of single-course assignment
- Add attendance and progress modules
- Add fee payments and revenue reporting
- Add reset password workflow
- Replace the default homepage with a branded landing page
- Move secrets and connection info to environment variables
- Add DTOs, services, and validation classes for cleaner architecture

## Verification
The project was verified with:

- `mvn -DskipTests package`
- `npm run build`

Both commands completed successfully after the latest changes.
