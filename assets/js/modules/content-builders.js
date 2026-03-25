const contentTypeLabels = {
    url: 'URL',
    text: 'Text',
    wifi: 'Wi‑Fi',
    phone: 'Phone',
    email: 'Email',
    vcard: 'vCard'
};

function normalizeUrl(url) {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
        return '';
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
        return `https://${trimmedUrl}`;
    }

    return trimmedUrl;
}

function escapeVCard(value) {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

function buildUrlPayload(fields) {
    if (!fields.url?.trim()) {
        return { valid: false, message: 'Enter a URL to generate the code.' };
    }

    const normalizedUrl = normalizeUrl(fields.url);

    try {
        const parsedUrl = new URL(normalizedUrl);
        if (!parsedUrl.hostname) {
            throw new Error('Invalid URL');
        }
    } catch {
        return { valid: false, message: 'The URL is not valid.' };
    }

    return {
        valid: true,
        text: normalizedUrl,
        label: normalizedUrl,
        actionUrl: normalizedUrl
    };
}

function buildTextPayload(fields) {
    if (!fields.text?.trim()) {
        return { valid: false, message: 'Write the text you want to convert into a QR code.' };
    }

    return {
        valid: true,
        text: fields.text.trim(),
        label: fields.text.trim().slice(0, 70)
    };
}

function buildWifiPayload(fields) {
    if (!fields.ssid?.trim()) {
        return { valid: false, message: 'The Wi‑Fi network name is required.' };
    }

    const security = fields.security || 'WPA';
    const hidden = fields.hidden === 'true';
    const parts = [
        `WIFI:T:${security};`,
        `S:${fields.ssid.trim()};`,
        `P:${(fields.password || '').trim()};`,
        `H:${hidden};`,
        ';'
    ];

    return {
        valid: true,
        text: parts.join(''),
        label: `Wi‑Fi · ${fields.ssid.trim()}`
    };
}

function buildPhonePayload(fields) {
    if (!fields.phone?.trim()) {
        return { valid: false, message: 'Enter a phone number.' };
    }

    const normalizedPhone = fields.phone.replace(/\s+/g, '');
    return {
        valid: true,
        text: `tel:${normalizedPhone}`,
        label: normalizedPhone,
        actionUrl: `tel:${normalizedPhone}`
    };
}

function buildEmailPayload(fields) {
    if (!fields.email?.trim()) {
        return { valid: false, message: 'Enter an email address.' };
    }

    const search = new URLSearchParams();
    if (fields.subject?.trim()) {
        search.set('subject', fields.subject.trim());
    }
    if (fields.body?.trim()) {
        search.set('body', fields.body.trim());
    }

    const address = fields.email.trim();
    const query = search.toString();
    const mailto = query ? `mailto:${address}?${query}` : `mailto:${address}`;

    return {
        valid: true,
        text: mailto,
        label: address,
        actionUrl: mailto
    };
}

function buildVCardPayload(fields) {
    if (!fields.firstName?.trim() && !fields.lastName?.trim()) {
        return { valid: false, message: 'Add at least a first name or last name for the vCard.' };
    }

    const fullName = [fields.firstName?.trim(), fields.lastName?.trim()].filter(Boolean).join(' ');
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVCard(fields.lastName?.trim() || '')};${escapeVCard(fields.firstName?.trim() || '')};;;`,
        `FN:${escapeVCard(fullName)}`
    ];

    if (fields.organization?.trim()) {
        lines.push(`ORG:${escapeVCard(fields.organization.trim())}`);
    }
    if (fields.title?.trim()) {
        lines.push(`TITLE:${escapeVCard(fields.title.trim())}`);
    }
    if (fields.phone?.trim()) {
        lines.push(`TEL;TYPE=CELL:${escapeVCard(fields.phone.trim())}`);
    }
    if (fields.email?.trim()) {
        lines.push(`EMAIL:${escapeVCard(fields.email.trim())}`);
    }
    if (fields.website?.trim()) {
        lines.push(`URL:${escapeVCard(normalizeUrl(fields.website))}`);
    }
    if (fields.address?.trim()) {
        lines.push(`ADR:;;${escapeVCard(fields.address.trim())};;;;`);
    }
    if (fields.note?.trim()) {
        lines.push(`NOTE:${escapeVCard(fields.note.trim())}`);
    }

    lines.push('END:VCARD');

    return {
        valid: true,
        text: lines.join('\n'),
        label: fullName || 'Contacto vCard'
    };
}

const builders = {
    url: buildUrlPayload,
    text: buildTextPayload,
    wifi: buildWifiPayload,
    phone: buildPhonePayload,
    email: buildEmailPayload,
    vcard: buildVCardPayload
};

export function buildContentPayload(type, fields) {
    const builder = builders[type] || builders.url;
    const result = builder(fields);

    if (!result.valid) {
        return result;
    }

    return {
        ...result,
        type,
        typeLabel: contentTypeLabels[type] || 'Content'
    };
}

export function getContentTypeLabel(type) {
    return contentTypeLabels[type] || 'Content';
}

export function supportsOpenAction(payload) {
    return Boolean(payload?.actionUrl && /^(https?:|mailto:|tel:)/i.test(payload.actionUrl));
}
