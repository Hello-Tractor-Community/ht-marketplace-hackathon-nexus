// tests/institute.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Institute = require('../models/Institute');
const { connect, closeDatabase, clearDatabase } = require('./setup');

// Create a valid JWT token for testing
const createToken = (userId = '507f1f77bcf86cd799439011') => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '1h'
    });
};

// Mock User model more explicitly
jest.mock('../models/User', () => ({
    findById: jest.fn().mockImplementation((id) => ({
        _id: id,
        role: 'institute_admin',
        select: jest.fn().mockReturnThis()
    }))
}));

// Mock geocoder
jest.mock('../utils/geocoder', () => ({
    geocode: jest.fn().mockResolvedValue([{
        latitude: 9.0252,
        longitude: 38.7578,
        formattedAddress: 'Bole, Addis Ababa',
        city: 'Addis Ababa',
        stateCode: 'AA',
        zipcode: '1000',
        countryCode: 'ET'
    }])
}));

describe('Institute API', () => {
    let token;
    
    beforeAll(async () => {
        await connect();
        token = createToken();
    });
    
    afterEach(async () => {
        await clearDatabase();
        jest.clearAllMocks();
    });
    
    afterAll(async () => {
        await closeDatabase();
    });

    const instituteData = {
        name: "Hewan Hair Salon Training",
        type: "TVET",
        accreditation: "Ministry of Education",
        description: "Premier hair styling training institute",
        established: new Date('2020-01-01'),
        location: {
            address: "Bole, Addis Ababa",
            city: "Addis Ababa"
        }
    };

    describe('POST /api/v1/institutes', () => {
        it('should create a new institute', async () => {
            const response = await request(app)
                .post('/api/v1/institutes')
                .set('Authorization', `Bearer ${token}`)
                .send(instituteData);

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('_id');
            expect(response.body.data.name).toBe(instituteData.name);
        });

        it('should not create institute with duplicate name', async () => {
            // First create an institute
            await Institute.create({
                ...instituteData,
                location: {
                    ...instituteData.location,
                    coordinates: {
                        type: "Point",
                        coordinates: [38.7578, 9.0252]
                    }
                }
            });
            
            const response = await request(app)
                .post('/api/v1/institutes')
                .set('Authorization', `Bearer ${token}`)
                .send(instituteData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/v1/institutes', () => {
        it('should get all institutes', async () => {
            await Institute.create({
                ...instituteData,
                location: {
                    ...instituteData.location,
                    coordinates: {
                        type: "Point",
                        coordinates: [38.7578, 9.0252]
                    }
                }
            });

            const response = await request(app)
                .get('/api/v1/institutes')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(1);
        });

        it('should support pagination', async () => {
            await Institute.create({
                ...instituteData,
                location: {
                    ...instituteData.location,
                    coordinates: {
                        type: "Point",
                        coordinates: [38.7578, 9.0252]
                    }
                }
            });
            
            await Institute.create({
                ...instituteData,
                name: 'Second Institute',
                location: {
                    ...instituteData.location,
                    coordinates: {
                        type: "Point",
                        coordinates: [38.7578, 9.0252]
                    }
                }
            });

            const response = await request(app)
                .get('/api/v1/institutes?page=1&limit=1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.pagination.total).toBe(2);
        });
    });
});