# GitHub Pages Publish JavaScript Action

![GitHub](https://github.com/LuisEnMarroquin/git-login-action/workflows/Testing/badge.svg)

This action logs you into your source control over SSH.

Note: Please use the latest version avaliable, previous versions may have more errors.

## Inputs

### `ORIGIN`

**Optional** Where you want to log in. Default `github.com`.

### `SSHKEY`

**Required** Your GitHub SSH access key, this is readed from GitHub Secrets.

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

## Example usage

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
    - uses: LuisEnMarroquin/git-login-action@v0.1
      with:
        SSHKEY: ${{ secrets.SSH }}
    - run: ssh -T git@github.com || true
```

## Publish action

Remember to change the version number first for all files

```shell
npm run build # Update your dist/index.js
git add . # Add all files
git commit -m "Use zeit/ncc" # Commit the files
git tag -a -m "Published v0.1" v0.1 # Tag your release
git push --follow-tags # Push commit and tags
```
