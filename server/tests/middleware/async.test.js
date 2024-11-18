// tests/middleware/async.test.js
const asyncHandler = require('../../middleware/async');

describe('Async Handler Middleware', () => {
    it('should properly wrap an async function', async () => {
        const mockReq = {};
        const mockRes = {};
        const mockNext = jest.fn();
        
        const sampleAsync = async () => 'test';
        const wrapped = asyncHandler(sampleAsync);
        
        expect(typeof wrapped).toBe('function');
        await wrapped(mockReq, mockRes, mockNext);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch errors and pass them to next', async () => {
        const mockReq = {};
        const mockRes = {};
        const mockNext = jest.fn();
        const error = new Error('Test error');
        
        const sampleAsync = async () => {
            throw error;
        };
        
        const wrapped = asyncHandler(sampleAsync);
        await wrapped(mockReq, mockRes, mockNext);
        
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});