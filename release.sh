#!/usr/bin/env bash

set -e

if [[ $# -eq 0 ]] ; then
    echo 'version not provided: "./release.sh <VERSION>"'
    exit 1
fi

NEW_VERSION=$1
BRANCH_NAME=prepare-version-${NEW_VERSION}


echo " -- preparing master branch"
git fetch
git checkout master
if [ ! -z "$(git status --untracked-files=no --porcelain)" ]; then 
  echo "there are uncommitted changes in tracked files"
  exit 1
fi
git pull origin master


echo " -- updating version"
npm version --no-git-tag-version ${NEW_VERSION}
git commit package.json package-lock.json -m "updated version to ${NEW_VERSION}"
git push origin master


echo " -- creating github release"
hub release create ${NEW_VERSION} -m "${NEW_VERSION}"


echo "Done."