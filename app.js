/**
 * Main Application Logic for Intelligent Template Builder
 * Handles UI interactions, data management, and user workflow
 */

class TemplateBuilderApp {
    constructor() {
        this.templateEngine = new TemplateEngine();
        this.storageKey = 'intelligentTemplateBuilder';
        this.currentSection = 'welcome';
        this.templates = this.loadTemplates();
        this.statistics = this.loadStatistics();

        this.initializeApp();
        this.updateStatistics();
    }

    /**
     * Initialize the application
     */
    initializeApp() {
        // Set up event listeners
        this.setupEventListeners();

        // Initialize input method toggle
        this.setupInputMethodToggle();

        // Load initial templates
        this.refreshTemplateList();

        // Show welcome section by default
        this.showSection('welcome');

        console.log('🚀 Intelligent Template Builder initialized');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // File input change
        document.getElementById('fileInputElement').addEventListener('change', this.handleFileSelect.bind(this));

        // Input method toggle
        const inputMethodRadios = document.querySelectorAll('input[name="inputMethod"]');
        inputMethodRadios.forEach(radio => {
            radio.addEventListener('change', this.toggleInputMethod.bind(this));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'n':
                        event.preventDefault();
                        this.showSection('analyze');
                        break;
                    case 't':
                        event.preventDefault();
                        this.showSection('templates');
                        break;
                    case 'd':
                        event.preventDefault();
                        this.showSection('demo');
                        break;
                }
            }
        });
    }

    /**
     * Set up input method toggle functionality
     */
    setupInputMethodToggle() {
        this.toggleInputMethod();
    }

    /**
     * Toggle between file upload and text input
     */
    toggleInputMethod() {
        const fileInputChecked = document.getElementById('fileInput').checked;
        const fileUploadArea = document.getElementById('file-upload-area');
        const textInputArea = document.getElementById('text-input-area');

        if (fileInputChecked) {
            fileUploadArea.style.display = 'block';
            textInputArea.style.display = 'none';
        } else {
            fileUploadArea.style.display = 'none';
            textInputArea.style.display = 'block';
        }
    }

    /**
     * Show specific section and hide others
     * @param {string} sectionName - Name of section to show
     */
    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.style.display = 'none');

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionName;
        }

        // Update navigation state
        this.updateNavigationState(sectionName);

        // Perform section-specific initialization
        this.initializeSection(sectionName);
    }

    /**
     * Update navigation visual state
     * @param {string} activeSection - Currently active section
     */
    updateNavigationState(activeSection) {
        const navButtons = document.querySelectorAll('.list-group-item-action');
        navButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Find and activate current button
        navButtons.forEach(button => {
            const onclick = button.getAttribute('onclick');
            if (onclick && onclick.includes(`'${activeSection}'`)) {
                button.classList.add('active');
            }
        });
    }

    /**
     * Initialize section-specific functionality
     * @param {string} sectionName - Section name
     */
    initializeSection(sectionName) {
        switch (sectionName) {
            case 'templates':
                this.refreshTemplateList();
                break;
            case 'generate':
                this.loadGenerateInterface();
                break;
            case 'demo':
                // Demo section is ready
                break;
        }
    }

    /**
     * Handle file selection
     * @param {Event} event - File input change event
     */
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.processFile(file);
    }

    /**
     * Handle file drop
     * @param {Event} event - Drop event
     */
    handleFileDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }

        // Remove drag over styling
        event.target.classList.remove('drag-over');
    }

    /**
     * Handle drag over
     * @param {Event} event - Drag over event
     */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.target.classList.add('drag-over');
    }

    /**
     * Process uploaded file
     * @param {File} file - Uploaded file
     */
    async processFile(file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showAlert('File size too large. Please select a file under 10MB.', 'danger');
            return;
        }

        this.showLoading('Reading file...', 'Extracting text content from your document');

        try {
            let text = '';

            if (file.type === 'text/plain') {
                text = await this.readTextFile(file);
            } else if (file.type === 'application/pdf') {
                text = await this.readPDFFile(file);
            } else {
                // Try to read as text
                text = await this.readTextFile(file);
            }

            this.hideLoading();

            if (text.length < 100) {
                this.showAlert('Document seems too short or couldn\'t be read properly. Please try pasting the text directly.', 'warning');
                return;
            }

            // Set the extracted text in the text area for user review
            document.getElementById('documentText').value = text;

            // Switch to text input mode to show the extracted content
            document.getElementById('textInput').checked = true;
            this.toggleInputMethod();

            this.showAlert('File processed successfully! You can review and edit the extracted text below.', 'success');

        } catch (error) {
            this.hideLoading();
            console.error('File processing error:', error);
            this.showAlert('Error reading file. Please try pasting the text directly.', 'danger');
        }
    }

    /**
     * Read text file
     * @param {File} file - Text file
     * @returns {Promise<string>} File content
     */
    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Read PDF file (basic text extraction)
     * @param {File} file - PDF file
     * @returns {Promise<string>} Extracted text
     */
    async readPDFFile(file) {
        // For demo purposes, we'll use a placeholder
        // In a real implementation, you'd use pdf-lib or similar
        return new Promise((resolve) => {
            resolve(`[PDF Content Placeholder]\n\nThis is a demo placeholder for PDF content.\nIn a production environment, this would contain the actual extracted text from your PDF file.\n\nTo proceed with the demo, please paste your document text in the text area below.`);
        });
    }

    /**
     * Analyze document and create template
     */
    async analyzeDocument() {
        const text = this.getDocumentText();

        if (!text || text.length < 50) {
            this.showAlert('Please provide document content to analyze.', 'warning');
            return;
        }

        const templateName = document.getElementById('templateName').value.trim();
        const documentType = document.getElementById('documentType').value;

        this.showLoading('Analyzing document...', 'Extracting patterns and creating template structure');

        try {
            // Simulate processing time for better UX
            await this.delay(2000);

            const template = this.templateEngine.createTemplate(text, templateName, documentType);

            // Save template
            this.templates[template.id] = template;
            this.saveTemplates();

            // Update statistics
            this.statistics.documentsAnalyzed++;
            this.statistics.lastActivity = new Date().toISOString();
            this.saveStatistics();
            this.updateStatistics();

            this.hideLoading();

            // Show results
            this.displayAnalysisResults(template);

        } catch (error) {
            this.hideLoading();
            console.error('Analysis error:', error);
            this.showAlert('Error analyzing document. Please try again.', 'danger');
        }
    }

    /**
     * Get document text from current input method
     * @returns {string} Document text
     */
    getDocumentText() {
        const fileInputChecked = document.getElementById('fileInput').checked;

        if (fileInputChecked) {
            // File input - text should already be in the text area
            return document.getElementById('documentText').value.trim();
        } else {
            // Text input
            return document.getElementById('documentText').value.trim();
        }
    }

    /**
     * Display analysis results
     * @param {Object} template - Created template
     */
    displayAnalysisResults(template) {
        const resultsDiv = document.getElementById('analysisResults');

        const html = `
            <div class="alert alert-success">
                <h5><i class="fas fa-check-circle me-2"></i>Template Created Successfully!</h5>
                <p class="mb-0">Your document has been analyzed and a template has been created.</p>
            </div>

            <div class="card template-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 class="card-title">${template.name}</h5>
                            <p class="card-text text-muted">${template.description}</p>
                        </div>
                        <span class="badge bg-primary">${template.documentType}</span>
                    </div>

                    <div class="row">
                        <div class="col-md-4">
                            <div class="stat-item">
                                <span class="stat-label">Sections:</span>
                                <span class="stat-value">${template.sections.length}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-item">
                                <span class="stat-label">Fields:</span>
                                <span class="stat-value">${template.sections.reduce((total, section) => total + section.fields.length, 0)}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-item">
                                <span class="stat-label">Version:</span>
                                <span class="stat-value">${template.version}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3">
                        <h6>Template Sections:</h6>
                        <div class="row">
                            ${template.sections.map(section => `
                                <div class="col-md-6 mb-2">
                                    <div class="d-flex align-items-center">
                                        <span class="badge bg-info me-2">${section.order}</span>
                                        <span>${section.title}</span>
                                        <small class="text-muted ms-auto">${section.fields.length} fields</small>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="mt-3 d-flex gap-2">
                        <button class="btn btn-primary" onclick="templateBuilderApp.showSection('templates')">
                            <i class="fas fa-folder me-1"></i>View Template Library
                        </button>
                        <button class="btn btn-success" onclick="templateBuilderApp.useTemplateForGeneration('${template.id}')">
                            <i class="fas fa-file-export me-1"></i>Generate Document
                        </button>
                        <button class="btn btn-info" onclick="templateBuilderApp.previewTemplate('${template.id}')">
                            <i class="fas fa-eye me-1"></i>Preview Template
                        </button>
                    </div>
                </div>
            </div>
        `;

        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';

        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Load templates from storage
     * @returns {Object} Templates object
     */
    loadTemplates() {
        try {
            const saved = localStorage.getItem(this.storageKey + '_templates');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading templates:', error);
            return {};
        }
    }

    /**
     * Save templates to storage
     */
    saveTemplates() {
        try {
            localStorage.setItem(this.storageKey + '_templates', JSON.stringify(this.templates));
        } catch (error) {
            console.error('Error saving templates:', error);
        }
    }

    /**
     * Load statistics from storage
     * @returns {Object} Statistics object
     */
    loadStatistics() {
        try {
            const saved = localStorage.getItem(this.storageKey + '_stats');
            return saved ? JSON.parse(saved) : {
                documentsAnalyzed: 0,
                templatesCreated: 0,
                lastActivity: null
            };
        } catch (error) {
            console.error('Error loading statistics:', error);
            return {
                documentsAnalyzed: 0,
                templatesCreated: 0,
                lastActivity: null
            };
        }
    }

    /**
     * Save statistics to storage
     */
    saveStatistics() {
        try {
            localStorage.setItem(this.storageKey + '_stats', JSON.stringify(this.statistics));
        } catch (error) {
            console.error('Error saving statistics:', error);
        }
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const templateCount = Object.keys(this.templates).length;
        this.statistics.templatesCreated = templateCount;

        document.getElementById('templateCount').textContent = templateCount;
        document.getElementById('documentCount').textContent = this.statistics.documentsAnalyzed;

        const lastActivity = this.statistics.lastActivity
            ? new Date(this.statistics.lastActivity).toLocaleDateString()
            : 'Never';
        document.getElementById('lastActivity').textContent = lastActivity;
    }

    /**
     * Refresh template list display
     */
    refreshTemplateList() {
        const templatesList = document.getElementById('templatesList');
        const templates = Object.values(this.templates);

        if (templates.length === 0) {
            templatesList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No Templates Yet</h5>
                    <p class="text-muted">Create your first template by analyzing a document.</p>
                    <button class="btn btn-primary" onclick="templateBuilderApp.showSection('analyze')">
                        <i class="fas fa-plus me-1"></i>Analyze Document
                    </button>
                </div>
            `;
            return;
        }

        const html = templates.map(template => `
            <div class="template-card">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 class="mb-1">${template.name}</h6>
                        <p class="template-meta mb-1">${template.description}</p>
                        <small class="text-muted">
                            Created: ${new Date(template.createdDate).toLocaleDateString()} |
                            Type: ${template.documentType} |
                            Sections: ${template.sections.length}
                        </small>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="templateBuilderApp.useTemplateForGeneration('${template.id}')">
                                <i class="fas fa-file-export me-1"></i>Generate Document
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="templateBuilderApp.previewTemplate('${template.id}')">
                                <i class="fas fa-eye me-1"></i>Preview
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="templateBuilderApp.exportTemplate('${template.id}')">
                                <i class="fas fa-download me-1"></i>Export
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="templateBuilderApp.deleteTemplate('${template.id}')">
                                <i class="fas fa-trash me-1"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-primary" onclick="templateBuilderApp.useTemplateForGeneration('${template.id}')">
                        <i class="fas fa-file-export me-1"></i>Use Template
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="templateBuilderApp.previewTemplate('${template.id}')">
                        <i class="fas fa-eye me-1"></i>Preview
                    </button>
                </div>
            </div>
        `).join('');

        templatesList.innerHTML = html;
    }

    /**
     * Use template for document generation
     * @param {string} templateId - Template ID
     */
    useTemplateForGeneration(templateId) {
        this.currentTemplateId = templateId;
        this.showSection('generate');
    }

    /**
     * Load generate interface
     */
    loadGenerateInterface() {
        const generateContent = document.getElementById('generateContent');

        if (!this.currentTemplateId || !this.templates[this.currentTemplateId]) {
            generateContent.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5>No Template Selected</h5>
                    <p class="text-muted">Please select a template from the template library to generate a document.</p>
                    <button class="btn btn-primary" onclick="templateBuilderApp.showSection('templates')">
                        <i class="fas fa-folder me-1"></i>View Templates
                    </button>
                </div>
            `;
            return;
        }

        const template = this.templates[this.currentTemplateId];
        this.renderTemplateForm(template);
    }

    /**
     * Render template form for data entry
     * @param {Object} template - Template object
     */
    renderTemplateForm(template) {
        const generateContent = document.getElementById('generateContent');

        const sectionsHtml = template.sections
            .sort((a, b) => a.order - b.order)
            .map(section => `
                <div class="section-header mb-3">
                    <h5><i class="fas fa-chevron-right me-2"></i>${section.title}</h5>
                    <p class="text-muted">${section.description}</p>
                </div>

                <div class="row">
                    ${section.fields.map(field => this.renderFormField(field)).join('')}
                </div>

                <hr class="my-4">
            `).join('');

        const html = `
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>Generate: ${template.name}</h5>
                        <p class="text-muted mb-0">${template.description}</p>
                    </div>
                    <span class="badge bg-primary">${template.documentType}</span>
                </div>
            </div>

            <form id="templateForm">
                ${sectionsHtml}

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="button" class="btn btn-secondary" onclick="templateBuilderApp.showSection('templates')">
                        <i class="fas fa-arrow-left me-1"></i>Back to Templates
                    </button>
                    <button type="button" class="btn btn-success" onclick="templateBuilderApp.generateDocumentFromForm()">
                        <i class="fas fa-file-export me-1"></i>Generate Document
                    </button>
                </div>
            </form>
        `;

        generateContent.innerHTML = html;
    }

    /**
     * Render individual form field
     * @param {Object} field - Field object
     * @returns {string} HTML for field
     */
    renderFormField(field) {
        const requiredStar = field.required ? '<span class="text-danger">*</span>' : '';
        let inputHtml = '';

        switch (field.fieldType) {
            case 'text':
                inputHtml = `<input type="text" class="form-control" id="${field.name}" placeholder="${field.placeholder}">`;
                break;
            case 'number':
                inputHtml = `<input type="number" class="form-control" id="${field.name}" placeholder="${field.placeholder}">`;
                break;
            case 'date':
                inputHtml = `<input type="date" class="form-control" id="${field.name}">`;
                break;
            case 'choice':
                const options = field.options ? field.options.map(option =>
                    `<option value="${option}">${option}</option>`
                ).join('') : '';
                inputHtml = `
                    <select class="form-select" id="${field.name}">
                        <option value="">Select ${field.placeholder}</option>
                        ${options}
                    </select>
                `;
                break;
            case 'table':
                inputHtml = `<textarea class="form-control" id="${field.name}" rows="3" placeholder="Enter table data (one row per line)"></textarea>`;
                break;
            default:
                inputHtml = `<textarea class="form-control" id="${field.name}" rows="3" placeholder="${field.placeholder}"></textarea>`;
        }

        return `
            <div class="col-md-6 mb-3">
                <label for="${field.name}" class="form-label">
                    ${field.placeholder} ${requiredStar}
                    <span class="field-type-badge">${field.fieldType}</span>
                </label>
                ${inputHtml}
            </div>
        `;
    }

    /**
     * Generate document from form data
     */
    generateDocumentFromForm() {
        if (!this.currentTemplateId || !this.templates[this.currentTemplateId]) {
            this.showAlert('Template not found.', 'danger');
            return;
        }

        const template = this.templates[this.currentTemplateId];
        const formData = this.collectFormData(template);

        // Validate form data
        const validation = this.templateEngine.validateTemplateData(template, formData);

        if (!validation.valid) {
            this.showAlert('Please fill in all required fields:<br>' + validation.errors.join('<br>'), 'danger');
            return;
        }

        if (validation.warnings.length > 0) {
            console.warn('Validation warnings:', validation.warnings);
        }

        // Generate document
        const documentContent = this.templateEngine.generateDocument(template, formData);

        // Show preview and download options
        this.showDocumentPreview(documentContent, template.name);
    }

    /**
     * Collect form data
     * @param {Object} template - Template object
     * @returns {Object} Form data
     */
    collectFormData(template) {
        const data = {};

        for (const section of template.sections) {
            for (const field of section.fields) {
                const element = document.getElementById(field.name);
                if (element) {
                    data[field.name] = element.value.trim();
                }
            }
        }

        return data;
    }

    /**
     * Show document preview modal
     * @param {string} content - Document content
     * @param {string} templateName - Template name
     */
    showDocumentPreview(content, templateName) {
        const modal = new bootstrap.Modal(document.createElement('div'));

        const modalHtml = `
            <div class="modal fade" id="documentPreviewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-file-alt me-2"></i>Generated Document Preview
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="document-preview">
                                <pre>${content}</pre>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="templateBuilderApp.downloadDocument('${templateName}', \`${content.replace(/`/g, '\\`')}\`)">
                                <i class="fas fa-download me-1"></i>Download Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('documentPreviewModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modalElement = document.getElementById('documentPreviewModal');
        const bsModal = new bootstrap.Modal(modalElement);
        bsModal.show();
    }

    /**
     * Download document as text file
     * @param {string} templateName - Template name for filename
     * @param {string} content - Document content
     */
    downloadDocument(templateName, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${templateName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        this.showAlert('Document downloaded successfully!', 'success');
    }

    /**
     * Load demo with sample data
     * @param {string} demoType - Type of demo to load
     */
    loadDemo(demoType) {
        let sampleText = '';

        if (demoType === 'annual_review') {
            sampleText = this.templateEngine.sampleTemplates.annualReviewSample;
        } else if (demoType === 'suitability_report') {
            sampleText = this.templateEngine.sampleTemplates.suitabilityReportSample;
        }

        if (sampleText) {
            document.getElementById('documentText').value = sampleText.trim();
            document.getElementById('textInput').checked = true;
            document.getElementById('documentType').value = demoType;
            this.toggleInputMethod();
            this.showSection('analyze');

            this.showAlert(`${demoType === 'annual_review' ? 'Annual Review' : 'Suitability Report'} demo loaded! Click "Analyze & Create Template" to proceed.`, 'info');
        }
    }

    /**
     * Preview template structure
     * @param {string} templateId - Template ID
     */
    previewTemplate(templateId) {
        const template = this.templates[templateId];
        if (!template) return;

        // Create a preview with sample data
        const sampleData = this.generateSampleData(template);
        const previewContent = this.templateEngine.generateDocument(template, sampleData);

        this.showDocumentPreview(previewContent, template.name + ' (Preview)');
    }

    /**
     * Generate sample data for template preview
     * @param {Object} template - Template object
     * @returns {Object} Sample data
     */
    generateSampleData(template) {
        const sampleData = {};

        for (const section of template.sections) {
            for (const field of section.fields) {
                switch (field.fieldType) {
                    case 'text':
                        sampleData[field.name] = `[Sample ${field.placeholder}]`;
                        break;
                    case 'number':
                        sampleData[field.name] = '100000';
                        break;
                    case 'date':
                        sampleData[field.name] = new Date().toISOString().slice(0, 10);
                        break;
                    case 'choice':
                        sampleData[field.name] = field.options ? field.options[0] : 'Option 1';
                        break;
                    default:
                        sampleData[field.name] = `[Sample ${field.fieldType} data]`;
                }
            }
        }

        return sampleData;
    }

    /**
     * Delete template
     * @param {string} templateId - Template ID
     */
    deleteTemplate(templateId) {
        if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
            delete this.templates[templateId];
            this.saveTemplates();
            this.updateStatistics();
            this.refreshTemplateList();
            this.showAlert('Template deleted successfully.', 'success');
        }
    }

    /**
     * Export template
     * @param {string} templateId - Template ID
     */
    exportTemplate(templateId) {
        const template = this.templates[templateId];
        if (!template) return;

        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}_template.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        this.showAlert('Template exported successfully!', 'success');
    }

    /**
     * Export all templates
     */
    exportTemplates() {
        const exportData = {
            templates: this.templates,
            exportDate: new Date().toISOString(),
            version: '2.0.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `template_builder_export_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        this.showAlert('All templates exported successfully!', 'success');
    }

    /**
     * Import templates
     */
    importTemplates() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);

                    if (importData.templates) {
                        // Merge with existing templates
                        Object.assign(this.templates, importData.templates);
                        this.saveTemplates();
                        this.updateStatistics();
                        this.refreshTemplateList();

                        const count = Object.keys(importData.templates).length;
                        this.showAlert(`Successfully imported ${count} template(s)!`, 'success');
                    } else {
                        this.showAlert('Invalid import file format.', 'danger');
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    this.showAlert('Error importing templates. Please check the file format.', 'danger');
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to reset the entire system? This will delete all templates and cannot be undone.')) {
            localStorage.removeItem(this.storageKey + '_templates');
            localStorage.removeItem(this.storageKey + '_stats');

            this.templates = {};
            this.statistics = {
                documentsAnalyzed: 0,
                templatesCreated: 0,
                lastActivity: null
            };

            this.updateStatistics();
            this.refreshTemplateList();
            this.showSection('welcome');

            this.showAlert('System reset successfully!', 'success');
        }
    }

    /**
     * Show loading modal
     * @param {string} message - Loading message
     * @param {string} details - Loading details
     */
    showLoading(message = 'Processing...', details = 'Please wait') {
        document.getElementById('loadingMessage').textContent = message;
        document.getElementById('loadingDetails').textContent = details;

        const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
        modal.show();
    }

    /**
     * Hide loading modal
     */
    hideLoading() {
        const modalElement = document.getElementById('loadingModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }

    /**
     * Show alert message
     * @param {string} message - Alert message
     * @param {string} type - Alert type (success, danger, warning, info)
     */
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at top of current section
        const currentSection = document.getElementById(`${this.currentSection}-section`);
        if (currentSection) {
            currentSection.insertBefore(alertDiv, currentSection.firstChild);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    /**
     * Utility function to create delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML onclick handlers
function showSection(section) {
    templateBuilderApp.showSection(section);
}

function analyzeDocument() {
    templateBuilderApp.analyzeDocument();
}

function handleFileSelect(event) {
    templateBuilderApp.handleFileSelect(event);
}

function handleFileDrop(event) {
    templateBuilderApp.handleFileDrop(event);
}

function handleDragOver(event) {
    templateBuilderApp.handleDragOver(event);
}

function refreshTemplateList() {
    templateBuilderApp.refreshTemplateList();
}

function loadAnnualReviewDemo() {
    templateBuilderApp.loadDemo('annual_review');
}

function loadSuitabilityReportDemo() {
    templateBuilderApp.loadDemo('suitability_report');
}

function exportTemplates() {
    templateBuilderApp.exportTemplates();
}

function importTemplates() {
    templateBuilderApp.importTemplates();
}

function clearAllData() {
    templateBuilderApp.clearAllData();
}

// Initialize app when DOM is loaded
let templateBuilderApp;

document.addEventListener('DOMContentLoaded', function() {
    templateBuilderApp = new TemplateBuilderApp();
});