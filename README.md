# webext-privacy-guard — Privacy Utilities

[![npm version](https://img.shields.io/npm/v/webext-privacy-guard)](https://npmjs.com/package/webext-privacy-guard)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/webext-privacy-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-privacy-guard/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-privacy-guard?style=social)](https://github.com/theluckystrike/webext-privacy-guard)

> Strip PII (email/phone/SSN/card), sanitize URLs, anonymize data, GDPR export, and retention policies.

**webext-privacy-guard** provides comprehensive privacy utilities for Chrome extensions. Strip personally identifiable information, sanitize URLs, generate GDPR exports, and implement data retention policies — all with a privacy-first approach.

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **PII Stripping** - Remove emails, phones, SSNs, credit cards
- ✅ **URL Sanitization** - Remove tracking parameters and sensitive data
- ✅ **Data Anonymization** - Hash and anonymize user data
- ✅ **GDPR Export** - Generate data export requests
- ✅ **Retention Policies** - Implement data expiration
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install webext-privacy-guard
```

## Quick Start

```typescript
import { PrivacyGuard } from 'webext-privacy-guard';

// Strip PII from text
const clean = PrivacyGuard.stripPII('Contact john@example.com at 555-123-4567');

// Sanitize URLs
const safe = PrivacyGuard.sanitizeURL('https://api.com?email=user@test.com&token=abc');

// Generate GDPR export
const export = await PrivacyGuard.generateExport();
```

## Usage Examples

### Strip PII

```typescript
// Strip all PII types
const clean = PrivacyGuard.stripPII(
  'Contact john@example.com at 555-123-4567 or 987-654-3210'
);
// Output: 'Contact [EMAIL] at [PHONE] or [PHONE]'

// Strip specific types only
const emailsOnly = PrivacyGuard.stripPII(text, { emails: true, phones: false });
```

### URL Sanitization

```typescript
// Remove tracking parameters
const safe = PrivacyGuard.sanitizeURL(
  'https://example.com/page?utm_source=google&email=user@test.com'
);
// Output: 'https://example.com/page?utm_source=google'

// Custom parameters to remove
const custom = PrivacyGuard.sanitizeURL(url, {
  params: ['ref', 'source', 'fbclid']
});
```

### Data Anonymization

```typescript
// Hash sensitive data
const hashed = PrivacyGuard.hash('user-id-123');

// Anonymize user object
const anon = PrivacyGuard.anonymize({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
});
// Output: { id: 'user-123', name: '[NAME]', email: '[EMAIL]' }
```

### GDPR Export

```typescript
// Generate data export
const export = await PrivacyGuard.generateExport({
  includeStorage: true,
  includeHistory: false,
});

// Returns a downloadable JSON file with all user data
```

### Retention Policies

```typescript
// Set expiration for data
await PrivacyGuard.setExpiration('temp-data', {
  duration: 24 * 60 * 60 * 1000, // 24 hours
  onExpire: 'delete' // or 'notify'
});

// Clean expired data
await PrivacyGuard.cleanExpired();
```

## API

### PrivacyGuard Methods

| Method | Description |
|--------|-------------|
| `PrivacyGuard.stripPII(text, options?)` | Remove PII from text |
| `PrivacyGuard.sanitizeURL(url, options?)` | Remove tracking from URLs |
| `PrivacyGuard.hash(data)` | Hash sensitive data |
| `PrivacyGuard.anonymize(data)` | Anonymize user data |
| `PrivacyGuard.generateExport(options?)` | Generate GDPR export |
| `PrivacyGuard.setExpiration(key, policy)` | Set data expiration |
| `PrivacyGuard.cleanExpired()` | Clean expired data |

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/privacy-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/privacy-feature`
7. **Submit** a Pull Request

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [webext-url-parser](https://github.com/theluckystrike/webext-url-parser) - URL utilities
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Extension template

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
