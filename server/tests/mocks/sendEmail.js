// tests/mocks/sendEmail.js
const sendEmailMock = jest.fn().mockImplementation(async (options) => {
    console.log('Mocked email sent:', {
        to: options.email,
        subject: options.subject
    });
    return { messageId: 'mock-email-id' };
});

module.exports = sendEmailMock;