/**
 * webext-privacy-guard - Working Examples
 * 
 * This file demonstrates all features of the PrivacyGuard library.
 * Run these examples in a Chrome extension context for full functionality.
 * 
 * Usage in extension:
 *   import { PrivacyGuard } from 'webext-privacy-guard';
 *   // or require if using CommonJS
 */

// ============================================================================
// Example 1: Strip PII from User Input
// ============================================================================
// Use case: Sanitize user-submitted content before logging or storing

const userMessage = 'Hi, my name is John Doe and my email is john.doe@example.com. ' +
                    'You can reach me at 555-123-4567. My SSN is 123-45-6789 and ' +
                    'my credit card is 4111-1111-1111-1111.';

// Strip all PII types from text
const cleanedMessage = PrivacyGuard.stripPII(userMessage);

console.log('Original:', userMessage);
console.log('Cleaned:', cleanedMessage);
// Output: "Hi, my name is John Doe and my email is [EMAIL]. You can reach me at [PHONE]. My SSN is [SSN] and my credit card is [CARD]."


// ============================================================================
// Example 2: Check if Text Contains PII
// ============================================================================
// Use case: Validate form input, warn users about sensitive data

const formInput = 'Please reset my password. My email is admin@company.com';

const piiCheck = PrivacyGuard.containsPII(formInput);

console.log('Form input:', formInput);
console.log('PII Check result:', piiCheck);
// Output: { hasEmail: true, hasPhone: false, hasSSN: false, hasCard: false }

// Conditional logic based on PII detection
if (piiCheck.hasEmail || piiCheck.hasPhone) {
    console.log('⚠️ Warning: Sensitive data detected in input');
}


// ============================================================================
// Example 3: Sanitize URLs Before Logging
// ============================================================================
// Use case: Prevent sensitive query params from appearing in analytics/logs

const analyticsUrl = 'https://api.example.com/track?user_id=12345&email=user@test.com&token=secret_key_abc';

const safeUrl = PrivacyGuard.sanitizeURL(analyticsUrl);

console.log('Original URL:', analyticsUrl);
console.log('Sanitized URL:', safeUrl);
// Output: "https://api.example.com/track?user_id=12345&email=[REDACTED]&token=[REDACTED]"


// ============================================================================
// Example 4: Anonymize User Data
// ============================================================================
// Use case: Prepare data for analytics without exposing PII

const userProfile = {
    id: 'user_12345',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '555-987-6543',
    role: 'admin',
    lastLogin: '2024-01-15T10:30:00Z'
};

// Anonymize name and email fields (keep role and lastLogin for analytics)
const anonymizedProfile = PrivacyGuard.anonymize(userProfile, ['name', 'email', 'phone']);

console.log('Original profile:', userProfile);
console.log('Anonymized profile:', anonymizedProfile);
// Output: { id: 'user_12345', name: 'anon_...', email: 'anon_...', phone: 'anon_...', role: 'admin', lastLogin: '...' }


// ============================================================================
// Example 5: GDPR Data Export
// ============================================================================
// Use case: Respond to user data access requests (GDPR Article 15)

/*
 * NOTE: This requires a Chrome extension context with chrome.storage.local available.
 * The following code shows how to use generateExport properly.
 */

// Export all stored data
// const fullExport = await PrivacyGuard.generateExport();
// console.log('Full export:', fullExport);

// Export specific data categories
// const partialExport = await PrivacyGuard.generateExport(['userPreferences', 'recentItems']);
// console.log('Partial export:', partialExport);


// ============================================================================
// Example 6: Delete All User Data (Right to Erasure)
// ============================================================================
// Use case: Handle GDPR "right to be forgotten" requests

/*
 * NOTE: This requires a Chrome extension context.
 * Use with caution - this deletes ALL data from local and sync storage.
 */

// await PrivacyGuard.deleteAllData();
// console.log('All user data has been deleted');


// ============================================================================
// Example 7: Data Retention Policy
// ============================================================================
// Use case: Automatically clean up old data to comply with retention policies

/*
 * NOTE: This requires a Chrome extension context.
 * Assumes the storage key contains an array of objects with timestamp or createdAt fields.
 */

// Example stored data structure in chrome.storage.local:
// const activityLog = [
//     { id: 1, action: 'login', timestamp: Date.now() - 90 * 86400000 },  // 90 days ago
//     { id: 2, action: 'click', timestamp: Date.now() - 15 * 86400000 },  // 15 days ago
//     { id: 3, action: 'view', timestamp: Date.now() - 5 * 86400000 },   // 5 days ago
// ];
// await chrome.storage.local.set({ activityLog });

// Apply 30-day retention policy
// const removed = await PrivacyGuard.applyRetention('activityLog', 30);
// console.log(`Removed ${removed} old entries`);


// ============================================================================
// Example 8: Complete Privacy Workflow
// ============================================================================
// Use case: A real-world scenario combining multiple privacy features

function processUserDataForAnalytics(userData) {
    // Step 1: Anonymize identifying fields
    const anonymized = PrivacyGuard.anonymize(userData, ['name', 'email', 'phone', 'address']);
    
    // Step 2: Check for any remaining PII that might have slipped through
    const piiCheck = PrivacyGuard.containsPII(JSON.stringify(anonymized));
    
    if (piiCheck.hasEmail || piiCheck.hasPhone || piiCheck.hasSSN || piiCheck.hasCard) {
        console.error('⚠️ Still contains PII after anonymization!');
        return null;
    }
    
    // Step 3: Add processing timestamp
    return {
        ...anonymized,
        processedAt: new Date().toISOString()
    };
}

const rawUserData = {
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    phone: '555-111-2222',
    purchaseHistory: ['item1', 'item2'],
    role: 'customer'
};

const analyticsReady = processUserDataForAnalytics(rawUserData);
console.log('Analytics-ready data:', analyticsReady);


// ============================================================================
// Example 9: URL Sanitization for Different URL Types
// ============================================================================

const testUrls = [
    'https://example.com/api?token=abc123&format=json',
    'https://example.com/auth?username=admin&password=secret123',
    'https://example.com/search?q=test&user_id=999',
    'https://example.com/oauth?code=xyz&state=abc&session=session123',
];

testUrls.forEach(url => {
    console.log(`${url} => ${PrivacyGuard.sanitizeURL(url)}`);
});
// All sensitive params (token, password, user_id, session) will be redacted


// ============================================================================
// Export for use in extension contexts
// ============================================================================

// In your Chrome extension, you would import like this:
// import { PrivacyGuard } from 'webext-privacy-guard';
// 
// Or in a content script or background script:
// const { PrivacyGuard } = require('webext-privacy-guard');

console.log('PrivacyGuard examples loaded successfully!');
