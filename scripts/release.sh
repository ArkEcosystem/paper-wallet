#!/usr/bin/env sh

# abort on errors
set -e

# make release folder
mkdir ./releases

# for production
RELEASE_TYPE="dist"
yarn build
zip -r ./releases/dist.zip ./dist
