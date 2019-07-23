#!/usr/bin/env sh

# abort on errors
set -e

# make release folder
mkdir ./releases

# for development
RELEASE_TYPE="dev"
yarn build
zip -r ./releases/dev.zip ./dist

# for production
RELEASE_TYPE="dist"
yarn build
zip -r ./releases/dist.zip ./dist
