# webext-privacy-guard — Privacy Utilities
> **Built by [Zovo](https://zovo.one)** | `npm i webext-privacy-guard`

Strip PII (email/phone/SSN/card), sanitize URLs, anonymize data, GDPR export, and retention policies.

```typescript
import { PrivacyGuard } from 'webext-privacy-guard';
const clean = PrivacyGuard.stripPII('Contact john@example.com at 555-123-4567');
const safe = PrivacyGuard.sanitizeURL('https://api.com?email=user@test.com&token=abc');
const export = await PrivacyGuard.generateExport();
```
MIT License
