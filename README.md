# webext-privacy-guard

> Privacy utilities for Chrome extensions — PII stripping, data anonymization, GDPR export, and retention policies for MV3.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install webext-privacy-guard
```

## Usage

```js
import { PrivacyGuard } from 'webext-privacy-guard';

// Strip PII from user-submitted text
const clean = PrivacyGuard.stripPII('Contact me at jane@example.com or 555-123-4567');
// => 'Contact me at [EMAIL] or [PHONE]'

// Check if text contains sensitive data
const result = PrivacyGuard.containsPII('SSN: 123-45-6789');
// => { hasEmail: false, hasPhone: false, hasSSN: true, hasCard: false }

// Sanitize URLs by redacting sensitive query params
const safeUrl = PrivacyGuard.sanitizeURL('https://example.com?email=jane@test.com&token=abc123');
// => 'https://example.com/?email=%5BREDACTED%5D&token=%5BREDACTED%5D'

// Anonymize specific fields in an object
const user = { name: 'Jane Doe', email: 'jane@test.com', role: 'admin' };
const anon = PrivacyGuard.anonymize(user, ['name', 'email']);
// => { name: 'anon_...', email: 'anon_...', role: 'admin' }

// Generate a GDPR-compliant data export
const exportJson = await PrivacyGuard.generateExport(['userData', 'settings']);

// Delete all user data (right to erasure)
await PrivacyGuard.deleteAllData();

// Apply data retention — remove entries older than 30 days
const removed = await PrivacyGuard.applyRetention('activityLog', 30);
```

## API

### `PrivacyGuard`

All methods are static.

#### `PrivacyGuard.stripPII(text: string): string`

Strips PII (emails, phone numbers, SSNs, credit card numbers) from the given text, replacing each with a bracketed placeholder (`[EMAIL]`, `[PHONE]`, `[SSN]`, `[CARD]`).

#### `PrivacyGuard.sanitizeURL(url: string): string`

Redacts sensitive query parameters (`email`, `token`, `key`, `password`, `secret`, `auth`, `session`, `ssn`, `phone`) from a URL, replacing their values with `[REDACTED]`.

#### `PrivacyGuard.anonymize<T extends Record<string, any>>(data: T, fields: string[]): T`

Returns a shallow copy of `data` with the specified `fields` replaced by deterministic hash strings (prefixed with `anon_`).

#### `PrivacyGuard.generateExport(storageKeys?: string[]): Promise<string>`

Reads data from `chrome.storage.local` (all keys or the specified subset) and returns a JSON string containing the exported data, a timestamp, and the extension ID. Useful for GDPR data portability requests.

#### `PrivacyGuard.deleteAllData(): Promise<void>`

Clears both `chrome.storage.local` and `chrome.storage.sync`, implementing the GDPR right to erasure.

#### `PrivacyGuard.containsPII(text: string): { hasEmail: boolean; hasPhone: boolean; hasSSN: boolean; hasCard: boolean }`

Checks whether the given text contains any detectable PII patterns and returns a breakdown by category.

#### `PrivacyGuard.applyRetention(key: string, maxAgeDays: number): Promise<number>`

Reads an array from `chrome.storage.local` at the given `key`, removes entries whose `timestamp` or `createdAt` field is older than `maxAgeDays`, writes the filtered array back, and returns the number of removed entries.

## License

MIT
