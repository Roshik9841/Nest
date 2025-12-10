# Complete Backend Architecture Explanation

## Table of Contents
1. [Overview](#overview)
2. [How NestJS Works](#how-nestjs-works)
3. [Module System](#module-system)
4. [Authentication Flow (Detailed)](#authentication-flow-detailed)
5. [Request Flow Example](#request-flow-example)
6. [Database Relationships](#database-relationships)
7. [Dependency Injection](#dependency-injection)

---

## Overview

Your backend is built with **NestJS**, which is a Node.js framework similar to Angular but for the backend. It uses:
- **TypeORM** - Database management (PostgreSQL)
- **JWT** - Token-based authentication
- **Passport** - Authentication middleware

### Main Components:
1. **Modules** - Organize code into features
2. **Controllers** - Handle HTTP requests
3. **Services** - Business logic
4. **Entities** - Database tables/models
5. **Guards** - Protect routes (authentication)

---

## How NestJS Works

### 1. Application Startup (`main.ts`)

```typescript
// main.ts - This is where your app starts
async function bootstrap() {
  // 1. Create the NestJS application from AppModule
  const app = await NestFactory.create(AppModule);
  
  // 2. Enable validation (checks if data is correct format)
  app.useGlobalPipes(new ValidationPipe());
  
  // 3. Enable CORS (allows frontend to talk to backend)
  app.enableCors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,
  });
  
  // 4. Start server on port 3000
  await app.listen(process.env.PORT ?? 3000);
}
```

**What happens:**
- NestJS reads `AppModule` and loads all modules
- Sets up database connection
- Starts listening for HTTP requests on port 3000

---

## Module System

### AppModule (`app.module.ts`) - The Root Module

```typescript
@Module({
  imports: [
    // 1. Database Connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Roshik9841@!',
      database: 'lms_db',
      autoLoadEntities: true,  // Automatically finds all entities
      synchronize: true,       // Auto-creates/updates database tables
    }),
    
    // 2. Feature Modules
    UsersModule,        // User management
    AuthModule,         // Login/Register
    CoursesModule,      // Course management
    EnrollmentsModule,  // Enrollment management
  ],
})
```

**What this does:**
- Connects to PostgreSQL database
- Loads all feature modules
- Makes everything available to the app

### Feature Modules Structure

Each feature (Users, Auth, Courses, etc.) has its own module:

```
Module Structure:
├── Module File (users.module.ts)
│   ├── Imports: What this module needs
│   ├── Controllers: HTTP endpoints
│   ├── Providers: Services (business logic)
│   └── Exports: What other modules can use
│
├── Controller (users.controller.ts)
│   └── Handles HTTP requests (GET, POST, PUT, DELETE)
│
├── Service (users.service.ts)
│   └── Contains business logic and database operations
│
└── Entity (user.entity.ts)
    └── Database table structure
```

### Example: UsersModule

```typescript
@Module({
  imports: [
    // Give this module access to User database table
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],  // HTTP endpoints
  providers: [UsersService],       // Business logic
  exports: [UsersService],          // Other modules can use this service
})
```

**Why export UsersService?**
- AuthModule needs UsersService to check passwords
- So UsersModule exports it, and AuthModule imports UsersModule

---

## Authentication Flow (Detailed)

### Step 1: User Registration

**Frontend → Backend Flow:**

```
1. User fills registration form
   ↓
2. Frontend sends POST /auth/register
   {
     name: "John",
     email: "john@example.com",
     password: "password123",
     role: "student"
   }
   ↓
3. Request hits AuthController.register()
   ↓
4. AuthController calls AuthService.register()
   ↓
5. AuthService checks if email exists
   ↓
6. AuthService calls UsersService.create()
   ↓
7. UsersService hashes password with bcrypt
   ↓
8. UsersService saves user to database
   ↓
9. AuthService creates JWT token
   ↓
10. Returns token + user info to frontend
```

**Code Flow:**

```typescript
// 1. Frontend sends request
POST http://localhost:3000/auth/register
Body: { name, email, password, role }

// 2. AuthController receives it
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  return this.authService.register(registerDto);
}

// 3. AuthService processes it
async register(registerDto: RegisterDto) {
  // Check if email exists
  const existingUser = await this.usersService.findByEmail(registerDto.email);
  if (existingUser) {
    throw new UnauthorizedException('Email already exists');
  }

  // Create user (password gets hashed in UsersService)
  const user = await this.usersService.create({
    ...registerDto,
    role: registerDto.role || 'student',
  });

  // Automatically log them in
  const { password: _, ...result } = user;
  return this.login(result);  // Returns JWT token
}
```

### Step 2: User Login

**Flow:**

```
1. User enters email/password
   ↓
2. Frontend sends POST /auth/login
   {
     email: "john@example.com",
     password: "password123"
   }
   ↓
3. AuthController.login() receives request
   ↓
4. Calls AuthService.validateUser()
   ↓
5. AuthService calls UsersService.findByEmail()
   ↓
6. Finds user in database
   ↓
7. AuthService calls UsersService.validatePassword()
   ↓
8. Compares hashed password with entered password
   ↓
9. If match, AuthService.login() creates JWT token
   ↓
10. Returns token + user info
```

**Code Flow:**

```typescript
// 1. Controller receives login request
@Post('login')
async login(@Body() authPayload: AuthPayloadDto) {
  // Validate user credentials
  const user = await this.authService.validateUser(authPayload);
  // Create and return token
  return this.authService.login(user);
}

// 2. Validate user
async validateUser({ email, password }: AuthPayloadDto) {
  // Find user by email
  const user = await this.usersService.findByEmail(email);
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Check password (compares hashed password)
  const isPasswordValid = await this.usersService.validatePassword(
    user,
    password,
  );
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Return user without password
  const { password: _, ...result } = user;
  return result;
}

// 3. Create JWT token
async login(user: any) {
  // Create payload (data to store in token)
  const payload = { 
    email: user.email, 
    sub: user.id,      // 'sub' = subject (user ID)
    role: user.role 
  };
  
  // Sign token with secret key
  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
```

### Step 3: Using JWT Token (Protected Routes)

**How JWT Authentication Works:**

```
1. User makes request with token
   Header: Authorization: Bearer eyJhbGc...
   ↓
2. Request hits protected route (e.g., POST /courses)
   ↓
3. JwtAuthGuard intercepts request
   ↓
4. JwtAuthGuard uses JwtStrategy
   ↓
5. JwtStrategy extracts token from header
   ↓
6. JwtStrategy verifies token (checks secret key)
   ↓
7. JwtStrategy extracts payload (user id, email, role)
   ↓
8. JwtStrategy.validate() fetches user from database
   ↓
9. Returns user object
   ↓
10. User object attached to req.user
   ↓
11. Controller can access req.user
```

**Code Flow:**

```typescript
// 1. Guard protects the route
@Post()
@UseGuards(JwtAuthGuard)  // This runs BEFORE the controller method
create(@Request() req: any, @Body() body: any) {
  // req.user is available here because of JwtAuthGuard
  if (req.user.role !== 'admin') {
    throw new ForbiddenException('Only admins can create courses');
  }
  // ... rest of code
}

// 2. JwtAuthGuard uses JwtStrategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// This tells Passport to use 'jwt' strategy

// 3. JwtStrategy validates token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Get token from header
      ignoreExpiration: false,
      secretOrKey: 'abc123',  // Must match the secret used to sign token
    });
  }

  async validate(payload: any) {
    // payload contains: { email, sub (user id), role }
    // Fetch full user from database
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // This object becomes req.user in controllers
    return { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name 
    };
  }
}
```

---

## Request Flow Example

### Example: Creating a Course (Admin Only)

**Complete Flow:**

```
1. Frontend (React)
   User clicks "Create Course" button
   ↓
   api.post('/courses', { title: "Math 101", description: "..." })
   ↓
   axios adds: Authorization: Bearer eyJhbGc...
   ↓

2. HTTP Request
   POST http://localhost:3000/courses
   Headers: {
     Authorization: Bearer eyJhbGc...,
     Content-Type: application/json
   }
   Body: { title: "Math 101", description: "..." }
   ↓

3. NestJS Receives Request
   Routes to CoursesController
   ↓

4. JwtAuthGuard Runs (BEFORE controller)
   Extracts token from header
   Verifies token
   Calls JwtStrategy.validate()
   Fetches user from database
   Attaches user to req.user
   ↓

5. CoursesController.create() Runs
   @Post()
   @UseGuards(JwtAuthGuard)
   create(@Request() req: any, @Body() body: any) {
     // Check if admin
     if (req.user.role !== 'admin') {
       throw new ForbiddenException('Only admins can create courses');
     }
     
     // Create instructor object
     const instructor = { id: req.user.id } as User;
     
     // Call service
     return this.coursesService.create(body, instructor);
   }
   ↓

6. CoursesService.create() Runs
   create(course: Partial<Course>, instructor: User) {
     // Create course object
     const newCourse = this.coursesRepo.create({
       ...course,
       instructor,
     });
     
     // Save to database
     return this.coursesRepo.save(newCourse);
   }
   ↓

7. TypeORM Saves to Database
   INSERT INTO course (title, description, instructorId) 
   VALUES ('Math 101', '...', 1)
   ↓

8. Response Sent Back
   {
     id: 1,
     title: "Math 101",
     description: "...",
     instructor: { id: 1, name: "Admin" }
   }
   ↓

9. Frontend Receives Response
   Shows success message
   Updates UI
```

---

## Database Relationships

### Entity Relationships

```
User (Table)
├── id (Primary Key)
├── name
├── email
├── password
├── role
│
├── courses (One-to-Many)
│   └── A user can create many courses (if admin)
│
└── enrollments (One-to-Many)
    └── A user can enroll in many courses

Course (Table)
├── id (Primary Key)
├── title
├── description
├── videoUrl (optional)
├── thumbnailUrl (optional)
│
├── instructor (Many-to-One)
│   └── Many courses can have one instructor (admin)
│
└── enrollments (One-to-Many)
    └── A course can have many enrollments

Enrollment (Table)
├── id (Primary Key)
│
├── student (Many-to-One)
│   └── Many enrollments can belong to one student
│
└── course (Many-to-One)
    └── Many enrollments can belong to one course
```

### TypeORM Relationship Decorators

```typescript
// User Entity
@OneToMany(() => Course, (course) => course.instructor)
courses: Course[];  // A user has many courses

@OneToMany(() => Enrollment, (enrollment) => enrollment.student)
enrollments: Enrollment[];  // A user has many enrollments

// Course Entity
@ManyToOne(() => User, (user) => user.courses)
instructor: User;  // A course has one instructor

@OneToMany(() => Enrollment, (enrollment) => enrollment.course)
enrollments: Enrollment[];  // A course has many enrollments

@Column({ nullable: true })
videoUrl?: string;  // Optional video URL for course content

@Column({ nullable: true })
thumbnailUrl?: string;  // Optional thumbnail for the video

// Enrollment Entity
@ManyToOne(() => User, (user) => user.enrollments)
student: User;  // An enrollment has one student

@ManyToOne(() => Course, (course) => course.enrollments)
course: Course;  // An enrollment has one course
```

**What this means:**
- `@OneToMany` - One user has many courses
- `@ManyToOne` - Many courses belong to one user
- TypeORM automatically creates foreign keys in database

---

## Dependency Injection

### How Services Get Injected

```typescript
// Controller needs Service
@Controller('courses')
export class CoursesController {
  // NestJS automatically creates and injects CoursesService
  constructor(private coursesService: CoursesService) {}
  // This is called "Dependency Injection"
}

// Service needs Repository
@Injectable()
export class CoursesService {
  // NestJS automatically creates and injects Repository
  constructor(
    @InjectRepository(Course)
    private coursesRepo: Repository<Course>,
  ) {}
}
```

**How it works:**
1. NestJS sees `constructor(private coursesService: CoursesService)`
2. Checks if CoursesService is in the module's providers
3. Creates an instance (or reuses existing one)
4. Injects it into the controller

**Why this is useful:**
- You don't need to manually create services
- NestJS manages all instances
- Easy to test (can inject mock services)

---

## Complete Module Connection Example

### How AuthModule Uses UsersModule

```typescript
// AuthModule
@Module({
  imports: [
    UsersModule,  // Import UsersModule to use UsersService
    JwtModule,
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

// AuthService can now use UsersService
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,  // Injected from UsersModule
  ) {}
  
  async validateUser({ email, password }) {
    // Uses UsersService to find user
    const user = await this.usersService.findByEmail(email);
    // ...
  }
}
```

**Connection Chain:**
```
AppModule
  └── imports AuthModule
      └── imports UsersModule
          └── exports UsersService
              └── AuthService can use UsersService
```

---

## Summary

### Key Concepts:

1. **Modules** - Organize features, import/export services
2. **Controllers** - Handle HTTP requests, call services
3. **Services** - Business logic, database operations
4. **Entities** - Database table structure
5. **Guards** - Protect routes, run before controllers
6. **JWT** - Token-based authentication
7. **Dependency Injection** - NestJS automatically provides services

### Request Journey:

```
HTTP Request
  ↓
Controller (receives request)
  ↓
Guard (if protected - checks authentication)
  ↓
Service (business logic)
  ↓
Repository (database operations)
  ↓
Database (PostgreSQL)
  ↓
Response (back to frontend)
```

### Authentication Journey:

```
Login Request
  ↓
AuthController
  ↓
AuthService.validateUser()
  ↓
UsersService.findByEmail() + validatePassword()
  ↓
AuthService.login() - creates JWT token
  ↓
Return token to frontend
  ↓
Frontend stores token
  ↓
Future requests include token
  ↓
JwtAuthGuard validates token
  ↓
JwtStrategy extracts user info
  ↓
req.user available in controllers
```

This is how everything connects! Each part has a specific job, and NestJS ties them all together.

---

## Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  - Sends HTTP requests with JWT token in header         │
│  - Stores token in localStorage                         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP Request
                       │ Authorization: Bearer <token>
                       ↓
┌─────────────────────────────────────────────────────────┐
│                    NESTJS BACKEND                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              main.ts (Entry Point)               │   │
│  │  - Creates app from AppModule                   │   │
│  │  - Enables CORS, Validation                      │   │
│  │  - Listens on port 3000                         │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │              AppModule (Root)                     │   │
│  │  - Connects to PostgreSQL                        │   │
│  │  - Imports: UsersModule, AuthModule, etc.        │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │            Feature Modules                       │   │
│  │                                                   │   │
│  │  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │ AuthModule   │  │ UsersModule  │            │   │
│  │  │ - Controller │  │ - Controller │            │   │
│  │  │ - Service    │  │ - Service    │            │   │
│  │  │ - Strategy   │  │ - Entity     │            │   │
│  │  └──────────────┘  └──────────────┘            │   │
│  │                                                   │   │
│  │  ┌──────────────┐  ┌──────────────┐            │   │
│  │  │CoursesModule │  │EnrollmentsMod │            │   │
│  │  │ - Controller │  │ - Controller  │            │   │
│  │  │ - Service    │  │ - Service     │            │   │
│  │  │ - Entity     │  │ - Entity      │            │   │
│  │  └──────────────┘  └──────────────┘            │   │
│  └───────────────────────────────────────────────────┘   │
│                     │                                     │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │            TypeORM (Database Layer)              │   │
│  │  - Converts entities to SQL queries             │   │
│  │  - Manages relationships                         │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                     │
└─────────────────────┼─────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL DATABASE                         │
│  - users table                                           │
│  - courses table                                         │
│  - enrollments table                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
┌─────────────┐
│   USER      │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. Enters email/password
       ↓
┌─────────────────────────────────────┐
│  POST /auth/login                    │
│  { email, password }                 │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  AuthController.login()             │
│  - Receives request                 │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  AuthService.validateUser()        │
│  - Finds user by email              │
│  - Checks password                  │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  UsersService.findByEmail()         │
│  - Queries database                 │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  UsersService.validatePassword()    │
│  - Compares with bcrypt             │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  AuthService.login()                │
│  - Creates JWT token                │
│  - Returns token + user info        │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  Frontend receives token             │
│  - Saves to localStorage            │
│  - Redirects to dashboard           │
└─────────────────────────────────────┘

═══════════════════════════════════════════

┌─────────────┐
│   USER      │
│  (Frontend) │
└──────┬──────┘
       │
       │ 2. Makes protected request
       │    Header: Authorization: Bearer <token>
       ↓
┌─────────────────────────────────────┐
│  POST /courses                      │
│  (Protected Route)                  │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  JwtAuthGuard                       │
│  - Intercepts request                │
│  - Extracts token from header        │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  JwtStrategy.validate()             │
│  - Verifies token signature          │
│  - Extracts payload (user id, role)  │
│  - Fetches user from database        │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  Attaches user to req.user           │
│  { id, email, role, name }          │
└──────┬───────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  CoursesController.create()         │
│  - Can access req.user              │
│  - Checks if admin                  │
│  - Creates course                   │
└─────────────────────────────────────┘
```

---

## Practical Examples

### Example 1: User Enrolls in Course

**Step-by-step:**

```typescript
// 1. Frontend sends request
POST /enrollments/course/5
Headers: { Authorization: Bearer eyJhbGc... }

// 2. EnrollmentsController receives it
@Post('course/:courseId')
async enroll(@Request() req: any, @Param('courseId') courseId: number) {
  // req.user.id comes from JwtAuthGuard
  return this.enrollmentsService.enroll(req.user.id, courseId);
}

// 3. EnrollmentsService processes it
async enroll(studentId: number, courseId: number) {
  // Check if already enrolled
  const existing = await this.enrollmentsRepo.findOne({
    where: { student: { id: studentId }, course: { id: courseId } },
  });
  
  if (existing) {
    throw new ConflictException('Already enrolled');
  }
  
  // Verify course exists
  const course = await this.coursesRepo.findOne({ where: { id: courseId } });
  if (!course) {
    throw new NotFoundException('Course not found');
  }
  
  // Create enrollment
  const enrollment = this.enrollmentsRepo.create({
    student: { id: studentId } as User,
    course: { id: courseId } as Course,
  });
  
  // Save to database
  return this.enrollmentsRepo.save(enrollment);
}

// 4. Database gets new row
INSERT INTO enrollment (studentId, courseId) VALUES (1, 5);
```

### Example 2: Password Hashing

**Why we hash passwords:**

```typescript
// ❌ BAD: Store password as plain text
password: "mypassword123"  // Anyone who sees database knows password

// ✅ GOOD: Hash password
password: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."  // Can't reverse it

// How it works:
async create(user: { password: string }) {
  // Hash password with bcrypt (10 rounds of encryption)
  const hashedPassword = await bcrypt.hash(user.password, 10);
  // "mypassword123" → "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
  
  const newUser = this.usersRepo.create({
    ...user,
    password: hashedPassword,  // Store hashed version
  });
  
  return this.usersRepo.save(newUser);
}

// When user logs in:
async validatePassword(user: User, password: string) {
  // Compare entered password with hashed password
  return bcrypt.compare(password, user.password);
  // "mypassword123" + "$2a$10$..." → true/false
}
```

**Why this is secure:**
- Even if database is hacked, passwords can't be read
- bcrypt.compare() can verify password without storing it
- Each password gets unique hash (even same password = different hash)

### Example 3: Module Dependencies

**How AuthModule uses UsersModule:**

```typescript
// UsersModule exports UsersService
@Module({
  providers: [UsersService],
  exports: [UsersService],  // ← Makes it available to other modules
})
export class UsersModule {}

// AuthModule imports UsersModule
@Module({
  imports: [UsersModule],  // ← Gets access to UsersService
  providers: [AuthService],
})
export class AuthModule {}

// Now AuthService can use UsersService
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,  // ← Injected automatically
  ) {}
  
  async validateUser({ email, password }) {
    // Can use UsersService because AuthModule imported UsersModule
    const user = await this.usersService.findByEmail(email);
  }
}
```

---

## Common Questions

### Q: Why do we need modules?
**A:** Modules organize code and control what can be shared between features. Without modules, everything would be in one big file.

### Q: Why use JWT tokens instead of sessions?
**A:** 
- JWT tokens are stateless (server doesn't need to store them)
- Can be used across multiple servers
- Contains user info (no need to query database every time)
- Expires automatically

### Q: What happens if token expires?
**A:** JwtStrategy will reject it, and user needs to login again. Frontend should redirect to login page.

### Q: Why use TypeORM?
**A:** 
- Converts TypeScript classes to SQL automatically
- Handles relationships (joins) automatically
- Type-safe (catches errors at compile time)
- Works with multiple databases (PostgreSQL, MySQL, etc.)

### Q: What is Dependency Injection?
**A:** Instead of creating objects yourself, NestJS creates them and gives them to you. This makes code easier to test and maintain.

---

## Key Takeaways

1. **Modules** organize features and control sharing
2. **Controllers** handle HTTP requests
3. **Services** contain business logic
4. **Entities** define database structure
5. **Guards** protect routes (run before controllers)
6. **JWT** provides stateless authentication
7. **Dependency Injection** automatically provides services
8. **TypeORM** manages database operations
9. **Testing** uses Jest with lightweight mocks for repositories/services

Everything flows: **Request → Controller → Guard → Service → Database → Response**

---

## Testing Notes (Jest)

- Each spec creates a testing module with the class under test plus mocked dependencies.
- Repositories are mocked with `getRepositoryToken(Entity)` and simple jest fns (`find`, `findOne`, `create`, `save`, `update`, `delete`).
- Services/controllers are provided with `useValue` mocks to satisfy DI.
- These mocks allow “should be defined” tests to run without real DB or circular dependencies.

