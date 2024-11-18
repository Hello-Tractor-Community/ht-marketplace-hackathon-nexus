const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Institute = require('../models/Institute');
const Program = require('../models/Program');

// Mock the geocoder
jest.mock('node-geocoder', () => require('./mocks/geocoder'));

describe('Program API', () => {
  let token;
  let instituteId;

  const createTestInstitute = async () => {
    const institute = await Institute.create({
      name: "Test Institute",
      type: "TVET",
      description: "Test Description",
      established: new Date('2020-01-01'),
      accreditation: "Ministry of Education",
      location: {
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        country: "Ethiopia",
        coordinates: {
          type: "Point",
          coordinates: [38.7578, 9.0252]
        }
      }
    });
    return institute;
  };

  const createTestUser = async (instituteId) => {
    const userData = {
      firstName: "Test",
      lastName: "Admin",
      email: `test${Date.now()}@example.com`, // Ensure unique email
      password: "password123",
      phone: "+251911234567",
      role: "institute_admin",
      position: "Administrator",
      institute: instituteId
    };

    const user = await User.create(userData);
    // Fetch the complete user with password
    return await User.findById(user._id).select('+password');
  };

  beforeEach(async () => {
    try {
      // Create test institute
      const institute = await createTestInstitute();
      instituteId = institute._id;

      // Create test user and generate token
      const user = await createTestUser(instituteId);
      token = user.generateToken();

      console.log('Test setup completed:', {
        instituteId: instituteId.toString(),
        token: token.substring(0, 20) + '...' // Log partial token for debugging
      });
    } catch (error) {
      console.error('Test setup error:', error);
      throw error;
    }
  });

  describe('POST /api/v1/programs', () => {
    it('should create a new program when valid data is provided', async () => {
      const programData = {
        name: "Test Program",
        description: "Test Description",
        duration: {
          value: 6,
          unit: "months"
        },
        cost: {
          amount: 500,
          currency: "ETB"
        },
        schedule: "Morning",
        startDate: new Date().toISOString().split('T')[0],
        capacity: 20,
        institute: instituteId,
        categories: [],
        prerequisites: ["Basic English"],
        instructors: [{
          name: "Test Instructor",
          qualification: "PhD",
          experience: "5 years"
        }]
      };

      const res = await request(app)
        .post('/api/v1/programs')
        .set('Authorization', `Bearer ${token}`)
        .send(programData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(programData.name);
    });

    it('should return 400 when required fields are missing', async () => {
      const invalidData = {
        name: "Test Program"
      };

      const res = await request(app)
        .post('/api/v1/programs')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/programs', () => {
    beforeEach(async () => {
      // Create a test program for get requests
      const programData = {
        name: "Existing Test Program",
        description: "Test Description",
        duration: {
          value: 6,
          unit: "months"
        },
        cost: {
          amount: 500,
          currency: "ETB"
        },
        schedule: "Morning",
        startDate: new Date().toISOString().split('T')[0],
        capacity: 20,
        institute: instituteId,
        categories: []
      };

      await Program.create(programData);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/programs');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Not authorized, no token');
    });

    it('should return programs when valid token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/programs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
  
  // Add error cases
  describe('Error Handling', () => {
    it('should handle invalid token format', async () => {
      const res = await request(app)
        .get('/api/v1/programs')
        .set('Authorization', 'InvalidTokenFormat');

      expect(res.status).toBe(401);
    });

    it('should handle invalid program ID format', async () => {
      const res = await request(app)
        .get('/api/v1/programs/invalid-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });
});