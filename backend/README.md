# OMM Audio Visuals - Backend API

Backend API for the OMM Audio Visuals AV equipment rental website.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running locally)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/omm-audio-visuals
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

4. Make sure MongoDB is running on your system.

## Setup Initial Admin User

Before using the admin panel, you need to create an admin user. You can do this by making a POST request to the register endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

Or use Postman/Thunder Client with:
- URL: `http://localhost:5000/api/auth/register`
- Method: POST
- Body (JSON):
```json
{
  "username": "admin",
  "password": "yourpassword"
}
```

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new admin user
- `POST /api/auth/login` - Login and get JWT token

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category (requires auth)
- `PUT /api/categories/:id` - Update category (requires auth)
- `DELETE /api/categories/:id` - Delete category (requires auth)

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event (requires auth)
- `PUT /api/events/:id` - Update event (requires auth)
- `DELETE /api/events/:id` - Delete event (requires auth)

### Equipment

- `GET /api/equipment` - Get all equipment (optional query params: `category`, `featured`)
- `GET /api/equipment/:id` - Get single equipment
- `GET /api/equipment/category/:categoryId` - Get equipment by category
- `POST /api/equipment` - Create new equipment (requires auth, supports image upload)
- `PUT /api/equipment/:id` - Update equipment (requires auth, supports image upload)
- `DELETE /api/equipment/:id` - Delete equipment (requires auth)

## Admin Panel

Open `admin/index.html` in your browser to access the admin panel. Use the credentials you created during setup to login.

## Database Schema

### User
- username (String, required, unique)
- password (String, required, hashed)
- createdAt (Date)

### Category
- name (String, required, unique)
- icon (String)
- description (String)
- createdAt (Date)

### Event
- name (String, required, unique)
- icon (String)
- description (String)
- createdAt (Date)

### Equipment
- name (String, required)
- category (ObjectId, ref: Category)
- icon (String)
- image (String)
- description (String, required)
- price (String)
- specifications (String)
- featured (Boolean)
- createdAt (Date)
