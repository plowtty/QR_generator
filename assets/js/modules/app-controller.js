import { buildContentPayload, getContentTypeLabel, supportsOpenAction } from './content-builders.js';
import { contentTypeOrder, getContentTypeConfig } from './content-type-config.js';
import { defaultDraftState } from './default-state.js';
import { downloadCanvasAsPng, downloadSvg, renderQrCode } from './qr-service.js';
import { deleteHistoryEntry, loadDraftState, loadHistory, saveDraftState, toggleFavorite, upsertHistoryEntry } from './storage-service.js';

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function mergeDraftState(savedDraft) {
    const draft = deepClone(defaultDraftState);

    if (!savedDraft) {
        return draft;
    }

    return {
        ...draft,
        ...savedDraft,
        fields: {
            ...draft.fields,
            ...(savedDraft.fields || {})
        },
        options: {
            ...draft.options,
            ...(savedDraft.options || {})
        }
    };
}

export class QRApp {
    constructor() {
        this.state = mergeDraftState(loadDraftState());
        this.history = loadHistory();
        this.currentRender = null;
        this.currentPayload = null;
        this.toastTimeoutId = null;
        this.initializeElements();
        this.bindEvents();
        this.hydrateForm();
        this.renderHistory();
        this.updateOpenActionState();
        this.createAmbientEffects();
    }

    initializeElements() {
        this.form = document.getElementById('qrForm');
        this.contentTypeInput = document.getElementById('contentType');
        this.contentTypePicker = document.getElementById('contentTypePicker');
        this.contentTypeEyebrow = document.getElementById('contentTypeEyebrow');
        this.contentTypeTitle = document.getElementById('contentTypeTitle');
        this.contentTypeDescription = document.getElementById('contentTypeDescription');
        this.dynamicFields = document.getElementById('dynamicFields');
        this.generateButton = document.getElementById('generateBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.qrCodeContainer = document.getElementById('qrcode');
        this.placeholderText = document.getElementById('placeholderText');
        this.liveRegion = document.getElementById('liveRegion');
        this.toast = document.getElementById('toast');
        this.previewMeta = document.getElementById('previewMeta');
        this.actions = document.getElementById('actions');
        this.downloadPngButton = document.getElementById('downloadPngBtn');
        this.downloadSvgButton = document.getElementById('downloadSvgBtn');
        this.copyButton = document.getElementById('copyBtn');
        this.favoriteButton = document.getElementById('favoriteBtn');
        this.openButton = document.getElementById('openBtn');
        this.clearButton = document.getElementById('clearBtn');
        this.historyList = document.getElementById('historyList');
        this.favoriteList = document.getElementById('favoriteList');
        this.emptyHistory = document.getElementById('emptyHistory');
        this.emptyFavorites = document.getElementById('emptyFavorites');
        this.optionSize = document.getElementById('sizeRange');
        this.optionMargin = document.getElementById('marginRange');
        this.optionDarkColor = document.getElementById('darkColor');
        this.optionLightColor = document.getElementById('lightColor');
        this.optionErrorLevel = document.getElementById('errorCorrectionLevel');
        this.sizeValue = document.getElementById('sizeValue');
        this.marginValue = document.getElementById('marginValue');
    }

    bindEvents() {
        this.form.addEventListener('input', (event) => this.handleInputChange(event));
        this.form.addEventListener('change', (event) => this.handleInputChange(event));
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.generateQr();
        });

        this.contentTypePicker.addEventListener('click', (event) => {
            const button = event.target.closest('[data-type-button]');
            if (!button) {
                return;
            }

            this.handleTypeSelection(button.dataset.typeButton);
        });

        document.addEventListener('keydown', (event) => {
            const isModifierPressed = event.metaKey || event.ctrlKey;
            if (isModifierPressed && event.key.toLowerCase() === 'enter') {
                event.preventDefault();
                this.generateQr();
            }
        });

        this.downloadPngButton.addEventListener('click', () => this.handleDownloadPng());
        this.downloadSvgButton.addEventListener('click', () => this.handleDownloadSvg());
        this.copyButton.addEventListener('click', () => this.copyContent());
        this.favoriteButton.addEventListener('click', () => this.toggleCurrentFavorite());
        this.openButton.addEventListener('click', () => this.openCurrentAction());
        this.clearButton.addEventListener('click', () => this.clearPreview());
        this.historyList.addEventListener('click', (event) => this.handleHistoryClick(event));
        this.favoriteList.addEventListener('click', (event) => this.handleHistoryClick(event));
    }

    hydrateForm() {
        this.contentTypeInput.value = this.state.contentType;
        this.renderTypePicker();
        this.renderContentSummary();
        this.renderDynamicFields();
        this.optionSize.value = this.state.options.size;
        this.optionMargin.value = this.state.options.margin;
        this.optionDarkColor.value = this.state.options.darkColor;
        this.optionLightColor.value = this.state.options.lightColor;
        this.optionErrorLevel.value = this.state.options.errorCorrectionLevel;
        this.updateOptionValueLabels();
    }

    handleTypeSelection(type) {
        if (!type || type === this.state.contentType) {
            return;
        }

        this.state.contentType = type;
        this.contentTypeInput.value = type;
        this.renderTypePicker();
        this.renderContentSummary();
        this.renderDynamicFields();
        this.hideError();
        this.saveDraft();
        this.announce(`Formulario cambiado a ${getContentTypeLabel(type)}.`);
    }

    handleInputChange(event) {
        const target = event.target;

        if (target.dataset.option) {
            this.state.options[target.dataset.option] = target.value;
            this.updateOptionValueLabels();
        }

        if (target.dataset.field) {
            const contentType = target.dataset.contentType || this.state.contentType;
            this.state.fields[contentType][target.dataset.field] = target.value;
        }

        this.hideError();
        this.saveDraft();
    }

    updateOptionValueLabels() {
        this.sizeValue.textContent = `${this.optionSize.value}px`;
        this.marginValue.textContent = `${this.optionMargin.value}`;
    }

    renderTypePicker() {
        this.contentTypePicker.innerHTML = '';

        contentTypeOrder.forEach((type) => {
            const config = getContentTypeConfig(type);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'type-card';
            button.dataset.typeButton = type;
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', String(this.state.contentType === type));
            button.classList.toggle('is-active', this.state.contentType === type);

            const icon = document.createElement('span');
            icon.className = 'type-card__icon';
            icon.textContent = config.icon;

            const body = document.createElement('span');
            body.className = 'type-card__body';

            const title = document.createElement('strong');
            title.className = 'type-card__title';
            title.textContent = config.label;

            const description = document.createElement('span');
            description.className = 'type-card__description';
            description.textContent = config.shortDescription;

            body.append(title, description);
            button.append(icon, body);
            this.contentTypePicker.appendChild(button);
        });
    }

    renderContentSummary() {
        const config = getContentTypeConfig(this.state.contentType);
        this.contentTypeEyebrow.textContent = `Tipo seleccionado · ${config.icon}`;
        this.contentTypeTitle.textContent = config.label;
        this.contentTypeDescription.textContent = config.detail;
    }

    renderDynamicFields() {
        const config = getContentTypeConfig(this.state.contentType);
        const values = this.collectCurrentFields();

        this.dynamicFields.innerHTML = '';

        config.groups.forEach((group, groupIndex) => {
            const groupSection = document.createElement('section');
            groupSection.className = 'form-subsection';

            const heading = document.createElement('div');
            heading.className = 'form-subsection__head';

            const title = document.createElement('h3');
            title.className = 'form-subsection__title';
            title.textContent = group.title;

            const description = document.createElement('p');
            description.className = 'form-subsection__description';
            description.textContent = group.description;

            heading.append(title, description);

            const grid = document.createElement('div');
            grid.className = 'field-grid';

            group.fields.forEach((field, fieldIndex) => {
                const fieldId = `${this.state.contentType}-${field.name}-${groupIndex}-${fieldIndex}`;
                const wrapper = document.createElement('div');
                wrapper.className = `field-shell ${field.width === 'half' ? 'field-shell--half' : 'field-shell--full'}`;

                const label = document.createElement('label');
                label.className = 'field-label';
                label.setAttribute('for', fieldId);
                label.textContent = field.label;

                const control = this.createFieldControl(field, fieldId, values[field.name] ?? '');
                wrapper.append(label, control);

                if (field.help) {
                    const help = document.createElement('p');
                    help.className = 'field-help';
                    help.textContent = field.help;
                    wrapper.appendChild(help);
                }

                grid.appendChild(wrapper);
            });

            groupSection.append(heading, grid);
            this.dynamicFields.appendChild(groupSection);
        });
    }

    createFieldControl(field, fieldId, value) {
        let control;

        if (field.type === 'textarea') {
            control = document.createElement('textarea');
            control.className = 'field-control field-textarea';
        } else if (field.type === 'select') {
            control = document.createElement('select');
            control.className = 'field-control field-select';
            field.options.forEach((option) => {
                const optionNode = document.createElement('option');
                optionNode.value = option.value;
                optionNode.textContent = option.label;
                control.appendChild(optionNode);
            });
        } else {
            control = document.createElement('input');
            control.type = field.type;
            control.className = field.type === 'color' ? 'field-control field-color' : 'field-control';
        }

        control.id = fieldId;
        control.placeholder = field.placeholder || '';
        control.value = value;
        control.dataset.contentType = this.state.contentType;
        control.dataset.field = field.name;

        return control;
    }

    collectCurrentFields() {
        return this.state.fields[this.state.contentType];
    }

    async generateQr() {
        const payload = buildContentPayload(this.state.contentType, this.collectCurrentFields());

        if (!payload.valid) {
            this.showError(payload.message);
            return;
        }

        this.setGeneratingState(true);
        this.placeholderText.hidden = true;
        this.hideError();

        try {
            const render = await renderQrCode(this.qrCodeContainer, payload.text, {
                size: Number(this.state.options.size),
                margin: Number(this.state.options.margin),
                darkColor: this.state.options.darkColor,
                lightColor: this.state.options.lightColor,
                errorCorrectionLevel: this.state.options.errorCorrectionLevel
            });

            this.currentRender = render;
            this.currentPayload = payload;
            this.actions.hidden = false;
            this.previewMeta.textContent = `${payload.typeLabel} · ${payload.label}`;
            this.updateOpenActionState();
            this.syncFavoriteButton();
            this.addToHistory(payload);
            this.announce(`Código QR generado para ${getContentTypeLabel(payload.type)}.`);
            this.showToast('QR generado con éxito.', 'success');
        } catch {
            this.showError('No se pudo generar el código QR. Intenta de nuevo.');
            this.placeholderText.hidden = false;
        } finally {
            this.setGeneratingState(false);
        }
    }

    setGeneratingState(isGenerating) {
        this.generateButton.disabled = isGenerating;
        this.generateButton.classList.toggle('loading', isGenerating);
        this.generateButton.querySelector('.button-label').textContent = isGenerating ? 'Generando...' : 'Generar QR';
    }

    addToHistory(payload) {
        const entry = {
            id: crypto.randomUUID(),
            favorite: this.findMatchingEntry(payload.text)?.favorite || false,
            createdAt: new Date().toISOString(),
            type: payload.type,
            typeLabel: payload.typeLabel,
            label: payload.label,
            text: payload.text,
            actionUrl: payload.actionUrl || null,
            fields: deepClone(this.collectCurrentFields()),
            options: deepClone(this.state.options)
        };

        this.history = upsertHistoryEntry(entry);
        this.renderHistory();
    }

    findMatchingEntry(text) {
        return this.history.find((entry) => entry.text === text) || null;
    }

    renderHistory() {
        const favorites = this.history.filter((entry) => entry.favorite);
        this.renderHistoryList(this.historyList, this.history, this.emptyHistory, 'No has generado códigos todavía.');
        this.renderHistoryList(this.favoriteList, favorites, this.emptyFavorites, 'Todavía no tienes favoritos.');
    }

    renderHistoryList(container, entries, emptyStateNode, emptyMessage) {
        container.innerHTML = '';
        emptyStateNode.textContent = emptyMessage;
        emptyStateNode.hidden = entries.length > 0;

        entries.forEach((entry) => {
            const article = document.createElement('article');
            article.className = 'history-item';

            const content = document.createElement('div');
            content.className = 'history-item__content';

            const type = document.createElement('p');
            type.className = 'history-item__type';
            type.textContent = entry.typeLabel;

            const title = document.createElement('h3');
            title.className = 'history-item__title';
            title.textContent = entry.label;

            const meta = document.createElement('p');
            meta.className = 'history-item__meta';
            meta.textContent = new Date(entry.createdAt).toLocaleString('es-MX');

            content.append(type, title, meta);

            const actions = document.createElement('div');
            actions.className = 'history-item__actions';

            const loadButton = document.createElement('button');
            loadButton.type = 'button';
            loadButton.className = 'history-btn';
            loadButton.dataset.action = 'load';
            loadButton.dataset.entryId = entry.id;
            loadButton.textContent = 'Usar';

            const favoriteButton = document.createElement('button');
            favoriteButton.type = 'button';
            favoriteButton.className = 'history-btn';
            favoriteButton.dataset.action = 'favorite';
            favoriteButton.dataset.entryId = entry.id;
            favoriteButton.textContent = entry.favorite ? '★' : '☆';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'history-btn history-btn--danger';
            deleteButton.dataset.action = 'delete';
            deleteButton.dataset.entryId = entry.id;
            deleteButton.textContent = '✕';

            actions.append(loadButton, favoriteButton, deleteButton);
            article.append(content, actions);
            container.appendChild(article);
        });
    }

    handleHistoryClick(event) {
        const button = event.target.closest('[data-action]');
        if (!button) {
            return;
        }

        const entryId = button.dataset.entryId;
        const action = button.dataset.action;
        const entry = this.history.find((item) => item.id === entryId);

        if (!entry && action !== 'delete') {
            return;
        }

        if (action === 'load') {
            this.loadHistoryEntry(entry);
        }

        if (action === 'favorite') {
            this.history = toggleFavorite(entryId);
            this.renderHistory();
            this.syncFavoriteButton();
        }

        if (action === 'delete') {
            this.history = deleteHistoryEntry(entryId);
            this.renderHistory();
            this.syncFavoriteButton();
        }
    }

    loadHistoryEntry(entry) {
        this.state.contentType = entry.type;
        this.state.fields[entry.type] = deepClone(entry.fields);
        this.state.options = { ...this.state.options, ...entry.options };
        this.hydrateForm();
        this.saveDraft();
        this.showToast('Configuración cargada desde el historial.', 'info');
        this.generateQr();
    }

    syncFavoriteButton() {
        if (!this.currentPayload) {
            this.favoriteButton.disabled = true;
            this.favoriteButton.textContent = 'Guardar favorito';
            return;
        }

        const matchingEntry = this.findMatchingEntry(this.currentPayload.text);
        this.favoriteButton.disabled = false;
        this.favoriteButton.textContent = matchingEntry?.favorite ? 'Quitar favorito' : 'Guardar favorito';
    }

    toggleCurrentFavorite() {
        if (!this.currentPayload) {
            return;
        }

        const entry = this.findMatchingEntry(this.currentPayload.text);
        if (!entry) {
            return;
        }

        this.history = toggleFavorite(entry.id);
        this.renderHistory();
        this.syncFavoriteButton();
        this.showToast(entry.favorite ? 'Favorito eliminado.' : 'Favorito guardado.', 'success');
    }

    updateOpenActionState() {
        const canOpen = supportsOpenAction(this.currentPayload);
        this.openButton.disabled = !canOpen;
        this.openButton.textContent = this.getOpenActionLabel();
    }

    getOpenActionLabel() {
        if (!this.currentPayload) {
            return 'Abrir acción';
        }

        if (this.currentPayload.type === 'phone') {
            return 'Llamar';
        }

        if (this.currentPayload.type === 'email') {
            return 'Abrir email';
        }

        if (this.currentPayload.type === 'url') {
            return 'Abrir enlace';
        }

        return 'Abrir acción';
    }

    async handleDownloadPng() {
        if (!this.currentRender?.canvas) {
            this.showToast('Primero genera un código QR.', 'error');
            return;
        }

        try {
            await downloadCanvasAsPng(this.currentRender.canvas, this.buildFilename('png'));
            this.showToast('PNG descargado.', 'success');
        } catch {
            this.showToast('No se pudo descargar el PNG.', 'error');
        }
    }

    handleDownloadSvg() {
        if (!this.currentRender?.svgMarkup) {
            this.showToast('Primero genera un código QR.', 'error');
            return;
        }

        try {
            downloadSvg(this.currentRender.svgMarkup, this.buildFilename('svg'));
            this.showToast('SVG descargado.', 'success');
        } catch {
            this.showToast('No se pudo descargar el SVG.', 'error');
        }
    }

    buildFilename(extension) {
        const safeLabel = (this.currentPayload?.label || 'qr').toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
        return `${safeLabel || 'qr'}-${Date.now()}.${extension}`;
    }

    async copyContent() {
        if (!this.currentPayload?.text) {
            this.showToast('Primero genera un código QR.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentPayload.text);
            this.showToast('Contenido QR copiado.', 'success');
        } catch {
            this.showToast('No se pudo copiar el contenido.', 'error');
        }
    }

    openCurrentAction() {
        if (!supportsOpenAction(this.currentPayload)) {
            this.showToast('Este contenido no se puede abrir directamente.', 'info');
            return;
        }

        window.open(this.currentPayload.actionUrl, '_blank', 'noopener,noreferrer');
    }

    clearPreview() {
        this.qrCodeContainer.innerHTML = '';
        this.placeholderText.hidden = false;
        this.actions.hidden = true;
        this.previewMeta.textContent = 'Aún no has generado ningún código.';
        this.currentPayload = null;
        this.currentRender = null;
        this.syncFavoriteButton();
        this.updateOpenActionState();
        this.announce('Vista previa limpiada.');
    }

    saveDraft() {
        saveDraftState(this.state);
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.hidden = false;
        this.announce(message);
    }

    hideError() {
        this.errorMessage.hidden = true;
        this.errorMessage.textContent = '';
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.dataset.type = type;
        this.toast.hidden = false;
        this.toast.classList.add('show');

        window.clearTimeout(this.toastTimeoutId);
        this.toastTimeoutId = window.setTimeout(() => {
            this.toast.classList.remove('show');
            this.toast.hidden = true;
        }, 3200);
    }

    announce(message) {
        this.liveRegion.textContent = message;
    }

    createAmbientEffects() {
        window.setInterval(() => {
            const particle = document.createElement('span');
            particle.className = 'spark-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${4 + Math.random() * 3}s`;
            document.body.appendChild(particle);
            window.setTimeout(() => particle.remove(), 7000);
        }, 2500);
    }
}
