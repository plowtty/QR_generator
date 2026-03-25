import QRCode from '../../vendor/qrcode.mjs';

function getQrOptions(options) {
    return {
        width: options.size,
        margin: options.margin,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: {
            dark: options.darkColor,
            light: options.lightColor
        }
    };
}

export async function renderQrCode(container, text, options) {
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, text, getQrOptions(options));
    container.appendChild(canvas);

    const svgMarkup = await QRCode.toString(text, {
        ...getQrOptions(options),
        type: 'svg'
    });

    return { canvas, svgMarkup };
}

function downloadBlob(blob, filename) {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
}

export function downloadCanvasAsPng(canvas, filename) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Could not export PNG'));
                return;
            }

            downloadBlob(blob, filename);
            resolve();
        }, 'image/png');
    });
}

export function downloadSvg(svgMarkup, filename) {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, filename);
}
