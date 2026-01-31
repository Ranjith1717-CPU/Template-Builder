/**
 * Standard Template Generator
 * Ensures consistent output templates with required sections regardless of input format
 */

class StandardTemplateGenerator {
    constructor() {
        this.standardTemplates = this.initializeStandardTemplates();
    }

    /**
     * Initialize standard template structures based on provided examples
     */
    initializeStandardTemplates() {
        return {
            suitabilityReport: {
                name: "Suitability Report Template",
                type: "suitability_report",
                requiredSections: [
                    {
                        title: "Client Information",
                        mandatory: true,
                        fields: [
                            { name: "client_name", label: "Client Name", fieldType: "text", required: true },
                            { name: "date", label: "Date", fieldType: "date", required: true },
                            { name: "advisor_name", label: "Advisor Name", fieldType: "text", required: true },
                            { name: "firm_name", label: "Firm Name", fieldType: "text", required: true }
                        ]
                    },
                    {
                        title: "Your Circumstances",
                        mandatory: true,
                        fields: [
                            { name: "age", label: "Age", fieldType: "number", required: true },
                            { name: "occupation", label: "Occupation", fieldType: "text", required: true },
                            { name: "annual_income", label: "Annual Income", fieldType: "currency", required: true },
                            { name: "monthly_income", label: "Monthly Income", fieldType: "currency", required: true },
                            { name: "disposable_income", label: "Disposable Income", fieldType: "currency", required: false },
                            { name: "tax_bracket", label: "Tax Bracket", fieldType: "text", required: false },
                            { name: "employment_status", label: "Employment Status", fieldType: "text", required: true }
                        ]
                    },
                    {
                        title: "Your Needs and Objectives",
                        mandatory: true,
                        fields: [
                            { name: "retirement_target_income", label: "Target Retirement Income", fieldType: "currency", required: true },
                            { name: "pension_consolidation", label: "Pension Consolidation Needs", fieldType: "textarea", required: false },
                            { name: "education_funding", label: "Education Funding Requirements", fieldType: "textarea", required: false },
                            { name: "other_objectives", label: "Other Financial Objectives", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Your Risk Profile",
                        mandatory: true,
                        fields: [
                            { name: "risk_assessment_methodology", label: "Risk Assessment Methodology", fieldType: "textarea", required: true },
                            { name: "risk_profile_retirement", label: "Risk Profile - Retirement Planning", fieldType: "select", required: true, options: ["Conservative", "Moderate", "Balanced", "Growth", "Aggressive"] },
                            { name: "risk_capacity", label: "Risk Capacity", fieldType: "textarea", required: false },
                            { name: "risk_tolerance", label: "Risk Tolerance", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Analysis & Research",
                        mandatory: true,
                        fields: [
                            { name: "existing_arrangements", label: "Analysis of Existing Arrangements", fieldType: "textarea", required: true },
                            { name: "pension_products", label: "Current Pension Products", fieldType: "textarea", required: false },
                            { name: "investment_analysis", label: "Investment Analysis", fieldType: "textarea", required: false },
                            { name: "transfer_analysis", label: "Transfer Analysis", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Recommended Investment Strategy",
                        mandatory: true,
                        fields: [
                            { name: "recommended_strategy", label: "Recommended Strategy", fieldType: "textarea", required: true },
                            { name: "pension_transfers", label: "Pension Transfer Recommendations", fieldType: "textarea", required: false },
                            { name: "monthly_contributions", label: "Recommended Monthly Contributions", fieldType: "currency", required: false },
                            { name: "investment_platform", label: "Recommended Platform", fieldType: "text", required: false },
                            { name: "investment_funds", label: "Recommended Investment Funds", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Costs and Charges",
                        mandatory: true,
                        fields: [
                            { name: "advice_fees", label: "Advice Fees", fieldType: "currency", required: true },
                            { name: "ongoing_fees", label: "Ongoing Management Fees", fieldType: "percentage", required: true },
                            { name: "platform_fees", label: "Platform Charges", fieldType: "percentage", required: false },
                            { name: "fund_charges", label: "Investment Fund Charges", fieldType: "percentage", required: false },
                            { name: "total_cost_analysis", label: "Total Cost Analysis", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Next Steps",
                        mandatory: true,
                        fields: [
                            { name: "implementation_steps", label: "Implementation Steps", fieldType: "textarea", required: true },
                            { name: "documentation_required", label: "Documentation Required", fieldType: "textarea", required: false },
                            { name: "timeline", label: "Implementation Timeline", fieldType: "text", required: false },
                            { name: "review_schedule", label: "Review Schedule", fieldType: "text", required: false }
                        ]
                    }
                ]
            },

            annualReview: {
                name: "Annual Review Report Template",
                type: "annual_review",
                requiredSections: [
                    {
                        title: "Client Information",
                        mandatory: true,
                        fields: [
                            { name: "client_name", label: "Client Name", fieldType: "text", required: true },
                            { name: "review_date", label: "Review Date", fieldType: "date", required: true },
                            { name: "advisor_name", label: "Prepared By", fieldType: "text", required: true },
                            { name: "previous_review_date", label: "Last Review Date", fieldType: "date", required: false }
                        ]
                    },
                    {
                        title: "Introduction",
                        mandatory: true,
                        fields: [
                            { name: "review_purpose", label: "Purpose of Review", fieldType: "textarea", required: true },
                            { name: "ongoing_service", label: "Ongoing Service Description", fieldType: "textarea", required: false },
                            { name: "financial_planning_process", label: "Financial Planning Process", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Update on Your Current Circumstances",
                        mandatory: true,
                        fields: [
                            { name: "portfolio_previous_value", label: "Previous Portfolio Value", fieldType: "currency", required: true },
                            { name: "portfolio_current_value", label: "Current Portfolio Value", fieldType: "currency", required: true },
                            { name: "withdrawals_taken", label: "Withdrawals Taken", fieldType: "currency", required: false },
                            { name: "contributions_made", label: "Contributions Made", fieldType: "currency", required: false },
                            { name: "life_changes", label: "Changes in Circumstances", fieldType: "textarea", required: false },
                            { name: "investment_period", label: "Review Period", fieldType: "text", required: true }
                        ]
                    },
                    {
                        title: "Investment Performance Review",
                        mandatory: true,
                        fields: [
                            { name: "performance_summary", label: "Performance Summary", fieldType: "textarea", required: true },
                            { name: "benchmark_comparison", label: "Benchmark Comparison", fieldType: "textarea", required: false },
                            { name: "portfolio_growth", label: "Portfolio Growth", fieldType: "percentage", required: false },
                            { name: "market_commentary", label: "Market Commentary", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Your Risk Profile",
                        mandatory: true,
                        fields: [
                            { name: "current_risk_profile", label: "Current Risk Profile", fieldType: "select", required: true, options: ["Conservative", "Moderate", "Balanced", "Growth", "Aggressive"] },
                            { name: "risk_profile_description", label: "Risk Profile Description", fieldType: "textarea", required: true },
                            { name: "risk_appetite_changes", label: "Changes in Risk Appetite", fieldType: "textarea", required: false },
                            { name: "investment_approach", label: "Investment Approach", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Review of Your Objectives",
                        mandatory: true,
                        fields: [
                            { name: "objectives_review", label: "Review of Objectives", fieldType: "textarea", required: true },
                            { name: "progress_towards_goals", label: "Progress Towards Goals", fieldType: "textarea", required: false },
                            { name: "objective_changes", label: "Changes in Objectives", fieldType: "textarea", required: false },
                            { name: "on_track_assessment", label: "On Track Assessment", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Recommendations",
                        mandatory: true,
                        fields: [
                            { name: "review_recommendations", label: "Investment Review Recommendations", fieldType: "textarea", required: true },
                            { name: "fund_switches", label: "Recommended Fund Switches", fieldType: "textarea", required: false },
                            { name: "portfolio_rebalancing", label: "Portfolio Rebalancing", fieldType: "textarea", required: false },
                            { name: "contribution_changes", label: "Contribution Changes", fieldType: "textarea", required: false },
                            { name: "withdrawal_strategy", label: "Withdrawal Strategy", fieldType: "textarea", required: false }
                        ]
                    },
                    {
                        title: "Next Steps and Actions",
                        mandatory: true,
                        fields: [
                            { name: "immediate_actions", label: "Immediate Actions Required", fieldType: "textarea", required: true },
                            { name: "implementation_timeline", label: "Implementation Timeline", fieldType: "text", required: false },
                            { name: "next_review_date", label: "Next Review Date", fieldType: "date", required: true },
                            { name: "ongoing_monitoring", label: "Ongoing Monitoring", fieldType: "textarea", required: false }
                        ]
                    }
                ]
            }
        };
    }

    /**
     * Generate standard template based on document type, ensuring all required sections
     * @param {string} documentType - Type of document (suitability_report or annual_review)
     * @param {Object} extractedData - Data extracted from unstructured input
     * @returns {Object} Standard template with all required sections
     */
    generateStandardTemplate(documentType, extractedData = {}) {
        const standardTemplate = this.standardTemplates[documentType];
        if (!standardTemplate) {
            throw new Error(`Unknown document type: ${documentType}`);
        }

        // Create template ensuring ALL required sections are present
        const template = {
            id: this.generateTemplateId(),
            name: standardTemplate.name,
            type: standardTemplate.type,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            sections: []
        };

        // Add ALL mandatory sections from standard template
        for (const standardSection of standardTemplate.requiredSections) {
            const section = {
                title: standardSection.title,
                mandatory: standardSection.mandatory,
                fields: []
            };

            // Add ALL required fields for this section
            for (const standardField of standardSection.fields) {
                const field = {
                    name: standardField.name,
                    label: standardField.label,
                    fieldType: standardField.fieldType,
                    required: standardField.required,
                    placeholder: this.generatePlaceholder(standardField.name),
                    value: this.mapExtractedData(extractedData, standardField.name) || ""
                };

                if (standardField.options) {
                    field.options = standardField.options;
                }

                section.fields.push(field);
            }

            template.sections.push(section);
        }

        return template;
    }

    /**
     * Map extracted data to standard fields
     * @param {Object} extractedData - Raw extracted data
     * @param {string} fieldName - Standard field name
     * @returns {string|null} Mapped value or null
     */
    mapExtractedData(extractedData, fieldName) {
        // Direct mapping
        if (extractedData[fieldName]) {
            return extractedData[fieldName];
        }

        // Smart mapping based on field patterns
        const mappings = {
            // Client information mappings
            client_name: ['client_name', 'name', 'prepared_for', 'client'],
            advisor_name: ['advisor_name', 'prepared_by', 'advisor', 'representative'],
            firm_name: ['firm_name', 'company', 'firm', 'organization'],

            // Financial data mappings
            annual_income: ['annual_income', 'yearly_income', 'income', 'salary'],
            monthly_income: ['monthly_income', 'monthly_gross', 'per_month'],
            portfolio_current_value: ['portfolio_value', 'current_value', 'balance', 'fund_value'],
            portfolio_previous_value: ['previous_value', 'starting_value', 'initial_value'],

            // Risk and objectives
            risk_profile_retirement: ['risk_profile', 'risk_level', 'risk_approach', 'investor_type'],
            retirement_target_income: ['target_income', 'retirement_income', 'income_goal'],

            // Dates
            review_date: ['date', 'review_date', 'report_date'],
            previous_review_date: ['last_review', 'previous_review', 'last_meeting'],

            // Performance data
            withdrawals_taken: ['withdrawal', 'withdrawals', 'taken_amount'],
            contributions_made: ['contributions', 'payments', 'deposits']
        };

        // Try mapped field names
        if (mappings[fieldName]) {
            for (const possibleField of mappings[fieldName]) {
                if (extractedData[possibleField]) {
                    return extractedData[possibleField];
                }
            }
        }

        // Fuzzy matching for similar field names
        const extractedKeys = Object.keys(extractedData);
        const similarKey = extractedKeys.find(key =>
            key.toLowerCase().includes(fieldName.toLowerCase()) ||
            fieldName.toLowerCase().includes(key.toLowerCase())
        );

        return similarKey ? extractedData[similarKey] : null;
    }

    /**
     * Generate appropriate placeholder text
     * @param {string} fieldName - Field name
     * @returns {string} Placeholder text
     */
    generatePlaceholder(fieldName) {
        const placeholders = {
            client_name: "Enter client name",
            advisor_name: "Enter advisor name",
            firm_name: "Enter firm name",
            annual_income: "£0,000",
            monthly_income: "£0,000",
            age: "Age",
            occupation: "Job title/occupation",
            risk_profile_retirement: "Select risk profile",
            portfolio_current_value: "£0,000",
            portfolio_previous_value: "£0,000",
            review_date: "DD/MM/YYYY",
            previous_review_date: "DD/MM/YYYY",
            next_review_date: "DD/MM/YYYY",
            withdrawals_taken: "£0,000",
            contributions_made: "£0,000",
            advice_fees: "£0,000",
            ongoing_fees: "0.00%",
            target_retirement_income: "£0,000 per annum"
        };

        return placeholders[fieldName] || `Enter ${fieldName.replace(/_/g, ' ')}`;
    }

    /**
     * Validate that template includes all required sections
     * @param {Object} template - Template to validate
     * @param {string} documentType - Expected document type
     * @returns {Object} Validation result
     */
    validateTemplateCompleteness(template, documentType) {
        const standardTemplate = this.standardTemplates[documentType];
        if (!standardTemplate) {
            return { valid: false, errors: [`Unknown document type: ${documentType}`] };
        }

        const errors = [];
        const missingSections = [];

        // Check all required sections are present
        for (const requiredSection of standardTemplate.requiredSections) {
            const templateSection = template.sections.find(s => s.title === requiredSection.title);

            if (!templateSection) {
                missingSections.push(requiredSection.title);
                errors.push(`Missing required section: ${requiredSection.title}`);
                continue;
            }

            // Check required fields in section
            const missingFields = [];
            for (const requiredField of requiredSection.fields.filter(f => f.required)) {
                const templateField = templateSection.fields.find(f => f.name === requiredField.name);
                if (!templateField) {
                    missingFields.push(requiredField.label);
                }
            }

            if (missingFields.length > 0) {
                errors.push(`Section "${requiredSection.title}" missing required fields: ${missingFields.join(', ')}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            missingSections: missingSections,
            completeness: Math.round(((standardTemplate.requiredSections.length - missingSections.length) / standardTemplate.requiredSections.length) * 100)
        };
    }

    /**
     * Generate template ID
     * @returns {string} Unique template ID
     */
    generateTemplateId() {
        return 'std_template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get list of all standard template types
     * @returns {Array} Available template types
     */
    getAvailableTemplateTypes() {
        return Object.keys(this.standardTemplates).map(key => ({
            key: key,
            name: this.standardTemplates[key].name,
            type: this.standardTemplates[key].type
        }));
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StandardTemplateGenerator;
}

if (typeof window !== 'undefined') {
    window.StandardTemplateGenerator = StandardTemplateGenerator;
}