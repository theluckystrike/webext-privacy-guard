# webext-privacy-guard

Privacy utilities for Chrome extensions. Strips PII, anonymizes objects, sanitizes URLs, enforces data retention, and handles GDPR export and erasure. Built for Manifest V3.

[![npm version](https://img.shields.io/npm/v/webext-privacy-guard)](https://npmjs.com/package/webext-privacy-guard)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-privacy-guard?style=social)](https://github.com/theluckystrike/webext-privacy-guard)


INSTALL

```bash
npm install webext-privacy-guard
```


QUICK START

```js
import { PrivacyGuard } from 'webext-privacy-guard';

// Strip PII from user-submitted text
const clean = PrivacyGuard.stripPII('Contact me at jane@example.com or 555-123-4567');
// 'Contact me at [EMAIL] or [PHONE]'

// Check whether text contains sensitive patterns
const report = PrivacyGuard.containsPII('SSN: 123-45-6789');
// { hasEmail: false, hasPhone: false, hasSSN: true, hasCard: false }

// Redact sensitive query parameters from a URL
const safeUrl = PrivacyGuard.sanitizeURL('https://example.com?email=jane@test.com&token=abc123');
// 'https://example.com/?email=%5BREDACTED%5D&token=%5BREDACTED%5D'

// Anonymize fields in an object with deterministic hashes
const user = { name: 'Jane Doe', email: 'jane@test.com', role: 'admin' };
const anon = PrivacyGuard.anonymize(user, ['name', 'email']);
// { name: 'anon_...', email: 'anon_...', role: 'admin' }

// Export user data from chrome.storage.local (GDPR data portability)
const exportJson = await PrivacyGuard.generateExport(['userData', 'settings']);

// Clear all user data from chrome.storage.local and chrome.storage.sync
await PrivacyGuard.deleteAllData();

// Remove entries older than 30 days from a stored array
const removed = await PrivacyGuard.applyRetention('activityLog', 30);
```


API

All methods live on the PrivacyGuard class as statics. Import once, call anywhere.

PrivacyGuard.stripPII(text: string): string

Replaces emails, phone numbers, SSNs, and credit card numbers found in text with bracketed placeholders: [EMAIL], [PHONE], [SSN], [CARD].

PrivacyGuard.containsPII(text: string): { hasEmail, hasPhone, hasSSN, hasCard }

Returns an object indicating which PII patterns were detected. Each field is a boolean.

PrivacyGuard.sanitizeURL(url: string): string

Parses the URL and replaces the values of sensitive query parameters with [REDACTED]. The parameters it watches for are email, token, key, password, secret, auth, session, ssn, and phone. Returns the original string if the URL cannot be parsed.

PrivacyGuard.anonymize<T>(data: T, fields: string[]): T

Returns a shallow copy of data with the listed fields replaced by deterministic hash strings prefixed with anon_. Fields not listed are left untouched.

PrivacyGuard.generateExport(storageKeys?: string[]): Promise<string>

Reads from chrome.storage.local (all keys or only those specified) and returns a JSON string containing the data, a timestamp, and the extension ID. Designed for GDPR data portability.

PrivacyGuard.deleteAllData(): Promise<void>

Clears both chrome.storage.local and chrome.storage.sync. Implements the GDPR right to erasure.

PrivacyGuard.applyRetention(key: string, maxAgeDays: number): Promise<number>

Loads an array stored at key in chrome.storage.local, removes entries whose timestamp or createdAt field is older than maxAgeDays, writes the filtered array back, and returns the count of removed entries.


PII PATTERNS

The regex patterns used internally cover these categories.

- Emails (user@domain.tld format)
- Phone numbers (US-style, with optional country code)
- Social Security Numbers (NNN-NN-NNNN)
- Credit card numbers (16 digits with optional separators)


SENSITIVE QUERY PARAMETERS

sanitizeURL redacts the following query parameter names when present in a URL.

email, token, key, password, secret, auth, session, ssn, phone


REQUIREMENTS

- TypeScript 5.x for building from source
- chrome.storage API (Manifest V3) for generateExport, deleteAllData, and applyRetention
- No runtime dependencies


LICENSE

MIT. See LICENSE file for details.


LINKS

- Repository: https://github.com/theluckystrike/webext-privacy-guard
- Issues: https://github.com/theluckystrike/webext-privacy-guard/issues
- npm: https://npmjs.com/package/webext-privacy-guard

---

Built at zovo.one
