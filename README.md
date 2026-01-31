# 🤖 Intelligent Template Builder for UK Financial Advisors

> Create, manage, and utilize document templates for UK Financial Advisory reports with AI-powered intelligence.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=github-pages)](https://ranjith1717-cpu.github.io/Template-Builder/)
[![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)](https://github.com/your-username/intelligent-template-builder/releases)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

## 🌟 Features

- **🧠 AI-Powered Analysis**: Automatically extracts patterns and structures from financial documents
- **📋 UK Compliance Ready**: Templates designed for FCA requirements and Consumer Duty regulations
- **🎯 Interactive Interface**: User-friendly web-based platform accessible from any browser
- **📊 Template Management**: Create, edit, export, and share templates with ease
- **🔄 Document Generation**: Fill templates to generate professional documents instantly
- **💾 Local Storage**: All data stays in your browser for privacy and security
- **🚀 GitHub Pages Ready**: Deploy instantly with zero configuration

## 🚀 Quick Start

### Option 1: Use the Live Demo
Visit our [live demo](https://ranjith1717-cpu.github.io/Template-Builder/) and start creating templates immediately!

### Option 2: Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/intelligent-template-builder.git
   cd intelligent-template-builder
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your web browser
   open index.html  # macOS
   start index.html # Windows
   ```

3. **Start creating templates!**
   - Click "Try Interactive Demo" to see sample templates
   - Use "Analyze Document" to create your own templates
   - Generate documents using existing templates

## 📚 Documentation

### Supported Document Types

#### 🔄 Annual Review Reports
- Client portfolio reviews and recommendations
- Investment performance summaries
- Risk profile assessments
- Next steps and action items

#### 📑 Suitability Reports
- Investment advice and pension transfer analysis
- Client circumstances and objectives
- Risk assessment and capacity for loss
- Costs, charges, and recommendations

#### 📄 Generic Financial Documents
- Any structured financial document
- Automatically detects patterns and sections
- Customizable field types and validation

### Key Capabilities

- **Pattern Recognition**: Intelligent extraction of client names, dates, currency values, percentages, and financial data
- **Template Sections**: Automatically identifies document sections and creates structured templates
- **Field Types**: Support for text, numbers, dates, choices, and tables
- **Validation**: Built-in validation for required fields and data types
- **Export/Import**: Share templates between teams and systems

## 🎮 Interactive Features

### 🔧 Document Analysis
```
Upload File → AI Analysis → Template Creation → Ready to Use
```

1. **Upload or Paste**: Support for PDF, TXT, and direct text input
2. **AI Processing**: Intelligent pattern recognition and structure analysis
3. **Template Generation**: Automatic creation of reusable templates
4. **Customization**: Edit fields, sections, and validation rules

### 🎯 Template Management
- **Library View**: Browse and manage all your templates
- **Quick Actions**: Generate, preview, export, or delete templates
- **Statistics**: Track usage and creation metrics
- **Search & Filter**: Find templates by type, date, or content

### 📝 Document Generation
- **Interactive Forms**: User-friendly forms based on template structure
- **Real-time Validation**: Instant feedback on required fields and data types
- **Live Preview**: See your document before downloading
- **Multiple Formats**: Export as text with plan for Word/PDF support

## 🏗️ Technical Architecture

### Frontend Stack
- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with Bootstrap 5 and custom components
- **JavaScript ES6+**: Modular architecture with classes and async/await
- **Local Storage**: Browser-based persistence for privacy

### Core Components

#### Template Engine (`template-engine.js`)
```javascript
// Pattern recognition for financial documents
const patterns = {
    client_name: /(?:Prepared For:|Client:|Name:)\s*([A-Z][a-zA-Z\s]+)/gi,
    currency: /£([\d,]+(?:\.\d{2})?)/g,
    percentage: /(\d+\.?\d*%)/g,
    // ... more patterns
};
```

#### Application Logic (`app.js`)
```javascript
class TemplateBuilderApp {
    // Full-featured application with:
    // - File processing
    // - Template management
    // - Document generation
    // - User interface handling
}
```

#### Styling (`styles.css`)
```css
/* Modern, responsive design with:
 * - Clean Bootstrap 5 integration
 * - Custom components
 * - Dark mode support
 * - Mobile-first approach
 */
```

## 🎨 User Interface

### 🖥️ Desktop Experience
- **Sidebar Navigation**: Quick access to all features
- **Multi-section Layout**: Organized workflow sections
- **Drag & Drop**: Intuitive file upload interface
- **Modal Dialogs**: Non-intrusive previews and actions

### 📱 Mobile Responsive
- **Touch-friendly**: Optimized for mobile interactions
- **Adaptive Layout**: Responsive design for all screen sizes
- **Swipe Navigation**: Mobile-first gesture support

## 🔧 Development

### Project Structure
```
intelligent-template-builder/
├── index.html              # Main application page
├── styles.css              # Application styling
├── template-engine.js      # Core template processing
├── app.js                  # Application logic
├── README.md               # Documentation
├── LICENSE                 # MIT License
├── .gitignore             # Git ignore rules
└── docs/                  # Additional documentation
    ├── DEPLOYMENT.md      # Deployment guide
    ├── API.md             # Technical API docs
    └── CONTRIBUTING.md    # Contribution guidelines
```

### Development Workflow
```bash
# 1. Fork and clone
git clone https://github.com/your-username/intelligent-template-builder.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes and test locally
# Open index.html in browser

# 4. Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# 5. Create Pull Request
```

### GitHub Pages Deployment
The application automatically deploys to GitHub Pages on pushes to the main branch.

## 📊 Use Cases

### For Individual Advisors
- **Standardize Reports**: Create consistent, professional documents
- **Save Time**: Generate reports in minutes, not hours
- **Ensure Compliance**: Built-in UK FCA compliance features
- **Improve Quality**: Structured templates prevent omissions

### For Advisory Firms
- **Team Collaboration**: Share templates across the organization
- **Brand Consistency**: Maintain uniform document standards
- **Regulatory Compliance**: Ensure all reports meet requirements
- **Training Tool**: Standardized processes for new advisors

### For Compliance Teams
- **Template Validation**: Ensure reports include required elements
- **Audit Trails**: Track template usage and modifications
- **Version Control**: Manage template updates and changes
- **Documentation**: Maintain records of template structures

## 🛡️ Privacy & Security

- **Local Storage Only**: All data remains in your browser
- **No Server Dependencies**: Works completely offline after initial load
- **No Data Collection**: Zero tracking or analytics
- **Export Control**: You control your data export and sharing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Quick Contribution Steps
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** locally by opening index.html
5. **Submit** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UK Financial Advisors** who provided requirements and feedback
- **Bootstrap Team** for the excellent UI framework
- **FontAwesome** for the comprehensive icon library
- **GitHub Pages** for free hosting platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/intelligent-template-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/intelligent-template-builder/discussions)
- **Documentation**: [Project Wiki](https://github.com/your-username/intelligent-template-builder/wiki)

---

<div align="center">

**[🚀 Try the Live Demo](https://ranjith1717-cpu.github.io/Template-Builder/) | [📚 Read the Docs](docs/) | [🐛 Report Bug](https://github.com/your-username/intelligent-template-builder/issues)**

Made with ❤️ for the UK Financial Advisory Community

</div>