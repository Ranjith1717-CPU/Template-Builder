/**
 * Template Engine - Core functionality for intelligent template building
 * Handles pattern recognition, template creation, and document generation
 */

class TemplateEngine {
    constructor() {
        this.patterns = {
            client_name: /(?:Prepared For:|Client:|Name:)\s*([A-Z][a-zA-Z\s]+)/gi,
            date: /(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gi,
            currency: /£([\d,]+(?:\.\d{2})?)/g,
            percentage: /(\d+\.?\d*%)/g,
            provider: /Provider:\s*([A-Z][A-Za-z\s]+)/gi,
            policy_number: /Policy Number:\s*([A-Z0-9\-]+)/gi,
            fund_value: /Fund Value:\s*£([\d,]+(?:\.\d{2})?)/gi,
            annual_charge: /Annual Charge[s]?:\s*(\d+\.?\d*%)/gi,
            risk_profile: /Risk Profile:\s*([A-Za-z]+)/gi,
        };

        this.sampleTemplates = this.initializeSampleTemplates();
    }

    /**
     * Extract structured data from unstructured text
     * @param {string} text - The document text to analyze
     * @returns {Object} Extracted data patterns
     */
    extractPatterns(text) {
        const extracted = {};

        for (const [fieldName, pattern] of Object.entries(this.patterns)) {
            const matches = [...text.matchAll(pattern)];
            if (matches.length > 0) {
                extracted[fieldName] = matches.map(match => match[1] || match[0]);
            }
        }

        return extracted;
    }

    /**
     * Detect document type based on content analysis
     * @param {string} text - Document text
     * @returns {string} Document type identifier
     */
    detectDocumentType(text) {
        const textLower = text.toLowerCase();

        if (textLower.includes('annual review') && textLower.includes('sipp')) {
            return 'annual_review';
        } else if (textLower.includes('suitability report') &&
                   (textLower.includes('pension') || textLower.includes('transfer'))) {
            return 'suitability_report';
        } else {
            return 'generic';
        }
    }

    /**
     * Extract sections from document text
     * @param {string} text - Document text
     * @returns {Array} Array of section titles
     */
    extractSections(text) {
        const sectionPatterns = [
            /^([A-Z][A-Za-z\s&]+)$/gm,
            /^\s*([A-Z][A-Za-z\s&]+)\s*$/gm,
            /^##\s*([A-Z][A-Za-z\s&]+)/gm,
            /^\*\*([A-Z][A-Za-z\s&]+)\*\*/gm
        ];

        const sections = new Set();
        const lines = text.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.length < 3) continue;

            for (const pattern of sectionPatterns) {
                pattern.lastIndex = 0; // Reset regex state
                const match = pattern.exec(trimmedLine);
                if (match) {
                    sections.add(match[1].trim());
                    break;
                }
            }
        }

        return Array.from(sections);
    }

    /**
     * Create template based on document analysis
     * @param {string} text - Document text
     * @param {string} templateName - Custom template name
     * @param {string} expectedType - Expected document type
     * @returns {Object} Generated template
     */
    createTemplate(text, templateName = '', expectedType = 'auto') {
        const documentType = expectedType === 'auto' ? this.detectDocumentType(text) : expectedType;
        const extractedPatterns = this.extractPatterns(text);
        const extractedSections = this.extractSections(text);

        let template;

        switch (documentType) {
            case 'annual_review':
                template = this.createAnnualReviewTemplate(extractedPatterns, extractedSections);
                break;
            case 'suitability_report':
                template = this.createSuitabilityReportTemplate(extractedPatterns, extractedSections);
                break;
            default:
                template = this.createGenericTemplate(extractedPatterns, extractedSections);
        }

        // Override name if provided
        if (templateName) {
            template.name = templateName;
        }

        return template;
    }

    /**
     * Create Annual Review Report template
     * @param {Object} patterns - Extracted patterns
     * @param {Array} sections - Extracted sections
     * @returns {Object} Template object
     */
    createAnnualReviewTemplate(patterns, sections) {
        return {
            id: this.generateId(),
            name: 'Annual Review Report',
            description: 'Template for UK Financial Advisor Annual Review Reports',
            documentType: 'annual_review',
            sections: [
                {
                    title: 'Report Header',
                    order: 1,
                    description: 'Basic report information',
                    fields: [
                        this.createField('client_name', 'text', 'Client Name', true),
                        this.createField('advisor_name', 'text', 'Financial Advisor Name', true),
                        this.createField('report_date', 'date', 'Report Date', true),
                        this.createField('company_name', 'text', 'Advisory Company', true),
                    ]
                },
                {
                    title: 'Introduction',
                    order: 2,
                    description: 'Report purpose and context',
                    fields: [
                        this.createField('last_review_date', 'date', 'Last Review Date', true),
                        this.createField('circumstances_changed', 'choice', 'Circumstances Changed', true, ['Yes', 'No'])
                    ]
                },
                {
                    title: 'Current Circumstances Update',
                    order: 3,
                    description: 'Client\'s current financial position',
                    fields: [
                        this.createField('sipp_current_value', 'number', 'SIPP Current Value (£)', true),
                        this.createField('sipp_previous_value', 'number', 'SIPP Previous Value (£)', true),
                        this.createField('withdrawals_amount', 'number', 'Withdrawals Amount (£)', false),
                        this.createField('isa_current_value', 'number', 'ISA Current Value (£)', false),
                        this.createField('gia_current_value', 'number', 'GIA Current Value (£)', false)
                    ]
                },
                {
                    title: 'Investment Performance',
                    order: 4,
                    description: 'Portfolio performance summary',
                    fields: [
                        this.createField('performance_table', 'table', 'Performance Summary Table', true),
                        this.createField('total_gain_amount', 'number', 'Total Gain Amount (£)', true),
                        this.createField('total_gain_percentage', 'number', 'Total Gain Percentage (%)', true)
                    ]
                },
                {
                    title: 'Risk Profile Assessment',
                    order: 5,
                    description: 'Client risk tolerance and capacity',
                    fields: [
                        this.createField('risk_profile', 'choice', 'Risk Profile', true, ['Conservative', 'Moderate', 'Aggressive']),
                        this.createField('risk_unchanged', 'choice', 'Risk Profile Unchanged', true, ['Yes', 'No']),
                        this.createField('capacity_for_loss', 'choice', 'Capacity for Loss', true, ['Low', 'Medium', 'High'])
                    ]
                },
                {
                    title: 'Investment Holdings Review',
                    order: 6,
                    description: 'Current investment allocations and charges',
                    fields: [
                        this.createField('holdings_table', 'table', 'Current Holdings Table', true),
                        this.createField('total_annual_charges', 'number', 'Total Annual Charges (£)', true)
                    ]
                },
                {
                    title: 'Recommendations',
                    order: 7,
                    description: 'Advisor recommendations and rationale',
                    fields: [
                        this.createField('recommendations_summary', 'text', 'Recommendations Summary', true),
                        this.createField('fund_switches', 'text', 'Fund Switch Recommendations', false),
                        this.createField('cost_savings', 'number', 'Annual Cost Savings (£)', false)
                    ]
                },
                {
                    title: 'Next Steps',
                    order: 8,
                    description: 'Action items and future planning',
                    fields: [
                        this.createField('next_review_date', 'date', 'Next Review Date', true),
                        this.createField('actions_required', 'text', 'Actions Required', true)
                    ]
                }
            ],
            createdDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Create Suitability Report template
     * @param {Object} patterns - Extracted patterns
     * @param {Array} sections - Extracted sections
     * @returns {Object} Template object
     */
    createSuitabilityReportTemplate(patterns, sections) {
        return {
            id: this.generateId(),
            name: 'Suitability Report',
            description: 'Template for UK Financial Advisor Suitability Reports',
            documentType: 'suitability_report',
            sections: [
                {
                    title: 'Report Header',
                    order: 1,
                    description: 'Basic report information',
                    fields: [
                        this.createField('client_name', 'text', 'Client Name', true),
                        this.createField('advisor_name', 'text', 'Financial Advisor Name', true),
                        this.createField('report_date', 'date', 'Report Date', true),
                        this.createField('company_name', 'text', 'Advisory Company', true),
                    ]
                },
                {
                    title: 'Client Circumstances',
                    order: 2,
                    description: 'Client\'s personal and financial situation',
                    fields: [
                        this.createField('age', 'number', 'Client Age', true),
                        this.createField('occupation', 'text', 'Occupation', true),
                        this.createField('annual_income', 'number', 'Annual Income (£)', true),
                        this.createField('monthly_disposable', 'number', 'Monthly Disposable Income (£)', true),
                        this.createField('marital_status', 'choice', 'Marital Status', true, ['Single', 'Married', 'Divorced', 'Widowed']),
                        this.createField('dependents', 'text', 'Dependent Children', false),
                        this.createField('mortgage_balance', 'number', 'Outstanding Mortgage (£)', false)
                    ]
                },
                {
                    title: 'Objectives and Needs',
                    order: 3,
                    description: 'Client\'s financial objectives',
                    fields: [
                        this.createField('retirement_age', 'number', 'Target Retirement Age', true),
                        this.createField('retirement_income_target', 'number', 'Target Retirement Income (£)', true),
                        this.createField('other_objectives', 'text', 'Other Financial Objectives', false),
                        this.createField('time_horizon', 'number', 'Investment Time Horizon (years)', true)
                    ]
                },
                {
                    title: 'Risk Assessment',
                    order: 4,
                    description: 'Detailed risk profiling',
                    fields: [
                        this.createField('attitude_to_risk', 'choice', 'Attitude to Risk', true, ['Conservative', 'Moderate', 'Aggressive']),
                        this.createField('capacity_for_loss', 'choice', 'Capacity for Loss', true, ['Low', 'Medium', 'High']),
                        this.createField('investment_experience', 'choice', 'Investment Experience', true, ['Beginner', 'Intermediate', 'Experienced']),
                        this.createField('loss_scenario_10', 'number', '10% Loss Impact (£)', true),
                        this.createField('loss_scenario_20', 'number', '20% Loss Impact (£)', true),
                        this.createField('loss_scenario_30', 'number', '30% Loss Impact (£)', true)
                    ]
                },
                {
                    title: 'Existing Arrangements Analysis',
                    order: 5,
                    description: 'Current pension and investment arrangements',
                    fields: [
                        this.createField('existing_pensions_table', 'table', 'Existing Pensions Summary', true),
                        this.createField('total_existing_value', 'number', 'Total Existing Value (£)', true),
                        this.createField('current_charges', 'number', 'Current Annual Charges (%)', true)
                    ]
                },
                {
                    title: 'Recommendations',
                    order: 6,
                    description: 'Detailed recommendations and rationale',
                    fields: [
                        this.createField('recommended_strategy', 'text', 'Recommended Strategy', true),
                        this.createField('recommended_allocation', 'text', 'Asset Allocation', true),
                        this.createField('recommended_provider', 'text', 'Recommended Provider', true),
                        this.createField('transfer_value', 'number', 'Transfer Value (£)', true),
                        this.createField('ongoing_contributions', 'number', 'Monthly Contributions (£)', true)
                    ]
                },
                {
                    title: 'Costs and Charges',
                    order: 7,
                    description: 'Fee structure and charges',
                    fields: [
                        this.createField('initial_charges', 'number', 'Initial Charges (£)', true),
                        this.createField('ongoing_charges', 'number', 'Ongoing Charges (%)', true),
                        this.createField('adviser_charges', 'number', 'Adviser Charges (£)', true),
                        this.createField('cost_comparison', 'table', 'Cost Comparison Table', true)
                    ]
                },
                {
                    title: 'Risks and Considerations',
                    order: 8,
                    description: 'Key risks and important considerations',
                    fields: [
                        this.createField('key_risks', 'text', 'Key Risks', true),
                        this.createField('alternatives_considered', 'text', 'Alternatives Considered', true),
                        this.createField('implementation_timeline', 'text', 'Implementation Timeline', true)
                    ]
                }
            ],
            createdDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Create generic template for unknown document types
     * @param {Object} patterns - Extracted patterns
     * @param {Array} sections - Extracted sections
     * @returns {Object} Template object
     */
    createGenericTemplate(patterns, sections) {
        return {
            id: this.generateId(),
            name: 'Generic Financial Document',
            description: 'Generic template for unrecognized financial documents',
            documentType: 'generic',
            sections: [
                {
                    title: 'Document Header',
                    order: 1,
                    description: 'Basic document information',
                    fields: [
                        this.createField('title', 'text', 'Document Title', true),
                        this.createField('date', 'date', 'Document Date', true),
                        this.createField('author', 'text', 'Author', true)
                    ]
                },
                {
                    title: 'Content',
                    order: 2,
                    description: 'Main document content',
                    fields: [
                        this.createField('content', 'text', 'Main Content', true)
                    ]
                }
            ],
            createdDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    /**
     * Create a template field
     * @param {string} name - Field name
     * @param {string} type - Field type
     * @param {string} placeholder - Field placeholder
     * @param {boolean} required - Whether field is required
     * @param {Array} options - Options for choice fields
     * @returns {Object} Field object
     */
    createField(name, type, placeholder, required = true, options = null) {
        return {
            name,
            fieldType: type,
            placeholder,
            required,
            options,
            validation: null,
            formatPattern: null
        };
    }

    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate document from template and data
     * @param {Object} template - Template object
     * @param {Object} data - Form data
     * @returns {string} Generated document content
     */
    generateDocument(template, data) {
        let content = `${template.name}\n`;
        content += '='.repeat(50) + '\n\n';

        for (const section of template.sections.sort((a, b) => a.order - b.order)) {
            content += `${section.title}\n`;
            content += '-'.repeat(section.title.length) + '\n';

            if (section.description) {
                content += `${section.description}\n\n`;
            }

            for (const field of section.fields) {
                const value = data[field.name] || '[NOT PROVIDED]';
                content += `${field.placeholder}: ${value}\n`;
            }

            content += '\n';
        }

        content += `\nGenerated on: ${new Date().toLocaleDateString()}\n`;
        content += `Template Version: ${template.version}\n`;

        return content;
    }

    /**
     * Validate template data
     * @param {Object} template - Template object
     * @param {Object} data - Form data
     * @returns {Object} Validation result
     */
    validateTemplateData(template, data) {
        const errors = [];
        const warnings = [];

        for (const section of template.sections) {
            for (const field of section.fields) {
                if (field.required && (!data[field.name] || data[field.name].trim() === '')) {
                    errors.push(`${field.placeholder} is required`);
                }

                // Type-specific validation
                if (data[field.name]) {
                    if (field.fieldType === 'number' && isNaN(Number(data[field.name]))) {
                        errors.push(`${field.placeholder} must be a valid number`);
                    }

                    if (field.fieldType === 'date' && !this.isValidDate(data[field.name])) {
                        warnings.push(`${field.placeholder} may not be a valid date format`);
                    }
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Check if string is valid date
     * @param {string} dateString - Date string to validate
     * @returns {boolean} Is valid date
     */
    isValidDate(dateString) {
        return !isNaN(Date.parse(dateString));
    }

    /**
     * Initialize sample templates for demo
     * @returns {Object} Sample templates
     */
    initializeSampleTemplates() {
        return {
            annualReviewSample: `
Annual Review Report
Prepared For: Emma Johnson
Prepared By: Shashank Gupta
09 October 2025

Introduction
A regular review report is part of the ongoing service we provide to you. It is a key part of the financial planning process as it allows us to check that the advice we have previously given remains suitable and you remain on track to meet your objectives.

Update on Your Current Circumstances
Since your last review on 1 January 2023, your AJ Bell SIPP has grown from £200,000 to £230,000 as of 6 December 2024. You have taken withdrawals of £5,000 during this period.

Your Risk Profile
As a 'Moderate' investor you are inclined to seek a balance between growth and capital preservation, while being comfortable taking calculated risks for potentially higher long-term rewards.

Review of Your Objectives
1. Review your existing investments to ensure they continue to reflect your needs and objectives. We recommend a fund switch for your AJ Bell SIPP from the current Balanced Portfolio to the AJ Bell Growth Portfolio.
            `,

            suitabilityReportSample: `
Suitability Report
Prepared for: Mr John Doe
10 October 2025

Your Circumstances
You are a 46-year-old Senior IT Manager with a full-time income of £66,000 per annum (£5,500 monthly gross), placing you in the higher rate tax bracket. You have £700 monthly disposable income after expenses.

Your Needs and Objectives
- Retirement planning with target income of £40,000 per annum
- Simplify pension arrangements through consolidation
- Support children's university education

Your Risk Profile
Based on our comprehensive risk assessment across your multiple financial objectives, we have determined objective-specific risk profiles as follows: Retirement planning - Moderate risk approach.

Analysis & Research
This analysis covers your existing arrangements across multiple pension products: Aviva Workplace Pension, Fidelity SIPP, and Royal London Personal Pension.

Recommended Investment Strategy
Transfer existing pensions valued at £268,000 to new abrdn Growth Portfolio SIPP with continued monthly contributions of £750.
            `
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
}