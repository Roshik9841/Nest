# How to Create an Admin Account

## Method 1: Through Registration (Recommended)

1. Go to the registration page: `http://localhost:5173/register`
2. Fill in the registration form:
   - Name: Your name
   - Email: Your email address
   - Password: Your password (minimum 6 characters)
   - **Role: Select "Admin" from the dropdown**
3. Click "Register"
4. You will be automatically logged in and redirected to the Admin Dashboard

## Method 2: Through API (Direct Database)

If you need to create an admin account directly via API:

```bash
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "yourpassword",
  "role": "admin"
}
```

## Method 3: Update Existing User to Admin

If you already have a user account and want to make it admin:

1. Login as any user
2. Use the API endpoint (requires authentication):
```bash
PATCH http://localhost:3000/users/{userId}
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "role": "admin"
}
```

## Accessing Admin Dashboard

Once you have an admin account:
1. Login with your admin credentials
2. You will be automatically redirected to `/admin-dashboard`
3. From there you can:
   - Manage Courses (create, edit, delete)
   - Manage Users (view all users, delete users)
   - View All Enrollments
   - Create New Courses

## Student vs Admin

- **Students** are redirected to `/student-dashboard` and can only:
  - Browse courses
  - Enroll in courses
  - View their enrolled courses

- **Admins** are redirected to `/admin-dashboard` and can:
  - Manage all courses
  - Manage all users
  - View all enrollments
  - Create/edit/delete courses





