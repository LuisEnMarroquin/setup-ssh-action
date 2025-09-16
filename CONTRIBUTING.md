# Contributing to Setup SSH Action

Thank you for your interest in contributing to the Setup SSH Action! This document provides guidelines and information for contributors.

## 🎯 **Getting Started**

### **Prerequisites**

- Node.js 20 or higher
- npm (comes with Node.js)
- Git

### **Development Setup**

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/setup-ssh-action.git
   cd setup-ssh-action
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Build the Action**
   ```bash
   npm run build
   ```

## 🏗️ **Project Structure**

```
setup-ssh-action/
├── src/                    # Source TypeScript files
│   ├── index.ts           # Main entry point
│   ├── types.ts           # Type definitions
│   ├── utils.ts           # Utility functions
│   ├── input-validator.ts # Input validation
│   ├── ssh-manager.ts     # SSH configuration
│   └── git-manager.ts     # Git configuration
├── tests/                 # Unit tests
│   ├── utils.test.ts
│   ├── input-validator.test.ts
│   ├── ssh-manager.test.ts
│   └── git-manager.test.ts
├── dist/                  # Built action (auto-generated)
├── .github/workflows/     # CI/CD workflows
├── index.ts              # Legacy entry point (re-exports src/index)
├── action.yml            # Action metadata
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest test configuration
└── README.md             # Documentation
```

## 🧪 **Testing Guidelines**

### **Writing Tests**

We use Jest for testing. All tests should follow these guidelines:

1. **Test File Naming**: `*.test.ts`
2. **Mock External Dependencies**: Use Jest mocks for `@actions/core`, `fs`, etc.
3. **Cover Edge Cases**: Test both success and failure scenarios
4. **Cross-Platform**: Consider Windows, macOS, and Linux differences

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run type checking
npm run typecheck
```

### **Test Coverage Expectations**

- Aim for >90% code coverage
- All new functions must have tests
- All error conditions should be tested
- Cross-platform behavior should be verified

## 📝 **Coding Standards**

### **TypeScript Guidelines**

- Use strict TypeScript settings
- Define interfaces for all data structures
- Use proper typing (avoid `any` unless absolutely necessary)
- Follow existing code style and patterns

### **Code Style**

- Use clear, descriptive variable and function names
- Add JSDoc comments for public functions
- Keep functions focused and small
- Handle errors gracefully with proper logging

### **Security Considerations**

- Validate all inputs
- Use secure file permissions
- Never log sensitive information (SSH keys, secrets)
- Handle cross-platform security differences

## 🔄 **Pull Request Process**

### **Before Submitting**

1. **Run Tests**: Ensure all tests pass
   ```bash
   npm test
   ```

2. **Type Check**: Verify TypeScript compilation
   ```bash
   npm run typecheck
   ```

3. **Build**: Ensure the action builds successfully
   ```bash
   npm run build
   ```

4. **Update Documentation**: Update README.md if needed

### **PR Requirements**

- ✅ All tests pass
- ✅ TypeScript compiles without errors
- ✅ Code coverage maintained or improved
- ✅ Documentation updated if applicable
- ✅ `dist/` directory is up to date

### **PR Template**

When submitting a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added new tests
- [ ] Updated existing tests
- [ ] All tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] dist/ directory updated with npm run build
```

## 🐛 **Bug Reports**

When reporting bugs, please include:

1. **Environment**: OS, Node.js version, runner type
2. **Action Version**: Which version you're using
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Reproduction Steps**: How to reproduce the issue
6. **Workflow Example**: YAML configuration that reproduces the bug

## 💡 **Feature Requests**

For feature requests, please:

1. **Check Existing Issues**: Make sure it hasn't been requested
2. **Describe the Use Case**: Why this feature is needed
3. **Propose Implementation**: How it might work
4. **Consider Alternatives**: Other ways to achieve the goal

## 🚀 **Release Process**

### **Versioning**

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### **Release Steps**

1. **Update Version**: In `package.json` and throughout codebase
2. **Update CHANGELOG**: Document all changes
3. **Build**: `npm run build`
4. **Test**: Ensure all tests pass
5. **Tag**: Create git tag with version
6. **GitHub Release**: Create release with notes

## 🤝 **Code of Conduct**

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and improve
- Follow GitHub's community guidelines

## 📧 **Getting Help**

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Security Issues**: Contact maintainers privately

## 🙏 **Recognition**

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors graph

Thank you for contributing to making SSH setup easier and more secure for everyone! 🎉