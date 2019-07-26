#!/usr/bin/env sh

# abort on errors
set -e

# make release folder
rm -rf ./releases
mkdir ./releases

# for production
export RELEASE_TYPE="dist"
yarn build
zip -r ./releases/dist.zip ./dist
