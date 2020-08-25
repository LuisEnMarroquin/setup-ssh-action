# Setup SSH GitHub Action

![GitHub](https://github.com/LuisEnMarroquin/setup-ssh-action/workflows/Testing/badge.svg)

This action sets up your SSH key on `Windows`, `macOS` and `Ubuntu` Virtual Environments

Please use the latest version avaliable or this action

## Inputs

### `ORIGIN`

**Optional** Where you want to log in. Default `github.com`

### `SSHKEY`

**Required** Your GitHub SSH access key, this is readed from GitHub Secrets.

Your repo secrets are at: `https://github.com/<username>/<repository>/settings/secrets`

### `NAME`

**Optional** How you can refer to the SSH key on following commands, this defaults to `ORIGIN`

### `PORT`

**Optional** Your port that will be on the SSH config

### `USER`

**Optional** Your user that will be on the SSH config

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
    - uses: LuisEnMarroquin/setup-ssh-action@v1.3
      with:
        ORIGIN: 'github.com'
        SSHKEY: ${{ secrets.SSH }}
    - run: ssh -T git@github.com || true
```

You can see more examples [here](https://github.com/LuisEnMarroquin/setup-ssh-action/blob/master/.github/workflows/test.yml)

<!--

## Publish action

Remember to change the version number first for all files

```shell
npm run build # Update your dist/index.js
git add . # Add all files
git commit -m "Use zeit/ncc" # Commit the files
git tag -a -m "Published v1.3" v1.3 # Tag your release
git push --follow-tags # Push commit and tags
```
-->
