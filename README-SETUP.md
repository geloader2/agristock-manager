# Local MySQL Setup Instructions

## Prerequisites
1. Install XAMPP (https://www.apachefriends.org/)
2. Install Node.js (https://nodejs.org/)

## Database Setup

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Click "Import" tab
   - Select the `mysql-schema.sql` file from the project root
   - Click "Go" to execute the SQL script

## Backend Setup

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend Server**
   ```bash
   npm start
   ```
   
   The server will run on http://localhost:3001

## Frontend Setup

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will run on http://localhost:5173

## Testing the Connection

1. Make sure XAMPP MySQL is running
2. Make sure the backend server is running (http://localhost:3001)
3. Open the frontend (http://localhost:5173)
4. Try adding a category or supplier to test the connection

## Troubleshooting

- **Connection refused**: Make sure MySQL is running in XAMPP
- **CORS errors**: Backend server must be running on port 3001
- **Database not found**: Run the mysql-schema.sql in phpMyAdmin first
- **Port conflicts**: Change the PORT in backend/server.js if 3001 is in use
