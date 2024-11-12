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
      - uses: LuisEnMarroquin/setup-ssh-action@v2.0.1
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
      - uses: LuisEnMarroquin/setup-ssh-action@v2.0.1
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
git tag -a v2.0.3 -m "Updating all dependencies to latest"
git push origin v2.0.3
```

3. Go to releases page and click `Draft a new release`

https://github.com/LuisEnMarroquin/setup-ssh-action/releases

4. Fill with correct data

- Title: `Released v2.0.3`
- Description: `Paste contents from README.md`

5. Git add, commit and push your changes

```shell
gacp Updating all dependencies to latest
```

6. Validate that pipelines worked
