# Setup SSH - GitHub Action

[![Fail](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/windows.yml/badge.svg)](https://github.com/LuisEnMarroquin)
[![Fail](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/macos.yml/badge.svg)](https://github.com/LuisEnMarroquin)
[![Fail](https://github.com/LuisEnMarroquin/setup-ssh-action/actions/workflows/ubuntu.yml/badge.svg)](https://github.com/LuisEnMarroquin)

This action sets up your SSH key on `Windows`, `macOS` and `Ubuntu` Virtual Environments

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

| Key      | Value Information                                                                | Required |
| -------- | -------------------------------------------------------------------------------- | -------- |
| `ORIGIN` | Where to log in, can be a **Domain** or **IP address**, defaults to `github.com` | **No**   |
| `SSHKEY` | Your SSH access key, it's better to store it on your repository secrets          | **Yes**  |
| `NAME`   | How you can refer to the SSH key in the next commands, defaults to `ORIGIN`      | **No**   |
| `PORT`   | The port that will be on the SSH config                                          | **No**   |
| `USER`   | The user that will be on the SSH config                                          | **No**   |

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

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
