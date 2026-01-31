# Intelligent Template Builder for UK Financial Advisors

## Overview
A comprehensive system designed to extract, analyze, and manage document templates from UK financial advisor reports. The system intelligently identifies patterns in unstructured documents and creates reusable templates for streamlined report generation.

## System Architecture

### Core Components

#### 1. TemplateExtractor
- **Purpose**: Extracts structured data patterns from unstructured text
- **Key Features**:
  - Regex-based pattern matching for financial data
  - Client information extraction
  - Currency and percentage identification
  - Date format recognition
  - Section header detection

#### 2. TemplateGenerator
- **Purpose**: Converts extracted patterns into structured templates
- **Capabilities**:
  - Annual Review Report template creation
  - Suitability Report template creation
  - Generic template generation for unknown documents
  - Field type classification (text, number, date, table, choice)

#### 3. TemplateManager
- **Purpose**: Handles template storage, retrieval, and management
- **Functions**:
  - JSON-based template persistence
  - Template CRUD operations
  - Template versioning support
  - Multi-template management

#### 4. IntelligentTemplateBuilder
- **Purpose**: Main orchestrator providing user interface
- **Features**:
  - Interactive command-line interface
  - Document type detection
  - Template filling workflow
  - Demo mode with sample data

## Data Models

### TemplateField
```python
@dataclass
class TemplateField:
    name: str              # Field identifier
    field_type: str        # text, number, date, table, choice
    placeholder: str       # User-friendly field label
    required: bool         # Whether field is mandatory
    options: List[str]     # For choice fields
    validation: str        # Validation rules
    format_pattern: str    # Display format pattern
```

### TemplateSection
```python
@dataclass
class TemplateSection:
    title: str             # Section heading
    fields: List[TemplateField]  # Fields in this section
    order: int             # Display order
    description: str       # Section explanation
```

### DocumentTemplate
```python
@dataclass
class DocumentTemplate:
    id: str                # Unique identifier
    name: str              # Template name
    description: str       # Template description
    document_type: str     # Type classification
    sections: List[TemplateSection]  # Template sections
    created_date: str      # Creation timestamp
    version: str           # Version number
```

## Supported Document Types

### 1. Annual Review Report
**Key Sections**:
- Report Header (Client details, advisor info, dates)
- Introduction (Review context and purpose)
- Current Circumstances Update (Financial position changes)
- Investment Performance (Portfolio performance metrics)
- Risk Profile Assessment (Risk tolerance evaluation)
- Investment Holdings Review (Current allocations and charges)
- Recommendations (Advisor suggestions and rationale)
- Next Steps (Action items and future planning)

**Field Examples**:
- Client name, advisor name, report date
- SIPP values, ISA values, withdrawals
- Performance percentages and monetary gains
- Risk profile classifications
- Holdings tables and charge summaries

### 2. Suitability Report
**Key Sections**:
- Report Header (Basic information)
- Client Circumstances (Personal and financial situation)
- Objectives and Needs (Financial goals)
- Risk Assessment (Detailed risk profiling)
- Existing Arrangements Analysis (Current pension review)
- Recommendations (Strategy and provider suggestions)
- Costs and Charges (Fee structure)
- Risks and Considerations (Warnings and alternatives)

**Field Examples**:
- Age, occupation, income details
- Retirement targets and timelines
- Risk scenarios and loss impacts
- Existing pension values and charges
- Transfer recommendations and costs

## Pattern Recognition System

### Financial Data Patterns
```python
patterns = {
    'client_name': r'(?:Prepared For:|Client:|Name:)\s*([A-Z][a-zA-Z\s]+)',
    'date': r'(\d{1,2}\s+(?:January|February|...|December)\s+\d{4})',
    'currency': r'£([\d,]+(?:\.\d{2})?)',
    'percentage': r'(\d+\.?\d*%)',
    'provider': r'Provider:\s*([A-Z][A-Za-z\s]+)',
    'policy_number': r'Policy Number:\s*([A-Z0-9\-]+)',
    'fund_value': r'Fund Value:\s*£([\d,]+(?:\.\d{2})?)',
    'annual_charge': r'Annual Charge[s]?:\s*(\d+\.?\d*%)',
    'risk_profile': r'Risk Profile:\s*([A-Za-z]+)',
}
```

### Document Type Detection
- Annual Review: Keywords "annual review" + "sipp"
- Suitability Report: Keywords "suitability report" + ("pension" OR "transfer")
- Generic fallback for unrecognized documents

## Usage Instructions

### Command Line Interface
```bash
# Analyze a document file
python intelligent_template_builder.py --file "document.pdf"

# Run interactive mode
python intelligent_template_builder.py --interactive

# Demo mode (default)
python intelligent_template_builder.py
```

### Interactive Mode Options
1. **Analyze new document**
   - Load from file or paste text
   - Automatic document type detection
   - Template generation and storage

2. **View existing templates**
   - List all saved templates
   - Display template metadata
   - Section and field summaries

3. **Generate document from template**
   - Select template
   - Fill fields interactively
   - Generate formatted output

4. **Delete template**
   - Select template to remove
   - Confirmation required
   - Permanent deletion

5. **Exit**
   - Safe shutdown
   - Template persistence

## Template Storage Format

Templates are stored in JSON format (`templates.json`):
```json
{
  "templates": [
    {
      "id": "uuid-string",
      "name": "Template Name",
      "description": "Template Description",
      "document_type": "annual_review",
      "sections": [
        {
          "title": "Section Name",
          "order": 1,
          "description": "Section Description",
          "fields": [
            {
              "name": "field_name",
              "field_type": "text",
              "placeholder": "Field Label",
              "required": true,
              "options": null,
              "validation": null,
              "format_pattern": null
            }
          ]
        }
      ],
      "created_date": "2025-01-31T...",
      "version": "1.0"
    }
  ],
  "last_updated": "2025-01-31T..."
}
```

## Implementation Steps Followed

### Phase 1: Document Analysis
1. **PDF Content Extraction**: Read and analyzed the provided financial advisor reports
2. **Structure Identification**: Identified common sections, fields, and patterns
3. **Data Pattern Recognition**: Developed regex patterns for financial data extraction

### Phase 2: System Design
1. **Data Model Definition**: Created dataclasses for templates, sections, and fields
2. **Component Architecture**: Designed modular system with clear responsibilities
3. **Template Type Classification**: Defined specific templates for different report types

### Phase 3: Core Development
1. **Pattern Extractor**: Implemented regex-based data extraction
2. **Template Generator**: Built template creation logic for different document types
3. **Template Manager**: Developed CRUD operations and persistence layer

### Phase 4: User Interface
1. **CLI Implementation**: Created command-line argument handling
2. **Interactive Mode**: Built user-friendly menu-driven interface
3. **Demo Mode**: Implemented demonstration with sample templates

### Phase 5: Integration
1. **Document Type Detection**: Automatic classification of input documents
2. **Template Filling**: Interactive data collection and document generation
3. **Error Handling**: Robust error handling and user feedback

## Key Features

### Intelligence Capabilities
- **Automatic Pattern Recognition**: Identifies financial data patterns without manual configuration
- **Document Type Classification**: Automatically detects Annual Review vs Suitability Reports
- **Field Type Inference**: Determines appropriate field types (text, number, date, etc.)
- **Section Structure Analysis**: Identifies logical document sections and hierarchies

### User Experience
- **Interactive CLI**: User-friendly command-line interface
- **Template Reuse**: Save and reuse templates across documents
- **Flexible Input**: Support for file input or direct text pasting
- **Guided Filling**: Step-by-step template completion process

### Technical Robustness
- **JSON Persistence**: Reliable template storage and retrieval
- **Error Handling**: Comprehensive error handling and user feedback
- **Modular Design**: Clean separation of concerns for easy maintenance
- **Extensible Architecture**: Easy to add new document types and patterns

## Future Enhancement Opportunities

### Technical Improvements
- **Machine Learning Integration**: Use NLP models for better pattern recognition
- **PDF Direct Processing**: Direct PDF parsing without manual text extraction
- **Word Document Export**: Generate Word documents with proper formatting
- **Advanced Validation**: Field-specific validation rules and error checking

### Feature Additions
- **Template Sharing**: Import/export templates between systems
- **Batch Processing**: Process multiple documents simultaneously
- **Version Control**: Track template changes and rollback capabilities
- **Custom Fields**: Allow users to define custom field types

### Integration Possibilities
- **CRM Integration**: Connect with customer relationship management systems
- **Cloud Storage**: Store templates in cloud-based systems
- **API Development**: REST API for programmatic access
- **Web Interface**: Browser-based user interface for easier access

### UK Financial Services Specific
- **FCA Compliance**: Add FCA-specific validation and requirements
- **GDPR Compliance**: Enhanced data protection and privacy features
- **Regulatory Updates**: Automatic updates for changing regulations
- **Multi-firm Support**: Support for different advisory firms' requirements

## File Structure

```
/mnt/c/Users/ranjith/
├── intelligent_template_builder.py    # Main application
├── TEMPLATE_BUILDER_DOCUMENTATION.md  # This documentation
├── TEMPLATE_BUILDER_MEMORY.tmp        # System memory file
├── templates.json                     # Template storage (created at runtime)
└── generated_documents/               # Output directory (created at runtime)
```

## Dependencies

### Required Python Libraries
- `json`: Template serialization and storage
- `re`: Regular expression pattern matching
- `argparse`: Command-line argument parsing
- `typing`: Type hints and annotations
- `dataclasses`: Data structure definitions
- `datetime`: Timestamp handling
- `uuid`: Unique identifier generation

### System Requirements
- Python 3.7 or higher
- File system write permissions
- Command-line access

## Testing Approach

### Unit Testing (Recommended)
- Test pattern extraction with sample financial data
- Validate template generation for different document types
- Test template storage and retrieval operations
- Verify interactive mode functionality

### Integration Testing
- End-to-end document analysis workflow
- Template creation and usage scenarios
- Error handling and recovery testing
- Multi-template management testing

### User Acceptance Testing
- Real financial advisor usage scenarios
- Template accuracy and completeness validation
- User interface usability testing
- Performance testing with large documents

## Compliance Considerations

### UK Financial Services
- **FCA Regulations**: Ensure templates support required disclosures
- **Consumer Duty**: Include necessary client protection elements
- **Data Protection**: GDPR compliance for client information handling
- **Record Keeping**: Audit trail for template usage and modifications

### Quality Assurance
- **Template Accuracy**: Validation against regulatory requirements
- **Data Integrity**: Ensure accurate data extraction and storage
- **Version Control**: Track template changes for compliance
- **User Training**: Proper documentation and training materials

## Performance Characteristics

### Expected Performance
- **Document Analysis**: < 5 seconds for typical financial reports
- **Template Generation**: < 1 second for standard templates
- **Template Storage**: < 100ms for save/load operations
- **Interactive Mode**: Real-time response for user interactions

### Scalability Considerations
- **Template Storage**: JSON format suitable for hundreds of templates
- **Memory Usage**: Minimal memory footprint for typical usage
- **Concurrent Usage**: Single-user design, not optimized for concurrent access
- **Large Documents**: Efficient processing of documents up to 1MB+

This documentation provides a comprehensive overview of the Intelligent Template Builder system, including its architecture, usage instructions, and future enhancement possibilities. The system is designed to be robust, user-friendly, and specifically tailored for UK financial advisory workflows.