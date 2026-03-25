export const contentTypeOrder = ['url', 'text', 'wifi', 'phone', 'email', 'vcard'];

export const contentTypeConfigs = {
    url: {
        label: 'URL',
        icon: 'WEB',
        shortDescription: 'Perfecto para sitios, portfolios o demos.',
        detail: 'Genera un QR que abre directamente un enlace web en el navegador.',
        groups: [
            {
                title: 'Destino',
                description: 'Usa la URL completa o solo el dominio; se completará `https://` si hace falta.',
                fields: [
                    {
                        name: 'url',
                        label: 'Enlace del sitio',
                        type: 'url',
                        placeholder: 'https://ejemplo.com',
                        help: 'Ideal para páginas, tiendas, demos o perfiles sociales.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    text: {
        label: 'Texto',
        icon: 'TXT',
        shortDescription: 'Comparte mensajes, notas o instrucciones.',
        detail: 'Convierte cualquier bloque de texto en un QR escaneable.',
        groups: [
            {
                title: 'Mensaje',
                description: 'Este formato es útil para indicaciones, promociones o textos cortos.',
                fields: [
                    {
                        name: 'text',
                        label: 'Texto del QR',
                        type: 'textarea',
                        placeholder: 'Escribe aquí el contenido que quieres codificar…',
                        help: 'Mientras más largo sea el texto, más denso será el código QR.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    wifi: {
        label: 'Wi‑Fi',
        icon: 'NET',
        shortDescription: 'Facilita la conexión a una red.',
        detail: 'Permite que alguien escanee y configure una red Wi‑Fi sin escribirla manualmente.',
        groups: [
            {
                title: 'Red',
                description: 'Completa los datos básicos de la red inalámbrica.',
                fields: [
                    {
                        name: 'ssid',
                        label: 'Nombre de la red',
                        type: 'text',
                        placeholder: 'MiWiFi',
                        help: 'Es el nombre visible del Wi‑Fi.',
                        width: 'full'
                    },
                    {
                        name: 'security',
                        label: 'Tipo de seguridad',
                        type: 'select',
                        options: [
                            { value: 'WPA', label: 'WPA / WPA2' },
                            { value: 'WEP', label: 'WEP' },
                            { value: 'nopass', label: 'Sin contraseña' }
                        ],
                        width: 'half'
                    },
                    {
                        name: 'hidden',
                        label: '¿Red oculta?',
                        type: 'select',
                        options: [
                            { value: 'false', label: 'No' },
                            { value: 'true', label: 'Sí' }
                        ],
                        width: 'half'
                    },
                    {
                        name: 'password',
                        label: 'Contraseña',
                        type: 'text',
                        placeholder: '••••••••',
                        help: 'Si la red es abierta, puedes dejar este campo vacío.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    phone: {
        label: 'Teléfono',
        icon: 'TEL',
        shortDescription: 'Llama con un solo escaneo.',
        detail: 'Genera un QR que abre la app de llamadas con el número precargado.',
        groups: [
            {
                title: 'Contacto rápido',
                description: 'Incluye el prefijo internacional para que funcione mejor en cualquier dispositivo.',
                fields: [
                    {
                        name: 'phone',
                        label: 'Número telefónico',
                        type: 'tel',
                        placeholder: '+52 555 123 4567',
                        help: 'Útil para tarjetas físicas, negocios o atención al cliente.',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    email: {
        label: 'Email',
        icon: 'MAIL',
        shortDescription: 'Abre un correo listo para enviar.',
        detail: 'El QR llenará destinatario, asunto y mensaje en la app de correo del usuario.',
        groups: [
            {
                title: 'Destinatario',
                description: 'Define quién recibirá el correo.',
                fields: [
                    {
                        name: 'email',
                        label: 'Correo electrónico',
                        type: 'email',
                        placeholder: 'hola@ejemplo.com',
                        width: 'full'
                    }
                ]
            },
            {
                title: 'Mensaje inicial',
                description: 'Opcionalmente, deja el correo casi listo para enviarse.',
                fields: [
                    {
                        name: 'subject',
                        label: 'Asunto',
                        type: 'text',
                        placeholder: 'Quiero más información',
                        width: 'full'
                    },
                    {
                        name: 'body',
                        label: 'Mensaje',
                        type: 'textarea',
                        placeholder: 'Hola, me interesa conocer más sobre tu servicio…',
                        width: 'full'
                    }
                ]
            }
        ]
    },
    vcard: {
        label: 'vCard',
        icon: 'ID',
        shortDescription: 'Comparte un contacto completo.',
        detail: 'Ideal para tarjetas de presentación digitales, networking y perfiles profesionales.',
        groups: [
            {
                title: 'Identidad',
                description: 'Los datos principales de la persona o marca personal.',
                fields: [
                    {
                        name: 'firstName',
                        label: 'Nombre',
                        type: 'text',
                        placeholder: 'Sleider',
                        width: 'half'
                    },
                    {
                        name: 'lastName',
                        label: 'Apellido',
                        type: 'text',
                        placeholder: 'Pérez',
                        width: 'half'
                    },
                    {
                        name: 'organization',
                        label: 'Empresa o proyecto',
                        type: 'text',
                        placeholder: 'QR Studio',
                        width: 'half'
                    },
                    {
                        name: 'title',
                        label: 'Cargo o rol',
                        type: 'text',
                        placeholder: 'Diseñador / Developer',
                        width: 'half'
                    }
                ]
            },
            {
                title: 'Canales de contacto',
                description: 'Haz que te contacten desde distintos medios.',
                fields: [
                    {
                        name: 'phone',
                        label: 'Teléfono',
                        type: 'tel',
                        placeholder: '+52 555 123 4567',
                        width: 'half'
                    },
                    {
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        placeholder: 'hola@ejemplo.com',
                        width: 'half'
                    },
                    {
                        name: 'website',
                        label: 'Sitio web',
                        type: 'text',
                        placeholder: 'midemo.com',
                        width: 'full'
                    }
                ]
            },
            {
                title: 'Extras',
                description: 'Complementa la ficha con dirección y una nota breve.',
                fields: [
                    {
                        name: 'address',
                        label: 'Dirección',
                        type: 'text',
                        placeholder: 'Ciudad, Estado, País',
                        width: 'full'
                    },
                    {
                        name: 'note',
                        label: 'Nota',
                        type: 'textarea',
                        placeholder: 'Especialista en branding, interfaces y experiencias digitales.',
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
