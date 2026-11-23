# (Express + MySQL + EJS)

Full-stack user management app with EJS templates and MySQL database.

## Tech Stack
- **Express** - Backend framework
- **EJS** - Server-side templating
- **MySQL** - Database
- **UUID** - Unique ID generation

## Install
```bash
npm install
mysql -u root -p delta_app < schema.sql   # Create database
cp .env.example .env                         # Configure database
node index.js                                # Start server (port 8080)
```

## Features
- User registration with validation
- Email and password checks
- Edit username (requires password)
- Delete users

## API
- `GET /` - Home page (total users)
- `POST /user` - Register user
- `GET /user` - List all users
- `GET /user/:id/edit` - Edit form
- `GET /user/:id/delete` - Delete user
- `PATCH /user/:id` - Update user

## Database Schema
```sql
CREATE TABLE user(
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);
```

## Configuration
Edit `.env` or `index.js`:
```javascript
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'your_password'
});
```

## Project Structure
```
39-BACKEND/
├── index.js           # Main application
├── schema.sql         # Database schema
├── package.json       # Dependencies
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
└── views/             # EJS templates
    ├── home.ejs
    ├── adduser.ejs
    ├── showuser.ejs
    └── edit.ejs
```

## ⚠️ Security
⚠️ Plain text passwords - use bcrypt/argon2 for production

## Author
**Dhruv**
- [GitHub Profile](https://github.com/Dhruv7015)
- [Report Issue](https://github.com/Dhruv7015/express-mysql-user-management/issues)