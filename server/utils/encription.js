// utils/encryption.js
import CryptoJS from 'crypto-js';

export const encryptionUtils = {
  // Generate a unique conversation key
  generateConversationKey: () => {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  },

  // Encrypt message
  encryptMessage: (message, conversationKey) => {
    return CryptoJS.AES.encrypt(message, conversationKey).toString();
  },

  // Decrypt message
  decryptMessage: (encryptedMessage, conversationKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, conversationKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};