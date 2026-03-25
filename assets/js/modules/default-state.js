export const defaultDraftState = {
    contentType: 'url',
    fields: {
        url: { url: '' },
        text: { text: '' },
        wifi: { ssid: '', password: '', security: 'WPA', hidden: 'false' },
        phone: { phone: '' },
        email: { email: '', subject: '', body: '' },
        vcard: {
            firstName: '',
            lastName: '',
            organization: '',
            title: '',
            phone: '',
            email: '',
            website: '',
            address: '',
            note: ''
        }
    },
    options: {
        size: 260,
        margin: 2,
        darkColor: '#1f2937',
        lightColor: '#ffffff',
        errorCorrectionLevel: 'H'
    }
};
