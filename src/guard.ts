/**
 * Privacy Guard — Strip PII, anonymize, GDPR export
 */
export class PrivacyGuard {
    private static EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    private static PHONE_RE = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    private static SSN_RE = /\d{3}-\d{2}-\d{4}/g;
    private static CREDIT_CARD_RE = /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g;

    /** Strip PII from text */
    static stripPII(text: string): string {
        return text
            .replace(this.EMAIL_RE, '[EMAIL]')
            .replace(this.PHONE_RE, '[PHONE]')
            .replace(this.SSN_RE, '[SSN]')
            .replace(this.CREDIT_CARD_RE, '[CARD]');
    }

    /** Strip PII from URL (query params) */
    static sanitizeURL(url: string): string {
        try {
            const u = new URL(url);
            const sensitiveParams = ['email', 'token', 'key', 'password', 'secret', 'auth', 'session', 'ssn', 'phone'];
            sensitiveParams.forEach((p) => { if (u.searchParams.has(p)) u.searchParams.set(p, '[REDACTED]'); });
            return u.toString();
        } catch { return url; }
    }

    /** Anonymize object by hashing identifiable fields */
    static anonymize<T extends Record<string, any>>(data: T, fields: string[]): T {
        const result = { ...data };
        fields.forEach((field) => {
            if (result[field]) (result as any)[field] = this.hash(String(result[field]));
        });
        return result;
    }

    /** Generate GDPR data export */
    static async generateExport(storageKeys?: string[]): Promise<string> {
        const result = storageKeys ? await chrome.storage.local.get(storageKeys) : await chrome.storage.local.get();
        const exportData = { exportedAt: new Date().toISOString(), extensionId: chrome.runtime.id, data: result };
        return JSON.stringify(exportData, null, 2);
    }

    /** Delete all user data (right to erasure) */
    static async deleteAllData(): Promise<void> {
        await chrome.storage.local.clear();
        await chrome.storage.sync.clear();
    }

    /** Check if text contains PII */
    static containsPII(text: string): { hasEmail: boolean; hasPhone: boolean; hasSSN: boolean; hasCard: boolean } {
        return {
            hasEmail: this.EMAIL_RE.test(text), hasPhone: this.PHONE_RE.test(text),
            hasSSN: this.SSN_RE.test(text), hasCard: this.CREDIT_CARD_RE.test(text),
        };
    }

    /** Apply data retention — delete data older than N days */
    static async applyRetention(key: string, maxAgeDays: number): Promise<number> {
        const result = await chrome.storage.local.get(key);
        const data = result[key] as any[];
        if (!Array.isArray(data)) return 0;
        const cutoff = Date.now() - maxAgeDays * 86400000;
        const filtered = data.filter((item) => (item.timestamp || item.createdAt || 0) > cutoff);
        const removed = data.length - filtered.length;
        await chrome.storage.local.set({ [key]: filtered });
        return removed;
    }

    private static hash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
        return 'anon_' + Math.abs(hash).toString(36);
    }
}
