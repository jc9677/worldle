/**
 * Security utilities for input validation and sanitization
 */

// Maximum lengths for input fields
export const MAX_PLAYER_NAME_LENGTH = 50;
export const MAX_URL_LENGTH = 500;

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return '';
  
  // If running in Node.js for testing, just return the string
  if (typeof document === 'undefined') {
    return str;
  }
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Validate and sanitize player name
 * @param {string} name - The player name to validate
 * @returns {string} - The sanitized name or empty string if invalid
 */
export const validatePlayerName = (name) => {
  if (typeof name !== 'string') return '';
  
  // Trim whitespace
  name = name.trim();
  
  // Check length
  if (name.length === 0 || name.length > MAX_PLAYER_NAME_LENGTH) {
    return '';
  }
  
  // Allow only alphanumeric characters, spaces, and common punctuation
  const allowedPattern = /^[a-zA-Z0-9\s\-_.,!?'"\(\)]+$/;
  if (!allowedPattern.test(name)) {
    return '';
  }
  
  // Sanitize HTML (in browser environment)
  return sanitizeHtml(name);
};

/**
 * Validate Google Forms URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid Google Forms URL
 */
export const isValidGoogleFormUrl = (url) => {
  if (typeof url !== 'string' || url.length === 0) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Check if it's a Google Forms URL
    const validHosts = [
      'docs.google.com',
      'forms.google.com'
    ];
    
    if (!validHosts.includes(urlObj.hostname)) {
      return false;
    }
    
    // Check if it's HTTPS
    if (urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Check if it looks like a valid Google Forms URL pattern
    const formUrlPattern = /^\/forms\/d\/[a-zA-Z0-9_-]+/;
    if (!formUrlPattern.test(urlObj.pathname)) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Extract form ID from Google Forms URL
 * @param {string} url - The Google Forms URL
 * @returns {string|null} - The form ID or null if invalid
 */
export const extractFormId = (url) => {
  if (!isValidGoogleFormUrl(url)) return null;
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Look for the pattern /forms/d/e/FORM_ID
    const eIndex = pathParts.findIndex(part => part === 'e');
    if (eIndex > 0 && eIndex < pathParts.length - 1) {
      return pathParts[eIndex + 1];
    }
    
    // Also check for /forms/d/FORM_ID pattern
    const dIndex = pathParts.findIndex(part => part === 'd');
    if (dIndex > 0 && dIndex < pathParts.length - 1) {
      return pathParts[dIndex + 1];
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Sanitize data for logging (remove sensitive information)
 * @param {Object} data - The data object to sanitize
 * @returns {Object} - The sanitized data object
 */
export const sanitizeForLogging = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = { ...data };
  
  // Remove or mask sensitive fields
  const sensitiveFields = ['formUrl', 'webhookUrl', 'playerName', 'url'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      if (typeof sanitized[field] === 'string') {
        // Show only first 10 characters for debugging
        sanitized[field] = sanitized[field].substring(0, 10) + '...';
      }
    }
  });
  
  return sanitized;
};