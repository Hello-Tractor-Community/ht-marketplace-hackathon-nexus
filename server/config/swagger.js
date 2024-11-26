const swaggerJsdoc = require('swagger-jsdoc');

const fs = require('fs');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello tractor Marketplace API',
      version: '1.0.0',
      description: 'API documentation for the Tractor Marketplace application'
    },
    servers: process.env.NODE_ENV === 'production' 
    ? [
        { 
          url: `${process.env.SERVER_URL_PROD}/api/v1`, 
          description: 'Production API' 
        },
        { 
          url: `https://${process.env.GITHUB_USERNAME}.github.io/${process.env.REPO_NAME}/api/v1`, 
          description: 'GitHub Pages API' 
        }
      ]
    : [
        { 
          url: `${process.env.SERVER_URL_DEV}/api/v1`, 
          description: 'Local Development' 
        }
      ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            firstName: { type: 'string', required: true },
            lastName: { type: 'string', required: true },
            email: { type: 'string', required: true },
            platformRoles: { 
              type: 'array', 
              items: { 
                type: 'string', 
                enum: ['buyer', 'seller', 'admin'] 
              }
            },
            accountStatus: { 
              type: 'string', 
              enum: ['pending', 'active', 'suspended', 'deactivated'] 
            }
          }
        },
        Listing: {
          type: 'object',
          properties: {
            name: { type: 'string', required: true },
            sku: { type: 'string', required: true },
            category: { 
              type: 'string', 
              enum: ['tractor', 'spare parts'],
              required: true 
            },
            description: { type: 'string' },
            make: { type: 'string', required: true },
            model: { type: 'string', required: true },
            price: {
              type: 'object',
              properties: {
                amount: { type: 'number', required: true },
                currency: { type: 'string', default: 'USD' }
              }
            },
            status: { 
              type: 'string', 
              enum: ['draft', 'active', 'inactive', 'archived'],
              default: 'draft'
            }
          }
        },
        LoginCredentials: {
          type: 'object',
          properties: {
            email: { type: 'string', required: true },
            password: { type: 'string', required: true }
          }
        },
        Conversation: {
            type: 'object',
            properties: {
              participants: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'User IDs participating in the conversation'
                }
              },
              listing: {
                type: 'string',
                description: 'Listing ID associated with the conversation'
              },
              buyer: {
                type: 'string',
                description: 'Buyer User ID'
              },
              seller: {
                type: 'string',
                description: 'Seller User ID'
              },
              type: {
                type: 'string',
                enum: ['listing_inquiry', 'purchase_discussion', 'admin_welcome', 'admin_support'],
                default: 'listing_inquiry'
              },
              status: {
                type: 'string',
                enum: ['active', 'resolved', 'closed'],
                default: 'active'
              },
              lastMessage: {
                type: 'string',
                description: 'ID of the last message in the conversation'
              }
            }
          },
          Message: {
            type: 'object',
            properties: {
              conversation: {
                type: 'string',
                description: 'Conversation ID',
                required: true
              },
              sender: {
                type: 'string',
                description: 'Sender User ID',
                required: true
              },
              recipient: {
                type: 'string',
                description: 'Recipient User ID',
                required: true
              },
              content: {
                type: 'string',
                description: 'Message content',
                required: true
              },
              readBy: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'User IDs who have read the message'
                }
              },
              attachments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    url: { type: 'string' },
                    fileType: {
                      type: 'string',
                      enum: ['image', 'document', 'video']
                    }
                  }
                }
              },
              status: {
                type: 'string',
                enum: ['sent', 'delivered', 'read'],
                default: 'sent'
              }
            }
          }
      }
    }
  },
  apis: ['./routes/*.js']
};

// Auth Routes Documentation
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * 
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 * 
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 * 
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 * 
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */

// Listing Routes Documentation
/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 * 
 *   post:
 *     summary: Create a new listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
 *     responses:
 *       201:
 *         description: Listing created successfully
 * 
 * /listings/search:
 *   get:
 *     summary: Search listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 * 
 * /listings/{id}:
 *   get:
 *     summary: Get listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 * 
 *   put:
 *     summary: Update a listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listing'
 *     responses:
 *       200:
 *         description: Listing updated successfully
 * 
 *   delete:
 *     summary: Delete a listing
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 * 
 * /listings/{id}/status:
 *   patch:
 *     summary: Update listing status
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { 
 *                 type: string, 
 *                 enum: ['draft', 'active', 'inactive', 'archived'] 
 *               }
 *     responses:
 *       200:
 *         description: Listing status updated successfully
 * 
 * /listings/{id}/inventory:
 *   patch:
 *     summary: Update listing inventory
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: number }
 *     responses:
 *       200:
 *         description: Listing inventory updated successfully
 */

// User Routes Documentation
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * 
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 * 
 * /users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * 
 * /users/role/search:
 *   get:
 *     summary: Get users by role
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ['buyer', 'seller', 'admin']
 *     responses:
 *       200:
 *         description: Users with specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * 
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * 
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 * 
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 * 
 * /users/{id}/status:
 *   patch:
 *     summary: Update user status (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { 
 *                 type: string, 
 *                 enum: ['pending', 'active', 'suspended', 'deactivated'] 
 *               }
 *     responses:
 *       200:
 *         description: User status updated successfully
 *
// Message Routes Documentation
/**
 * @swagger
 * /messages/listing/{listingId}/conversation:
 *   post:
 *     summary: Create a new conversation for a specific listing
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 * 
 * /messages/conversation/{conversationId}/send:
 *   post:
 *     summary: Send a message in a specific conversation
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string, required: true }
 *               attachments: { 
 *                 type: array, 
 *                 items: { 
 *                   type: object,
 *                   properties: {
 *                     url: { type: string },
 *                     fileType: { 
 *                       type: string, 
 *                       enum: ['image', 'document', 'video'] 
 *                     }
 *                   }
 *                 }
 *               }
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 * 
 * /messages/conversation/{conversationId}/messages:
 *   get:
 *     summary: Get messages for a specific conversation
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of messages in the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages: {
 *                   type: array,
 *                   items: { $ref: '#/components/schemas/Message' }
 *                 }
 *                 pagination: {
 *                   type: object,
 *                   properties: {
 *                     currentPage: { type: integer },
 *                     totalPages: { type: integer },
 *                     totalMessages: { type: integer }
 *                   }
 *                 }
 * 
 * /messages/buyer/conversations:
 *   get:
 *     summary: Get all conversations for a buyer
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of buyer's conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations: {
 *                   type: array,
 *                   items: { $ref: '#/components/schemas/Conversation' }
 *                 }
 *                 pagination: {
 *                   type: object,
 *                   properties: {
 *                     currentPage: { type: integer },
 *                     totalPages: { type: integer },
 *                     totalConversations: { type: integer }
 *                   }
 *                 }
 * 
 * /messages/seller/conversations:
 *   get:
 *     summary: Get all conversations for a seller
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of seller's conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations: {
 *                   type: array,
 *                   items: { $ref: '#/components/schemas/Conversation' }
 *                 }
 *                 pagination: {
 *                   type: object,
 *                   properties: {
 *                     currentPage: { type: integer },
 *                     totalPages: { type: integer },
 *                     totalConversations: { type: integer }
 *                   }
 *                 }
 */

const swaggerSpec = swaggerJsdoc(options);

try { 
  fs.writeFileSync('./docs/swagger/swagger.json', JSON.stringify(swaggerSpec, null, 2)); 
  console.log('Swagger JSON successfully generated'); 
} catch (error) { 
  console.error('Error generating Swagger JSON:', error); 
}

module.exports = swaggerSpec;