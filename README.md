# Setup SSH GitHub Action

![GitHub](https://github.com/LuisEnMarroquin/setup-ssh-action/workflows/Windows/badge.svg)
![GitHub](https://github.com/LuisEnMarroquin/setup-ssh-action/workflows/macOS/badge.svg)
![GitHub](https://github.com/LuisEnMarroquin/setup-ssh-action/workflows/Ubuntu/badge.svg)

This action sets up your SSH key on `Windows`, `macOS` and `Ubuntu` Virtual Environments

## Inputs

### `ORIGIN`

**Optional** Where you want to log in, can be a **Domain** or an **IP address**. Default `github.com`

### `SSHKEY`

**Required** Your GitHub SSH access key, you can store it on your repository secrets

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

### `NAME`

**Optional** How you can refer to the SSH key on the following commands, defaults to `ORIGIN` variable

### `PORT`

**Optional** The port that will be on the SSH config

### `USER`

**Optional** The user that will be on the SSH config

## Example usage

Setup for GitHub

```yml
name: Deployment

on:
  push:
    branches:
    - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: LuisEnMarroquin/setup-ssh-action@v1.8
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
    - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: LuisEnMarroquin/setup-ssh-action@v1.8
      with:
        ORIGIN: ${{ secrets.HOST }} # example.com || 8.8.8.8
        SSHKEY: ${{ secrets.SSH }} # ----- BEGIN RSA PRIVATE KEY----- ...
        NAME: production
        PORT: ${{ secrets.PORT }} # 3000
        USER: ${{ secrets.USER }} # admin
    - run: ssh production ls --help
```


You can see more examples [here](https://github.com/LuisEnMarroquin/setup-ssh-action/blob/master/.github/workflows)

<!--

## Publish action

Remember to change the version number first for all files

```shell
npm run build # Update your dist/index.js
gac Use zeit/ncc # Add and commit with message
git tag -a -m "Published v1.8" v1.8 # Tag your release
git push --follow-tags # Push commit and tags
```

-->
