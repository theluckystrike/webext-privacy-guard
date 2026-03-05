# webext-privacy-guard

[![npm version](https://img.shields.io/npm/v/webext-privacy-guard)](https://npmjs.com/package/webext-privacy-guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-privacy-guard?style=social)](https://github.com/theluckystrike/webext-privacy-guard)

> Privacy utilities for Chrome extensions — PII stripping, data anonymization, GDPR export, and retention policies for MV3.

Part of the [Zovo](https://zovo.one) developer tools family.

## Install

```bash
npm install webext-privacy-guard
```

## Usage

```js
import { PrivacyGuard } from 'webext-privacy-guard';
```

For more complete examples, see the [examples](./examples/) directory.

```js
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## See Also

### Related Zovo Repositories

- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper
- [chrome-identity-helper](https://github.com/theluckystrike/chrome-identity-helper) - OAuth2 identity management
- [chrome-data-encrypt](https://github.com/theluckystrike/chrome-data-encrypt) - AES-256 encryption
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Production-ready Chrome extension starter

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions

Visit [zovo.one](https://zovo.one) for more information.

---

Built by [Zovo](https://zovo.one)
