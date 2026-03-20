# Test Login Credentials

## Overview

The database migration includes test users for all roles with pre-configured credentials.

## Default Password

**All test users use the same password:**
```
Password123!
```

⚠️ **IMPORTANT**: Change all passwords immediately after first login in production!

## Test Accounts

### 1. Super Admin
```
Username: superadmin
Email: superadmin@studentherald.com
Password: Password123!
Role: Super Admin
Permissions: ALL (Full system access)
```

**Capabilities:**
- Full system access
- Manage all users and admins
- System configuration
- All CRUD operations
- Access to all modules

---

### 2. Admin
```
Username: admin
Email: admin@studentherald.com
Password: Password123!
Role: Admin
Permissions: ALL (Full system access)
```

**Capabilities:**
- Full system access
- Manage users (except super admins)
- All CRUD operations
- Access to all modules
- System settings

---

### 3. Content Manager
```
Username: manager
Email: manager@studentherald.com
Password: Password123!
Role: Content Manager
Permissions: Content management
```

**Capabilities:**
- Create articles
- Edit any article
- Delete articles
- Publish articles
- Manage categories
- Approve content
- Manage tags

---

### 4. Editor
```
Username: editor
Email: editor@studentherald.com
Password: Password123!
Role: Editor
Permissions: Editorial
```

**Capabilities:**
- Create articles
- Edit own articles
- View all articles
- Approve articles
- Review content
- Cannot delete or publish

---

### 5. Content Writer
```
Username: writer
Email: writer@studentherald.com
Password: Password123!
Role: Content Writer
Permissions: Writing
```

**Capabilities:**
- Create articles
- Edit own articles
- View articles
- Submit for review
- Cannot publish or delete

---

### 6. Viewer
```
Username: viewer
Email: viewer@studentherald.com
Password: Password123!
Role: Viewer
Permissions: Read-only
```

**Capabilities:**
- View articles
- View categories
- View courses
- View universities
- No editing capabilities

---

### Additional Test Users

#### Content Writer 2
```
Username: writer2
Email: writer2@studentherald.com
Password: Password123!
Role: Content Writer
```

#### Editor 2
```
Username: editor2
Email: editor2@studentherald.com
Password: Password123!
Role: Editor
```

## Role Permissions Matrix

| Permission | Super Admin | Admin | Manager | Editor | Writer | Viewer |
|------------|-------------|-------|---------|--------|--------|--------|
| View Content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Article | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Own Article | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Any Article | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Article | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Publish Article | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Article | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Categories | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Admins | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

## Testing Scenarios

### Scenario 1: Content Creation Workflow
1. Login as **writer** (writer@studentherald.com)
2. Create a new article
3. Submit for review
4. Logout

5. Login as **editor** (editor@studentherald.com)
6. Review and approve the article
7. Logout

8. Login as **manager** (manager@studentherald.com)
9. Publish the article
10. Verify it's live

### Scenario 2: User Management
1. Login as **admin** (admin@studentherald.com)
2. Create a new user
3. Assign role
4. Test new user login

### Scenario 3: Permission Testing
1. Login as **viewer** (viewer@studentherald.com)
2. Try to create article (should fail)
3. Try to edit article (should fail)
4. Verify read-only access

### Scenario 4: Multi-Author Article
1. Login as **writer** (writer@studentherald.com)
2. Create article
3. Add **writer2** as co-author
4. Both can edit the article

## API Testing

### Login Endpoint
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@studentherald.com",
  "password": "Password123!"
}
```

### Expected Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "admin@studentherald.com",
    "firstName": "John",
    "lastName": "Admin",
    "role": "Admin"
  }
}
```

### Test All Roles
```bash
# Super Admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@studentherald.com","password":"Password123!"}'

# Admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@studentherald.com","password":"Password123!"}'

# Content Manager
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@studentherald.com","password":"Password123!"}'

# Editor
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@studentherald.com","password":"Password123!"}'

# Writer
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"writer@studentherald.com","password":"Password123!"}'

# Viewer
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@studentherald.com","password":"Password123!"}'
```

## Dummy Data Included

The migration also includes:

### Content
- ✅ 5 Sample Articles (with full content)
- ✅ 8 Categories
- ✅ 15 Tags
- ✅ 5 Comments
- ✅ Article-Tag relationships
- ✅ Article-Author relationships

### Universities & Courses
- ✅ 5 Universities (Harvard, Stanford, MIT, Oxford, Cambridge)
- ✅ 5 Courses (various subjects and levels)

### Frontend Content
- ✅ 3 Hero Content items
- ✅ 3 Carousel items
- ✅ 10 Navigation menu items

### Advertisements
- ✅ 3 Sample advertisements

### Other
- ✅ 3 Contact form submissions
- ✅ 8 Countries
- ✅ 6 System configuration options

## Security Notes

### For Development
✅ Use these credentials freely  
✅ Test all role permissions  
✅ Experiment with features  

### For Production
⚠️ **CRITICAL SECURITY STEPS:**

1. **Change All Passwords**
   ```sql
   -- Update passwords for all test users
   UPDATE back_office_users 
   SET password_hash = 'new_bcrypt_hash' 
   WHERE username IN ('superadmin', 'admin', 'manager', 'editor', 'writer', 'viewer');
   ```

2. **Delete Test Accounts**
   ```sql
   -- Delete all test accounts
   DELETE FROM back_office_users WHERE username LIKE '%test%';
   DELETE FROM operator WHERE email LIKE '%@studentherald.com';
   ```

3. **Disable Unused Accounts**
   ```sql
   -- Disable instead of delete
   UPDATE back_office_users 
   SET is_locked = TRUE 
   WHERE username IN ('viewer', 'writer2', 'editor2');
   ```

4. **Create Real Admin**
   - Use the application's user creation feature
   - Set strong password
   - Enable 2FA for admin accounts

5. **Review Permissions**
   - Audit all role permissions
   - Remove unnecessary permissions
   - Follow principle of least privilege

## Password Requirements

For production, enforce:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No common passwords
- Password expiry (90 days)
- Password history (last 5)

## Two-Factor Authentication

Super Admin and Admin roles have 2FA enabled by default. To test:

1. Login with credentials
2. System sends OTP to email/phone
3. Enter OTP to complete login
4. Session established

## Troubleshooting

### Cannot Login
1. Verify database migration completed
2. Check user exists: `SELECT * FROM operator WHERE email = 'admin@studentherald.com';`
3. Check credentials table: `SELECT * FROM back_office_users WHERE username = 'admin';`
4. Verify role mapping: `SELECT * FROM entity_operator_role_mapping WHERE operator_id = 2;`

### Permission Denied
1. Check user's role: `SELECT rt.* FROM role_type rt JOIN entity_operator_role_mapping eorm ON rt.id = eorm.role_type_id WHERE eorm.operator_id = ?;`
2. Verify role permissions: `SELECT * FROM role_permissions WHERE role_type_id = ?;`
3. Check if role is enabled: `SELECT is_enable FROM role_type WHERE id = ?;`

### Password Not Working
1. Ensure you're using: `Password123!`
2. Check for copy-paste errors (no extra spaces)
3. Verify password hash in database
4. Try resetting password through application

## Quick Reference

| Need to... | Use Account |
|------------|-------------|
| Test full system | superadmin or admin |
| Test content workflow | manager, editor, writer |
| Test read-only access | viewer |
| Test multi-author | writer + writer2 |
| Test approval workflow | writer → editor → manager |

## Support

If you encounter issues:
1. Check this document
2. Verify migration completed successfully
3. Check application logs
4. Review database for user records
5. Test API endpoints directly

---

**Remember**: These are TEST credentials. Never use in production without changing passwords!
