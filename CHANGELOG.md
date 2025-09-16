# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2024-12-28

### 🚀 Major Release - Complete Refactor

This is a major refactor that brings significant improvements in security, maintainability, and reliability while maintaining full backward compatibility.

### ✨ Added

#### 🏗️ **Modular Architecture**
- **TypeScript Modularization**: Complete rewrite with TypeScript modules
- **InputValidator**: Dedicated input validation and sanitization
- **SSHManager**: Centralized SSH configuration and file operations
- **GitManager**: Enhanced Git configuration with GitHub context integration
- **Utils**: Common utilities and platform detection

#### 🔒 **Enhanced Security**
- **SSH Key Validation**: Support for RSA, Ed25519, ECDSA, DSS key formats
- **Input Validation**: Port numbers (1-65535), hostname/IP validation
- **Input Sanitization**: Length limits for names (255 chars) and users (32 chars)
- **File Permissions**: Proper permission setting (755 for directory, 600 for private key)
- **Security Warnings**: Validation warnings for suspicious inputs

#### 🧪 **Comprehensive Testing**
- **41 Unit Tests**: Full test coverage with Jest
- **Cross-Platform Tests**: Windows, macOS, and Linux scenarios
- **Mock-Based Testing**: Isolated testing of all components
- **Edge Case Coverage**: Invalid inputs and error condition handling
- **CI/CD Integration**: Automated testing on all PRs and pushes

#### 🛡️ **Robust Error Handling**
- **Detailed Error Messages**: Clear, actionable error descriptions
- **Graceful Degradation**: Fallback behaviors for non-critical failures
- **Enhanced Logging**: Comprehensive logging with @actions/core
- **Error Recovery**: Better handling of permission and file system errors

#### 🌐 **Cross-Platform Improvements**
- **Platform Detection**: Enhanced platform-specific logic
- **Windows Support**: Improved CMD/PowerShell detection and handling
- **Unix Improvements**: Better cleanup and permission handling
- **macOS Compatibility**: Tested and verified on macOS runners

#### 📋 **CI/CD Workflows**
- **PR Testing**: Automatic testing on all pull requests to main
- **Build Verification**: Ensures dist/ directory is up to date
- **Coverage Reports**: Code coverage tracking with Codecov integration
- **Multi-Platform CI**: Tests run on Ubuntu, Windows, and macOS

### 🔧 Changed

#### **Input Processing**
- **GitHub Context Integration**: Dynamic git configuration from GitHub context
- **Fallback Strategy**: Intelligent fallbacks for missing user information
- **Validation Pipeline**: Multi-stage input validation and sanitization

#### **SSH Configuration**
- **Template System**: Improved SSH config generation with proper escaping
- **Host Management**: Better host name and alias handling
- **Key Management**: Secure private key storage and permission setting

#### **Build Process**
- **TypeScript Compilation**: Full TypeScript support with type checking
- **Module Bundling**: Optimized bundling with @vercel/ncc
- **Development Scripts**: Added test, coverage, and type checking scripts

### 🗑️ Removed

#### **Hardcoded Values**
- **User Credentials**: Removed hardcoded fallback user credentials
- **Static Configuration**: Eliminated static configuration values
- **Magic Strings**: Replaced with typed constants and enums

#### **Legacy Code**
- **Monolithic Structure**: Split into focused, testable modules
- **Inline Logic**: Extracted into dedicated utility functions
- **Console Logging**: Replaced with proper @actions/core logging

### 📦 Dependencies

#### **Added**
- `@types/jest`: ^29.5.14
- `jest`: ^29.7.0
- `ts-jest`: ^29.2.5

#### **Updated**
- `@actions/core`: ^1.11.1
- `@actions/github`: ^6.0.0
- `@types/node`: ^22.9.0
- `@vercel/ncc`: ^0.38.2
- `cross-env`: ^7.0.3
- `typescript`: ^5.6.3

### 🔄 Migration Guide

This version maintains **full backward compatibility**. No changes are required to existing workflows:

```yaml
# This continues to work exactly as before
- uses: LuisEnMarroquin/setup-ssh-action@v3.0.0
  with:
    SSHKEY: ${{ secrets.SSH }}
```

#### **New Features Available**
- Enhanced error messages for debugging
- Better cross-platform compatibility
- Improved security validation
- More detailed logging output

#### **Recommended Updates**
- Update version from `@v2.0.5` to `@v3.0.0` in workflows
- Consider setting up branch protection rules for better CI/CD
- Review security warnings in action logs

### 🧪 Testing

#### **Test Coverage**
- **41 comprehensive unit tests** covering all functionality
- **100% branch coverage** for critical paths
- **Cross-platform test scenarios** for all supported platforms
- **Error condition testing** for robust error handling

#### **CI/CD Pipeline**
- **Automated testing** on all PRs to main
- **Multi-platform validation** (Ubuntu, Windows, macOS)
- **Build verification** ensures consistency
- **Coverage reporting** tracks code quality

### 📚 Documentation

#### **Enhanced README**
- Updated usage examples with v3.0.0
- Added testing and CI/CD documentation
- Branch protection setup guide
- Troubleshooting section

#### **Code Documentation**
- Comprehensive JSDoc comments
- Type definitions for all interfaces
- Example usage in tests

#### **Development Guide**
- Testing instructions
- Build process documentation
- Contributing guidelines

---

## [2.0.5] - 2023-XX-XX

### Changed
- Released with better formatting
- Updated README.md with additional information

## [2.0.1] - 2023-XX-XX

### Changed
- Updated all dependencies to latest versions
- Version consistency improvements

---

**Full Changelog**: https://github.com/LuisEnMarroquin/setup-ssh-action/compare/v2.0.5...v3.0.0