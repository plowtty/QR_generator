class QRGenerator {
    constructor() {
        this.qrCode = null;
        this.currentUrl = '';
        this.initializeElements();
        this.attachEventListeners();
        this.createMagicalEffects();
    }

    initializeElements() {
        this.urlInput = document.getElementById('urlInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.qrCodeContainer = document.getElementById('qrcode');
        this.actions = document.getElementById('actions');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.placeholderText = document.getElementById('placeholderText');
        this.toast = document.getElementById('toast');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateQR());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQR();
        });
        this.urlInput.addEventListener('input', () => this.clearError());
        this.downloadBtn.addEventListener('click', () => this.downloadQR());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearBtn.addEventListener('click', () => this.clearQR());
        
        // Add magical input effects
        this.urlInput.addEventListener('focus', () => this.addSparkles());
        this.urlInput.addEventListener('blur', () => this.removeSparkles());
    }

    createMagicalEffects() {
        // Add random floating particles
        setInterval(() => {
            this.createFloatingParticle();
        }, 3000);
    }

    createFloatingParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 10}px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        `;
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0px) scale(0)', opacity: 0 },
            { transform: 'translateY(-100px) scale(1)', opacity: 1 },
            { transform: `translateY(-${window.innerHeight + 100}px) scale(0)`, opacity: 0 }
        ], {
            duration: 4000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        };
    }

    addSparkles() {
        const inputRect = this.urlInput.getBoundingClientRect();
        for(let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createSparkle(inputRect);
            }, i * 100);
        }
    }

    createSparkle(rect) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: fixed;
            font-size: 12px;
            pointer-events: none;
            z-index: 1001;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
        `;
        
        document.body.appendChild(sparkle);
        
        const animation = sparkle.animate([
            { transform: 'scale(0) rotate(0deg)', opacity: 0 },
            { transform: 'scale(1) rotate(180deg)', opacity: 1 },
            { transform: 'scale(0) rotate(360deg)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        };
    }

    removeSparkles() {
        // Sparkles are automatically removed by their animations
    }

    validateUrl(url) {
        if (!url.trim()) {
            return { valid: false, message: '✨ Por favor, ingresa una URL mágica' };
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            new URL(url);
            return { valid: true, url: url };
        } catch {
            return { valid: false, message: '🎯 Por favor, ingresa una URL válida' };
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.urlInput.style.borderColor = 'rgba(255, 107, 107, 0.8)';
        this.urlInput.style.boxShadow = '0 0 0 4px rgba(255, 107, 107, 0.2)';
    }

    clearError() {
        this.errorMessage.style.display = 'none';
        this.urlInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        this.urlInput.style.boxShadow = 'none';
    }

    generateQR() {
        const inputUrl = this.urlInput.value;
        const validation = this.validateUrl(inputUrl);

        if (!validation.valid) {
            this.showError(validation.message);
            this.urlInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                this.urlInput.style.animation = '';
            }, 500);
            return;
        }

        this.clearError();
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = '🎨 Creando magia...';
        this.generateBtn.classList.add('loading');

        // Clear previous QR code
        this.qrCodeContainer.innerHTML = '';
        this.placeholderText.style.display = 'none';

        // Add magical generation effect
        this.createGenerationEffect();

        setTimeout(() => {
            try {
                this.qrCode = new QRCode(this.qrCodeContainer, {
                    text: validation.url,
                    width: 220,
                    height: 220,
                    colorDark: '#2c3e50',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });

                this.currentUrl = validation.url;
                
                setTimeout(() => {
                    this.actions.classList.add('show');
                    this.generateBtn.disabled = false;
                    this.generateBtn.textContent = '🚀 Crear Magia QR';
                    this.generateBtn.classList.remove('loading');
                    this.celebrateGeneration();
                }, 600);

            } catch (error) {
                this.showError('💥 Error al generar el código QR mágico');
                this.generateBtn.disabled = false;
                this.generateBtn.textContent = '🚀 Crear Magia QR';
                this.generateBtn.classList.remove('loading');
                this.placeholderText.style.display = 'block';
            }
        }, 1000);
    }

    createGenerationEffect() {
        for(let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createMagicalParticle();
            }, i * 50);
        }
    }

    createMagicalParticle() {
        const particle = document.createElement('div');
        const container = this.qrCodeContainer.parentElement;
        const rect = container.getBoundingClientRect();
        
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px) scale(1)`, opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        };
    }

    celebrateGeneration() {
        // Fireworks effect
        for(let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createFirework();
            }, i * 100);
        }
        
        this.showToast('🎉 ¡Código QR generado con éxito!', 'success');
    }

    createFirework() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
        const firework = document.createElement('div');
        
        firework.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            box-shadow: 0 0 10px currentColor;
        `;
        
        document.body.appendChild(firework);
        
        const animation = firework.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(3)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        };
    }

    downloadQR() {
        const canvas = this.qrCodeContainer.querySelector('canvas');
        if (!canvas) {
            this.showToast('❌ No hay código QR para descargar', 'error');
            return;
        }

        try {
            // Add download effect
            this.downloadBtn.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                this.downloadBtn.style.animation = '';
            }, 600);

            const link = document.createElement('a');
            link.download = `qr-magico-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast('💾 ¡Código QR descargado exitosamente!', 'success');
            this.createDownloadEffect();
        } catch (error) {
            this.showToast('💥 Error al descargar el código QR', 'error');
        }
    }

    createDownloadEffect() {
        for(let i = 0; i < 10; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.innerHTML = '💾';
                effect.style.cssText = `
                    position: fixed;
                    font-size: 20px;
                    pointer-events: none;
                    z-index: 1001;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -30px;
                `;
                
                document.body.appendChild(effect);
                
                const animation = effect.animate([
                    { transform: 'translateY(-30px) rotate(0deg)', opacity: 1 },
                    { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 }
                ], {
                    duration: 2000,
                    easing: 'ease-in'
                });
                
                animation.onfinish = () => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                };
            }, i * 200);
        }
    }

    async copyToClipboard() {
        const canvas = this.qrCodeContainer.querySelector('canvas');
        if (!canvas) {
            this.showToast('❌ No hay código QR para copiar', 'error');
            return;
        }

        try {
            // Add copy effect
            this.copyBtn.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                this.copyBtn.style.animation = '';
            }, 600);

            if (navigator.clipboard && window.ClipboardItem) {
                canvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        this.showToast('📋 ¡Código QR copiado al portapapeles!', 'success');
                        this.createCopyEffect();
                    } catch (error) {
                        this.fallbackCopy();
                    }
                });
            } else {
                this.fallbackCopy();
            }
        } catch (error) {
            this.fallbackCopy();
        }
    }

    fallbackCopy() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.currentUrl).then(() => {
                this.showToast('🔗 ¡URL copiada al portapapeles!', 'success');
                this.createCopyEffect();
            }).catch(() => {
                this.showToast('💥 Error al copiar', 'error');
            });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = this.currentUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showToast('🔗 ¡URL copiada al portapapeles!', 'success');
                this.createCopyEffect();
            } catch (error) {
                this.showToast('💥 Error al copiar', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    createCopyEffect() {
        const copyEmojis = ['📋', '📄', '📃', '🗂️'];
        for(let i = 0; i < 8; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.innerHTML = copyEmojis[Math.floor(Math.random() * copyEmojis.length)];
                effect.style.cssText = `
                    position: fixed;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1001;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                `;
                
                document.body.appendChild(effect);
                
                const angle = (i / 8) * Math.PI * 2;
                const distance = 100;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                const animation = effect.animate([
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(1)`, opacity: 1 },
                    { transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                });
                
                animation.onfinish = () => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                };
            }, i * 100);
        }
    }

    clearQR() {
        // Add clear effect
        this.clearBtn.style.animation = 'pulse 0.6s ease-out';
        setTimeout(() => {
            this.clearBtn.style.animation = '';
        }, 600);

        this.createClearEffect();
        
        setTimeout(() => {
            this.qrCodeContainer.innerHTML = '';
            this.actions.classList.remove('show');
            this.placeholderText.style.display = 'block';
            this.urlInput.value = '';
            this.currentUrl = '';
            this.clearError();
            this.urlInput.focus();
            this.showToast('🧹 ¡Limpieza completada!', 'success');
        }, 500);
    }

    createClearEffect() {
        for(let i = 0; i < 15; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.innerHTML = '✨';
                effect.style.cssText = `
                    position: fixed;
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 1001;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                `;
                
                document.body.appendChild(effect);
                
                const animation = effect.animate([
                    { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                    { transform: 'scale(1.5) rotate(360deg)', opacity: 1 },
                    { transform: 'scale(0) rotate(720deg)', opacity: 0 }
                ], {
                    duration: 1500,
                    easing: 'ease-out'
                });
                
                animation.onfinish = () => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                };
            }, i * 100);
        }
    }

    showToast(message, type = 'success') {
        const colors = {
            success: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            error: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            info: 'linear-gradient(135deg, #667eea, #764ba2)'
        };

        this.toast.textContent = message;
        this.toast.style.background = colors[type] || colors.success;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 4000);
    }
}

// Add shake animation for errors
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize the QR Generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QRGenerator();
});