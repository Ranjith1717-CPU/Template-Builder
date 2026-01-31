/**
 * Enterprise Word Document Export Module
 * Handles WordML/XML generation for Word compatibility
 */

class WordExportEngine {
    constructor() {
        this.wordMLNamespaces = {
            w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
            r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
            wp: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing'
        };

        this.defaultStyles = this.initializeWordStyles();
        this.firmConfigs = new Map();
    }

    /**
     * Initialize default Word styles for professional documents
     */
    initializeWordStyles() {
        return {
            heading1: {
                fontSize: '16pt',
                bold: true,
                color: '2F5496',
                spacing: { before: '240', after: '120' }
            },
            heading2: {
                fontSize: '14pt',
                bold: true,
                color: '2F5496',
                spacing: { before: '180', after: '90' }
            },
            normal: {
                fontSize: '11pt',
                fontFamily: 'Calibri',
                spacing: { after: '120' }
            },
            tableHeader: {
                fontSize: '11pt',
                bold: true,
                backgroundColor: 'F2F2F2'
            },
            emphasis: {
                italic: true,
                color: '595959'
            }
        };
    }

    /**
     * Register firm-specific configuration
     * @param {string} firmId - Unique firm identifier
     * @param {Object} config - Firm configuration
     */
    registerFirm(firmId, config) {
        this.firmConfigs.set(firmId, {
            name: config.firmName,
            logo: config.logoBase64,
            brandColors: config.colors || { primary: '2F5496', secondary: '595959' },
            customFields: config.customFields || {},
            documentStyles: { ...this.defaultStyles, ...config.styles },
            headerFooter: config.headerFooter || {},
            complianceText: config.complianceText || '',
            fcaNumber: config.fcaNumber || ''
        });
    }

    /**
     * Generate Word-compatible XML document
     * @param {Object} template - Template structure
     * @param {Object} data - Data to populate template
     * @param {string} firmId - Firm configuration ID
     * @returns {string} WordML XML content
     */
    generateWordDocument(template, data, firmId = 'default') {
        const firmConfig = this.firmConfigs.get(firmId) || this.getDefaultConfig();

        const documentXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${this.wordMLNamespaces.w}" xmlns:r="${this.wordMLNamespaces.r}">
    <w:body>
        ${this.generateHeader(template, firmConfig)}
        ${this.generateContent(template, data, firmConfig)}
        ${this.generateFooter(firmConfig)}
        <w:sectPr>
            ${this.generatePageSettings()}
        </w:sectPr>
    </w:body>
</w:document>`;

        return this.formatXML(documentXML);
    }

    /**
     * Generate document header with firm branding
     */
    generateHeader(template, firmConfig) {
        return `
        <w:p>
            <w:pPr>
                <w:pStyle w:val="heading1"/>
                <w:jc w:val="center"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:color w:val="${firmConfig.brandColors.primary}"/>
                    <w:sz w:val="28"/>
                    <w:b/>
                </w:rPr>
                <w:t>${template.name}</w:t>
            </w:r>
        </w:p>

        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="240"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:color w:val="${firmConfig.brandColors.secondary}"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>${firmConfig.name}</w:t>
            </w:r>
        </w:p>`;
    }

    /**
     * Generate main document content from template sections
     */
    generateContent(template, data, firmConfig) {
        let content = '';

        for (const section of template.sections) {
            // Section header
            content += this.generateSectionHeader(section.title, firmConfig);

            // Section fields
            if (section.fields && section.fields.length > 0) {
                if (this.shouldUseTable(section.fields)) {
                    content += this.generateTable(section.fields, data, firmConfig);
                } else {
                    content += this.generateFieldList(section.fields, data, firmConfig);
                }
            }

            content += this.generateSectionSpacer();
        }

        return content;
    }

    /**
     * Generate section header
     */
    generateSectionHeader(title, firmConfig) {
        return `
        <w:p>
            <w:pPr>
                <w:pStyle w:val="heading2"/>
                <w:spacing w:before="240" w:after="120"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:color w:val="${firmConfig.brandColors.primary}"/>
                    <w:b/>
                </w:rPr>
                <w:t>${this.escapeXML(title)}</w:t>
            </w:r>
        </w:p>`;
    }

    /**
     * Generate table for structured data
     */
    generateTable(fields, data, firmConfig) {
        let tableXML = `
        <w:tbl>
            <w:tblPr>
                <w:tblStyle w:val="TableGrid"/>
                <w:tblW w:w="0" w:type="auto"/>
                <w:tblBorders>
                    <w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/>
                    <w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/>
                    <w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/>
                    <w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>
                    <w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/>
                    <w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/>
                </w:tblBorders>
            </w:tblPr>`;

        for (const field of fields) {
            const value = data[field.name] || field.placeholder || '[Not specified]';

            tableXML += `
            <w:tr>
                <w:tc>
                    <w:tcPr>
                        <w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>
                        <w:tcW w:w="2000" w:type="dxa"/>
                    </w:tcPr>
                    <w:p>
                        <w:r>
                            <w:rPr><w:b/></w:rPr>
                            <w:t>${this.escapeXML(field.label)}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="6000" w:type="dxa"/>
                    </w:tcPr>
                    <w:p>
                        <w:r>
                            <w:t>${this.escapeXML(this.formatFieldValue(value, field.fieldType))}</w:t>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>`;
        }

        tableXML += `</w:tbl>`;
        return tableXML;
    }

    /**
     * Generate field list for narrative content
     */
    generateFieldList(fields, data, firmConfig) {
        let content = '';

        for (const field of fields) {
            const value = data[field.name] || field.placeholder || '[Not specified]';

            content += `
            <w:p>
                <w:pPr>
                    <w:spacing w:after="120"/>
                </w:pPr>
                <w:r>
                    <w:rPr><w:b/></w:rPr>
                    <w:t>${this.escapeXML(field.label)}: </w:t>
                </w:r>
                <w:r>
                    <w:t>${this.escapeXML(this.formatFieldValue(value, field.fieldType))}</w:t>
                </w:r>
            </w:p>`;
        }

        return content;
    }

    /**
     * Generate document footer with compliance information
     */
    generateFooter(firmConfig) {
        return `
        <w:p>
            <w:pPr>
                <w:spacing w:before="480"/>
                <w:jc w:val="center"/>
                <w:pBdr>
                    <w:top w:val="single" w:sz="4" w:space="1" w:color="auto"/>
                </w:pBdr>
            </w:pPr>
        </w:p>

        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="60"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="16"/>
                    <w:color w:val="${firmConfig.brandColors.secondary}"/>
                </w:rPr>
                <w:t>${firmConfig.name}</w:t>
            </w:r>
        </w:p>

        ${firmConfig.fcaNumber ? `
        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="60"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="16"/>
                    <w:color w:val="${firmConfig.brandColors.secondary}"/>
                </w:rPr>
                <w:t>Authorised and regulated by the Financial Conduct Authority. FCA Number: ${firmConfig.fcaNumber}</w:t>
            </w:r>
        </w:p>
        ` : ''}

        ${firmConfig.complianceText ? `
        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="120"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="14"/>
                    <w:color w:val="${firmConfig.brandColors.secondary}"/>
                    <w:i/>
                </w:rPr>
                <w:t>${this.escapeXML(firmConfig.complianceText)}</w:t>
            </w:r>
        </w:p>
        ` : ''}`;
    }

    /**
     * Generate page settings
     */
    generatePageSettings() {
        return `
        <w:pgSz w:w="11906" w:h="16838"/>
        <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
        <w:cols w:space="708"/>
        <w:docGrid w:linePitch="360"/>`;
    }

    /**
     * Helper methods
     */
    shouldUseTable(fields) {
        return fields.length > 3 || fields.some(f => f.fieldType === 'number' || f.fieldType === 'currency');
    }

    formatFieldValue(value, fieldType) {
        if (typeof value === 'string' && value.includes('[') && value.includes(']')) {
            return value; // Keep placeholder format
        }

        switch (fieldType) {
            case 'currency':
                return typeof value === 'string' ? value : `£${Number(value).toLocaleString()}`;
            case 'percentage':
                return value.toString().includes('%') ? value : `${value}%`;
            case 'date':
                return new Date(value).toLocaleDateString('en-GB');
            default:
                return value.toString();
        }
    }

    generateSectionSpacer() {
        return `
        <w:p>
            <w:pPr>
                <w:spacing w:after="240"/>
            </w:pPr>
        </w:p>`;
    }

    escapeXML(text) {
        if (!text) return '';
        return text.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    formatXML(xml) {
        return xml.replace(/></g, '>\n<').replace(/^\s*\n/gm, '');
    }

    getDefaultConfig() {
        return {
            name: 'Financial Advisory Firm',
            brandColors: { primary: '2F5496', secondary: '595959' },
            customFields: {},
            documentStyles: this.defaultStyles,
            headerFooter: {},
            complianceText: 'The value of investments can fall as well as rise and you may not get back the amount originally invested.',
            fcaNumber: ''
        };
    }

    /**
     * Export document as Word file
     * @param {string} wordMLContent - WordML XML content
     * @param {string} fileName - File name for download
     */
    downloadWordDocument(wordMLContent, fileName = 'financial-report.docx') {
        // Create a simple Word document package
        const wordDocument = this.createWordDocumentPackage(wordMLContent);

        const blob = new Blob([wordDocument], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Create a minimal Word document package (for demo purposes)
     */
    createWordDocumentPackage(wordMLContent) {
        // In a full implementation, this would create a proper OOXML package
        // For demo, we'll return the XML content with Word headers
        return `MIME-Version: 1.0
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document

${wordMLContent}`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordExportEngine;
}

// Make available globally for web usage
if (typeof window !== 'undefined') {
    window.WordExportEngine = WordExportEngine;
}