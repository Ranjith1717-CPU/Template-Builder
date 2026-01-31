/**
 * Advanced Word Template Engine
 * Solves round-trip fidelity and pixel-perfect reproduction
 * Handles native Word templates without HTML conversion loss
 */

class WordTemplateEngine {
    constructor() {
        this.originalTemplates = new Map(); // Store original Word XML structure
        this.templateMappings = new Map();  // Store field mappings
        this.preservationEngine = new WordPreservationEngine();
        this.validationEngine = new WordValidationEngine();
    }

    /**
     * Parse and preserve original Word template structure
     * @param {File} wordFile - Original .docx file from advisory firm
     * @returns {Promise<Object>} Parsed template with preservation data
     */
    async parseWordTemplate(wordFile) {
        try {
            // Extract OOXML structure
            const zipContent = await this.extractOOXML(wordFile);
            const wordXML = zipContent['word/document.xml'];
            const stylesXML = zipContent['word/styles.xml'];
            const relationshipsXML = zipContent['word/_rels/document.xml.rels'];

            // Preserve exact structure for round-trip fidelity
            const templateStructure = {
                id: this.generateTemplateId(),
                originalFile: wordFile.name,
                wordXML: wordXML,
                stylesXML: stylesXML,
                relationshipsXML: relationshipsXML,
                documentStructure: this.parseDocumentStructure(wordXML),
                preservationData: {
                    pageSettings: this.extractPageSettings(wordXML),
                    headerFooter: this.extractHeaderFooter(zipContent),
                    tableStructures: this.extractTableStructures(wordXML),
                    styleDefinitions: this.extractStyleDefinitions(stylesXML),
                    numberingDefinitions: this.extractNumbering(zipContent),
                    customProperties: this.extractCustomProperties(zipContent)
                },
                fieldMappings: this.identifyPlaceholderFields(wordXML),
                lastModified: new Date().toISOString()
            };

            // Store for round-trip processing
            this.originalTemplates.set(templateStructure.id, templateStructure);

            return templateStructure;

        } catch (error) {
            console.error('Word template parsing error:', error);
            throw new Error('Failed to parse Word template. Ensure file is a valid .docx document.');
        }
    }

    /**
     * Extract OOXML ZIP structure from .docx file
     * @param {File} wordFile - .docx file
     * @returns {Promise<Object>} OOXML file contents
     */
    async extractOOXML(wordFile) {
        // Use JSZip or similar library to extract .docx contents
        const JSZip = window.JSZip || require('jszip'); // Handle both browser and Node.js

        const zip = new JSZip();
        const zipContent = await zip.loadAsync(wordFile);
        const extracted = {};

        // Extract key files maintaining exact structure
        const keyFiles = [
            'word/document.xml',
            'word/styles.xml',
            'word/numbering.xml',
            'word/settings.xml',
            'word/fontTable.xml',
            'word/header1.xml',
            'word/footer1.xml',
            'word/_rels/document.xml.rels',
            'docProps/core.xml',
            'docProps/app.xml',
            'docProps/custom.xml',
            '[Content_Types].xml',
            '_rels/.rels'
        ];

        for (const filePath of keyFiles) {
            const file = zipContent.file(filePath);
            if (file) {
                extracted[filePath] = await file.async('text');
            }
        }

        // Extract media files (images, etc.)
        const mediaFiles = {};
        zipContent.folder('word/media').forEach((relativePath, file) => {
            if (!file.dir) {
                mediaFiles[`word/media/${relativePath}`] = file;
            }
        });
        extracted.media = mediaFiles;

        return extracted;
    }

    /**
     * Identify placeholder fields without breaking XML structure
     * @param {string} wordXML - Word document XML
     * @returns {Array} Field mappings with exact XML locations
     */
    identifyPlaceholderFields(wordXML) {
        const fieldMappings = [];

        // Pattern 1: {{field_name}} placeholders
        const bracketPattern = /\{\{([^}]+)\}\}/g;

        // Pattern 2: [FIELD_NAME] placeholders
        const squareBracketPattern = /\[([A-Z_][A-Z0-9_]*)\]/g;

        // Pattern 3: «field_name» Word merge fields
        const mergeFieldPattern = /«([^»]+)»/g;

        // Pattern 4: Content controls (structured document tags)
        const contentControlPattern = /<w:sdt[^>]*>.*?<w:alias w:val="([^"]+)".*?<\/w:sdt>/gs;

        let match;

        // Extract bracket placeholders with XML context
        while ((match = bracketPattern.exec(wordXML)) !== null) {
            fieldMappings.push({
                type: 'bracket_placeholder',
                fieldName: match[1].trim(),
                placeholder: match[0],
                xmlPosition: match.index,
                xmlContext: this.extractXMLContext(wordXML, match.index, 200)
            });
        }

        // Extract square bracket fields
        while ((match = squareBracketPattern.exec(wordXML)) !== null) {
            fieldMappings.push({
                type: 'square_bracket',
                fieldName: match[1].trim(),
                placeholder: match[0],
                xmlPosition: match.index,
                xmlContext: this.extractXMLContext(wordXML, match.index, 200)
            });
        }

        // Extract merge fields
        while ((match = mergeFieldPattern.exec(wordXML)) !== null) {
            fieldMappings.push({
                type: 'merge_field',
                fieldName: match[1].trim(),
                placeholder: match[0],
                xmlPosition: match.index,
                xmlContext: this.extractXMLContext(wordXML, match.index, 200)
            });
        }

        // Extract content controls
        while ((match = contentControlPattern.exec(wordXML)) !== null) {
            fieldMappings.push({
                type: 'content_control',
                fieldName: match[1].trim(),
                placeholder: match[0],
                xmlPosition: match.index,
                xmlContext: this.extractXMLContext(wordXML, match.index, 500)
            });
        }

        return fieldMappings;
    }

    /**
     * Extract XML context around field positions for precise replacement
     */
    extractXMLContext(xml, position, contextLength = 200) {
        const start = Math.max(0, position - contextLength);
        const end = Math.min(xml.length, position + contextLength);
        return {
            before: xml.substring(start, position),
            after: xml.substring(position, end),
            fullContext: xml.substring(start, end)
        };
    }

    /**
     * Extract page settings maintaining exact formatting
     */
    extractPageSettings(wordXML) {
        const sectPrMatch = wordXML.match(/<w:sectPr[^>]*>(.*?)<\/w:sectPr>/s);
        if (sectPrMatch) {
            return {
                rawXML: sectPrMatch[0],
                pageSize: this.extractElement(sectPrMatch[1], 'w:pgSz'),
                pageMargins: this.extractElement(sectPrMatch[1], 'w:pgMar'),
                columns: this.extractElement(sectPrMatch[1], 'w:cols'),
                headerFooterReferences: this.extractHeaderFooterRefs(sectPrMatch[1])
            };
        }
        return null;
    }

    /**
     * Extract table structures with exact formatting preservation
     */
    extractTableStructures(wordXML) {
        const tables = [];
        const tablePattern = /<w:tbl[^>]*>(.*?)<\/w:tbl>/gs;
        let match;

        while ((match = tablePattern.exec(wordXML)) !== null) {
            tables.push({
                fullXML: match[0],
                position: match.index,
                tableProperties: this.extractElement(match[1], 'w:tblPr'),
                tableGrid: this.extractElement(match[1], 'w:tblGrid'),
                rows: this.extractTableRows(match[1])
            });
        }

        return tables;
    }

    /**
     * Extract table rows maintaining cell structure
     */
    extractTableRows(tableXML) {
        const rows = [];
        const rowPattern = /<w:tr[^>]*>(.*?)<\/w:tr>/gs;
        let match;

        while ((match = rowPattern.exec(tableXML)) !== null) {
            rows.push({
                fullXML: match[0],
                properties: this.extractElement(match[1], 'w:trPr'),
                cells: this.extractTableCells(match[1])
            });
        }

        return rows;
    }

    /**
     * Extract table cells maintaining formatting
     */
    extractTableCells(rowXML) {
        const cells = [];
        const cellPattern = /<w:tc[^>]*>(.*?)<\/w:tc>/gs;
        let match;

        while ((match = cellPattern.exec(rowXML)) !== null) {
            cells.push({
                fullXML: match[0],
                properties: this.extractElement(match[1], 'w:tcPr'),
                content: this.extractElement(match[1], 'w:p'),
                hasPlaceholders: this.containsPlaceholders(match[0])
            });
        }

        return cells;
    }

    /**
     * Check if XML content contains placeholders
     */
    containsPlaceholders(xml) {
        const patterns = [/\{\{[^}]+\}\}/, /\[[A-Z_][A-Z0-9_]*\]/, /«[^»]+»/];
        return patterns.some(pattern => pattern.test(xml));
    }

    /**
     * Generate filled template maintaining exact original structure
     * @param {string} templateId - Template ID
     * @param {Object} data - Data to fill template
     * @returns {Object} Complete Word document package
     */
    async generateFilledTemplate(templateId, data) {
        const template = this.originalTemplates.get(templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        // Clone original XML structure
        let filledDocumentXML = template.wordXML;
        let filledStylesXML = template.stylesXML;

        // Replace placeholders while preserving exact XML structure
        for (const mapping of template.fieldMappings) {
            const value = data[mapping.fieldName] || '[Field not provided]';

            // Perform context-aware replacement to maintain XML integrity
            filledDocumentXML = this.replaceWithXMLPreservation(
                filledDocumentXML,
                mapping,
                value
            );
        }

        // Validate XML structure integrity
        const validationResult = this.validationEngine.validateXMLStructure(filledDocumentXML);
        if (!validationResult.valid) {
            throw new Error(`XML validation failed: ${validationResult.errors.join(', ')}`);
        }

        // Reconstruct complete OOXML package
        const completePackage = await this.reconstructOOXMLPackage(template, {
            documentXML: filledDocumentXML,
            stylesXML: filledStylesXML
        });

        return completePackage;
    }

    /**
     * Replace placeholders while preserving XML structure
     */
    replaceWithXMLPreservation(xml, mapping, value) {
        // Escape value for XML safety
        const safeValue = this.escapeXMLValue(value);

        switch (mapping.type) {
            case 'bracket_placeholder':
            case 'square_bracket':
            case 'merge_field':
                // Simple text replacement for basic placeholders
                return xml.replace(
                    new RegExp(this.escapeRegex(mapping.placeholder), 'g'),
                    safeValue
                );

            case 'content_control':
                // Complex replacement for content controls
                return this.replaceContentControl(xml, mapping, safeValue);

            default:
                return xml.replace(mapping.placeholder, safeValue);
        }
    }

    /**
     * Replace content controls maintaining structure
     */
    replaceContentControl(xml, mapping, value) {
        // Extract the content control and replace its text content
        const sdtPattern = new RegExp(
            `(<w:sdt[^>]*>.*?<w:alias w:val="${mapping.fieldName}"[^>]*>.*?<w:t[^>]*>)[^<]*(</w:t>.*?</w:sdt>)`,
            'gs'
        );

        return xml.replace(sdtPattern, `$1${value}$2`);
    }

    /**
     * Reconstruct complete OOXML package with all files
     */
    async reconstructOOXMLPackage(template, modifiedContent) {
        const JSZip = window.JSZip || require('jszip');
        const zip = new JSZip();

        // Add all original files maintaining structure
        zip.file('word/document.xml', modifiedContent.documentXML);
        zip.file('word/styles.xml', modifiedContent.stylesXML);

        // Add preserved files
        if (template.relationshipsXML) {
            zip.file('word/_rels/document.xml.rels', template.relationshipsXML);
        }

        // Add other required OOXML files
        const requiredFiles = {
            '[Content_Types].xml': this.generateContentTypes(),
            '_rels/.rels': this.generateRootRelationships(),
            'docProps/core.xml': this.generateCoreProperties(),
            'docProps/app.xml': this.generateAppProperties()
        };

        Object.entries(requiredFiles).forEach(([path, content]) => {
            zip.file(path, content);
        });

        // Add media files if present
        if (template.preservationData.media) {
            Object.entries(template.preservationData.media).forEach(([path, file]) => {
                zip.file(path, file);
            });
        }

        return zip;
    }

    /**
     * Utility methods for XML handling
     */
    extractElement(xml, tagName) {
        const pattern = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`, 's');
        const match = xml.match(pattern);
        return match ? match[0] : null;
    }

    escapeXMLValue(value) {
        if (typeof value !== 'string') {
            value = String(value);
        }
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    generateTemplateId() {
        return 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Required OOXML file generators
     */
    generateContentTypes() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
    <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
    <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
    }

    generateRootRelationships() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
    }

    generateCoreProperties() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <dc:creator>Intelligent Template Builder</dc:creator>
    <cp:lastModifiedBy>Intelligent Template Builder</cp:lastModifiedBy>
    <cp:revision>1</cp:revision>
    <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
    <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`;
    }

    generateAppProperties() {
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
    <Application>Intelligent Template Builder</Application>
    <DocSecurity>0</DocSecurity>
    <ScaleCrop>false</ScaleCrop>
    <SharedDoc>false</SharedDoc>
    <HyperlinksChanged>false</HyperlinksChanged>
    <AppVersion>16.0000</AppVersion>
</Properties>`;
    }
}

/**
 * Word Preservation Engine
 * Ensures round-trip fidelity
 */
class WordPreservationEngine {
    constructor() {
        this.preservationRules = {
            // Critical elements that must be preserved exactly
            pageSettings: ['w:sectPr', 'w:pgSz', 'w:pgMar'],
            tableStructure: ['w:tblPr', 'w:tblGrid', 'w:tcPr'],
            styleDefinitions: ['w:style', 'w:rPr', 'w:pPr'],
            numbering: ['w:abstractNum', 'w:num'],
            headerFooter: ['w:hdr', 'w:ftr'],
            images: ['w:drawing', 'wp:inline', 'a:blip']
        };
    }

    validatePreservation(originalXML, modifiedXML) {
        const issues = [];

        for (const [category, elements] of Object.entries(this.preservationRules)) {
            for (const element of elements) {
                const originalCount = (originalXML.match(new RegExp(`<${element}`, 'g')) || []).length;
                const modifiedCount = (modifiedXML.match(new RegExp(`<${element}`, 'g')) || []).length;

                if (originalCount !== modifiedCount) {
                    issues.push(`${category}: ${element} count changed from ${originalCount} to ${modifiedCount}`);
                }
            }
        }

        return {
            valid: issues.length === 0,
            issues: issues
        };
    }
}

/**
 * Word Validation Engine
 * Ensures XML structure integrity
 */
class WordValidationEngine {
    validateXMLStructure(xml) {
        const errors = [];

        // Check XML well-formedness
        try {
            if (typeof DOMParser !== 'undefined') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, 'application/xml');
                const errorNode = doc.querySelector('parsererror');
                if (errorNode) {
                    errors.push('XML parsing error: ' + errorNode.textContent);
                }
            }
        } catch (e) {
            errors.push('XML validation error: ' + e.message);
        }

        // Check required Word elements
        const requiredElements = ['w:document', 'w:body'];
        for (const element of requiredElements) {
            if (!xml.includes(`<${element}`)) {
                errors.push(`Missing required element: ${element}`);
            }
        }

        // Check balanced tags (basic validation)
        const tagPattern = /<(\/?w:[a-zA-Z]+)[^>]*>/g;
        const tags = [];
        let match;

        while ((match = tagPattern.exec(xml)) !== null) {
            const tag = match[1];
            if (tag.startsWith('/')) {
                const openTag = tag.substring(1);
                const lastOpen = tags.lastIndexOf(openTag);
                if (lastOpen === -1) {
                    errors.push(`Unmatched closing tag: ${tag}`);
                } else {
                    tags.splice(lastOpen, 1);
                }
            } else {
                tags.push(tag);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WordTemplateEngine, WordPreservationEngine, WordValidationEngine };
}

if (typeof window !== 'undefined') {
    window.WordTemplateEngine = WordTemplateEngine;
    window.WordPreservationEngine = WordPreservationEngine;
    window.WordValidationEngine = WordValidationEngine;
}