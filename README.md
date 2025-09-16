# Setup SSH - GitHub Action

[![Test](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/test.yml/badge.svg)](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/test.yml)
[![Windows](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/windows.yml/badge.svg)](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/windows.yml)
[![macOS](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/macos.yml/badge.svg)](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/macos.yml)
[![Ubuntu](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/ubuntu.yml/badge.svg)](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/ubuntu.yml)

**A secure, robust, and well-tested GitHub Action that sets up your SSH credentials on `Windows`, `macOS` and `Ubuntu` Virtual Environments.**

## ✨ **Features**

- 🔒 **Enhanced Security**: Input validation, secure file permissions, SSH key format validation
- 🧪 **Comprehensive Testing**: 41 unit tests with full cross-platform coverage
- 🌐 **Cross-Platform**: Fully tested on Windows, macOS, and Ubuntu runners
- 🛡️ **Error Handling**: Robust validation and graceful error recovery
- 📝 **Smart Git Config**: Automatic git configuration from GitHub context
- 🏗️ **TypeScript**: Fully typed, modular, and maintainable codebase

## Example usage

Setup for GitHub

```yml
name: Deployment

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: LuisEnMarroquin/setup-ssh-action@v3.0.0
        with:
          SSHKEY: ${{ secrets.SSH }} # ----- BEGIN RSA PRIVATE KEY----- ...
      - run: ssh -T git@github.com || true
```

Setup for your server

```yml
name: Deployment

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: LuisEnMarroquin/setup-ssh-action@v3.0.0
        with:
          ORIGIN: ${{ secrets.HOST }} # example.com || 8.8.8.8
          SSHKEY: ${{ secrets.SSH }} # ----- BEGIN RSA PRIVATE KEY----- ...
          NAME: production
          PORT: ${{ secrets.PORT }} # 3000
          USER: ${{ secrets.USER }} # admin
      - run: ssh production ls --help
```

## Inputs

| Key      | Value Information                                                                | Required | Validation |
| -------- | -------------------------------------------------------------------------------- | -------- | ---------- |
| `ORIGIN` | Where to log in, can be a **Domain** or **IP address**, defaults to `github.com` | **No**   | Hostname/IP format validation |
| `SSHKEY` | Your SSH access key, it's better to store it on your repository secrets          | **Yes**  | SSH key format validation (RSA, Ed25519, ECDSA, DSS) |
| `NAME`   | How you can refer to the SSH key in the next commands, defaults to `ORIGIN`      | **No**   | Max 255 characters |
| `PORT`   | The port that will be on the SSH config                                          | **No**   | Valid port number (1-65535) |
| `USER`   | The user that will be on the SSH config                                          | **No**   | Max 32 characters |

### 🔐 **Security Notes**

- **SSH Key Storage**: Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`
- **Supported Key Formats**: RSA, Ed25519, ECDSA, DSS (both private and public keys)
- **Input Validation**: All inputs are validated for security and format compliance
- **File Permissions**: SSH files are created with secure permissions (755 for directory, 600 for private key)

## How to release new version

1. Create deployable file

```shell
npm run build
```

2. Create a tag and push it

```shell
git tag -a v3.0.0 -m "Major refactor with improved security, error handling, and comprehensive tests"
git push origin v3.0.0
```

3. Go to releases page and click `Draft a new release`

https://github.com/LuisEnMarroquin/setup-ssh-action/releases

4. Fill with correct data

- Pick current tag
- Pick older tag
- Title: `Released v3.0.0`
- Description: `Paste contents from README.md`

5. Git add, commit and push your changes

```shell
gacp "Major refactor with improved security, error handling, and comprehensive tests"
```

6. Validate that pipelines worked

## Branch Protection and Testing

This repository includes comprehensive testing that runs automatically:

### 🧪 **Testing Workflows**

- **Pull Request Testing**: All PRs to `main` automatically run unit tests, type checking, and build verification
- **Cross-Platform Testing**: Tests run on Ubuntu, Windows, and macOS
- **Code Coverage**: Coverage reports are generated and can be uploaded to Codecov
- **Build Verification**: Ensures `dist/` directory is up to date

### 🛡️ **Recommended Branch Protection Rules**

For optimal security and code quality, configure these branch protection rules for the `main` branch:

1. Go to: `Settings` → `Branches` → `Add rule`
2. Branch name pattern: `main`
3. Enable:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
     - Required status checks:
       - `test / test`
       - `test / build`
       - `Ubuntu / unit-tests`
       - `Windows / unit-tests`
       - `macOS / unit-tests`
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Require linear history**
   - ✅ **Include administrators**

This ensures all code is properly tested before merging to main.

## 🧪 **Development & Testing**

### **Local Development**

```shell
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Build the action
npm run build
```

### **Testing Architecture**

The action includes comprehensive testing with 41 unit tests covering:

- ✅ **Input Validation**: SSH key formats, port numbers, hostname validation
- ✅ **Cross-Platform Logic**: Windows, macOS, and Linux specific behavior
- ✅ **Error Handling**: Invalid inputs, file system errors, permission issues
- ✅ **SSH Configuration**: Config file generation, key storage, permissions
- ✅ **Git Configuration**: GitHub context parsing, fallback behaviors

### **Test Coverage**

- **Utils**: 13 tests covering validation functions and platform detection
- **Input Validator**: 12 tests for input processing and validation
- **SSH Manager**: 8 tests for SSH setup and file operations
- **Git Manager**: 8 tests for git configuration and context handling

## 🔧 **Troubleshooting**

### **Common Issues**

#### **SSH Key Format Errors**
```
Error: Invalid SSH key format. Please provide a valid SSH private key or public key.
```
**Solution**: Ensure your SSH key starts with one of:
- `-----BEGIN RSA PRIVATE KEY-----`
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- `ssh-rsa AAAAB3NzaC1yc2E...`
- `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5...`

#### **Port Validation Errors**
```
Error: Port must be a valid number between 1 and 65535
```
**Solution**: Check that your PORT input is a valid number in the correct range.

#### **Permission Errors**
If you encounter permission errors, the action automatically:
- Sets directory permissions to 755
- Sets private key permissions to 600
- Handles Windows permission differences

#### **Git Configuration Issues**
The action automatically configures git using GitHub context. If git user info is missing:
- Uses pusher information from the push event
- Falls back to commit author information
- Uses GitHub actor as final fallback
- Provides generic fallback if all else fails

### **Debug Mode**

To enable debug logging, add this to your workflow:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

## 📊 **What's New in v3.0.0**

### **🚀 Major Improvements**

- **Complete TypeScript Rewrite**: Modular, type-safe, and maintainable
- **Enhanced Security**: Input validation, SSH key format checking, secure permissions
- **Comprehensive Testing**: 41 unit tests with full cross-platform coverage
- **Better Error Handling**: Clear error messages and graceful failure recovery
- **Smart Git Configuration**: Automatic git setup from GitHub context
- **CI/CD Integration**: Automated testing on all PRs and cross-platform validation

### **🔄 Migration from v2.x**

No changes required! v3.0.0 is fully backward compatible:

```yaml
# Simply update the version number
- uses: LuisEnMarroquin/setup-ssh-action@v3.0.0
  with:
    SSHKEY: ${{ secrets.SSH }}
```

### **🎯 Benefits**

- **More Reliable**: Comprehensive testing ensures stability
- **More Secure**: Enhanced validation and security measures
- **Better Debugging**: Detailed logging and clear error messages
- **Future-Proof**: Modular architecture for easier maintenance
