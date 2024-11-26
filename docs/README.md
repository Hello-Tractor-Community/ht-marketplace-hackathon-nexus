# Hello Tractor Commerce

## Project Overview
Hello Tractor Commerce is a full-stack web application for second-hand tractor sales and commerce.

## Prerequisites
- Node.js (v18 or later recommended)
- npm (v9 or later)
- Git

## Project Structure
```
project_folder/
│
├── client/          # React frontend
└── server/          # Express backend
```

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Hello-Tractor-Community/ht-marketplace-hackathon-nexus.git
cd project_folder
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

#### Configure Server Environment
1. Create a `.env` file in the `server/` directory
2. Copy contents from `.env.sample` (provided in the server directory)
3. Fill in necessary environment variables:
   - MongoDB connection string
   - JWT secret
   - Cloudinary credentials
   - Other service-specific keys

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

#### Configure Client Environment
1. Create a `.env` file in the `client/` directory
2. Copy contents from `.env.sample` (provided in the client directory)
3. Fill in any required frontend configuration variables

### 4. Run the Application

#### Development Mode
1. Start the Backend Server
```bash
cd ../server
npm run dev
```

2. Start the Frontend Development Server (in a new terminal)
```bash
cd ../client
npm start
```

#### Production Build
1. Build the Client
```bash
cd client
npm run build
```

2. Start the Production Server
```bash
cd ../server
npm start
```

## Available Scripts

### Server
- `npm run dev`: Start server with nodemon (development)
- `npm start`: Start server in production mode
- `npm test`: Run server tests

### Client
- `npm start`: Start development server
- `npm run build`: Create production build
- `npm test`: Run client-side tests

## Deployment
The project is configured for deployment on Render. The client is hosted at: https://hellotractor-commerce-nexus.onrender.com/

## Technologies Used
- Frontend: React, Redux, Material-UI
- Backend: Express, MongoDB
- Authentication: JWT
- Deployment: Render

## API End points
Project's api end points documentation can be found here: https://hellotractor-commerce-nexus.onrender.com/api-docs
## Troubleshooting
- Ensure all environment variables are correctly set
- Check that MongoDB connection is stable
- Verify Node.js and npm versions

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the ISC License.