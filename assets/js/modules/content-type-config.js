export const contentTypeOrder = ['url', 'text', 'wifi', 'phone', 'email', 'vcard'];

export const contentTypeConfigs = {
    url: {
        label: 'URL',
        icon: 'WEB',
        shortDescription: 'Perfect for websites, portfolios, or demos.',
        detail: 'Generate a QR that opens a web link directly in the browser.',
        groups: [
            {
                title: 'Destination',
                description: 'Use the full URL or just the domain; `https://` will be added if missing.',
                fields: [
                    {
                        name: 'url',
                        label: 'Website link',
                        type: 'url',
                        placeholder: 'https://example.com',
                        help: 'Ideal for pages, stores, demos, or social profiles.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    text: {
        label: 'Text',
        icon: 'TXT',
        shortDescription: 'Share messages, notes, or instructions.',
        detail: 'Turn any block of text into a scannable QR code.',
        groups: [
            {
                title: 'Message',
                description: 'This format is useful for instructions, promotions, or short text.',
                fields: [
                    {
                        name: 'text',
                        label: 'QR text',
                        type: 'textarea',
                        placeholder: 'Type the content you want to encode here…',
                        help: 'The longer the text, the denser the QR code will be.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    wifi: {
        label: 'Wi‑Fi',
        icon: 'NET',
        shortDescription: 'Make joining a network easier.',
        detail: 'Let someone scan and connect to a Wi‑Fi network without typing credentials manually.',
        groups: [
            {
                title: 'Network',
                description: 'Fill in the basic wireless network details.',
                fields: [
                    {
                        name: 'ssid',
                        label: 'Network name',
                        type: 'text',
                        placeholder: 'MyWiFi',
                        help: 'This is the visible Wi‑Fi name.',
                        width: 'full'
                    },
                    {
                        name: 'security',
                        label: 'Security type',
                        type: 'select',
                        options: [
                            { value: 'WPA', label: 'WPA / WPA2' },
                            { value: 'WEP', label: 'WEP' },
                            { value: 'nopass', label: 'No password' }
                        ],
                        width: 'half'
                    },
                    {
                        name: 'hidden',
                        label: 'Hidden network?',
                        type: 'select',
                        options: [
                            { value: 'false', label: 'No' },
                            { value: 'true', label: 'Yes' }
                        ],
                        width: 'half'
                    },
                    {
                        name: 'password',
                        label: 'Password',
                        type: 'text',
                        placeholder: '••••••••',
                        help: 'If the network is open, you can leave this field empty.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    phone: {
        label: 'Phone',
        icon: 'TEL',
        shortDescription: 'Call with a single scan.',
        detail: 'Generate a QR that opens the dialer app with the number prefilled.',
        groups: [
            {
                title: 'Quick contact',
                description: 'Include the international prefix so it works better across devices.',
                fields: [
                    {
                        name: 'phone',
                        label: 'Phone number',
                        type: 'tel',
                        placeholder: '+52 555 123 4567',
                        help: 'Useful for business cards, stores, or customer support.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    email: {
        label: 'Email',
        icon: 'MAIL',
        shortDescription: 'Open an email ready to send.',
        detail: 'The QR will prefill recipient, subject, and message in the user email app.',
        groups: [
            {
                title: 'Recipient',
                description: 'Define who will receive the email.',
                fields: [
                    {
                        name: 'email',
                        label: 'Email address',
                        type: 'email',
                        placeholder: 'hello@example.com',
                        width: 'full'
                    }
                ]
            },
            {
                title: 'Initial message',
                description: 'Optionally leave the email almost ready to send.',
                fields: [
                    {
                        name: 'subject',
                        label: 'Subject',
                        type: 'text',
                        placeholder: 'I would like more information',
                        width: 'full'
                    },
                    {
                        name: 'body',
                        label: 'Message',
                        type: 'textarea',
                        placeholder: 'Hi, I am interested in learning more about your service…',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    vcard: {
        label: 'vCard',
        icon: 'ID',
        shortDescription: 'Share a full contact profile.',
        detail: 'Ideal for digital business cards, networking, and professional profiles.',
        groups: [
            {
                title: 'Identity',
                description: 'Main details for a person or personal brand.',
                fields: [
                    {
                        name: 'firstName',
                        label: 'First name',
                        type: 'text',
                        placeholder: 'Sleider',
                        width: 'half'
                    },
                    {
                        name: 'lastName',
                        label: 'Last name',
                        type: 'text',
                        placeholder: 'Perez',
                        width: 'half'
                    },
                    {
                        name: 'organization',
                        label: 'Company or project',
                        type: 'text',
                        placeholder: 'QR Studio',
                        width: 'half'
                    },
                    {
                        name: 'title',
                        label: 'Position or role',
                        type: 'text',
                        placeholder: 'Designer / Developer',
                        width: 'half'
                    }
                ]
            },
            {
                title: 'Contact channels',
                description: 'Let people contact you through different channels.',
                fields: [
                    {
                        name: 'phone',
                        label: 'Phone',
                        type: 'tel',
                        placeholder: '+52 555 123 4567',
                        width: 'half'
                    },
                    {
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        placeholder: 'hello@example.com',
                        width: 'half'
                    },
                    {
                        name: 'website',
                        label: 'Website',
                        type: 'text',
                        placeholder: 'mydemo.com',
                        width: 'full'
                    }
                ]
            },
            {
                title: 'Extras',
                description: 'Complete the profile with an address and a short note.',
                fields: [
                    {
                        name: 'address',
                        label: 'Address',
                        type: 'text',
                        placeholder: 'City, State, Country',
                        width: 'full'
                    },
                    {
                        name: 'note',
                        label: 'Note',
                        type: 'textarea',
                        placeholder: 'Specialist in branding, interfaces, and digital experiences.',
                        width: 'full'
                    }
                ]
            }
        ]
    }
};

export function getContentTypeConfig(type) {
    return contentTypeConfigs[type] || contentTypeConfigs.url;
}
