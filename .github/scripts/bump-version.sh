#!/bin/bash
# This script Bumps the Git Version Tag
# Usage:
# ./bump-version.sh <PATCH|MINOR|MAJOR>

if [[ -z "$1" ]]; then
    echo "Usage: '$0 <PATCH|MINOR|MAJOR> <MESSAGE>' to run this command!\n"
    echo "Keep in mind! the message parameter is optional"
    exit 1
fi

VERSION=`git describe --abbrev=0 --tags $(git rev-list --tags --max-count=1) 2> /dev/null`

if [ -z "$VERSION" ]; then
    echo "No tag found!"
    TAG="1.0.0"
else
    MAJOR="${VERSION%%.*}"; VERSION="${VERSION#*.}"
    MINOR="${VERSION%%.*}"; VERSION="${VERSION#*.}"
    PATCH="${VERSION%%.*}"; VERSION="${VERSION#*.}"

    if [ "$1" = "PATCH" ]; then
        PATCH=$((PATCH+1))
    fi
    if [ "$1" = "MINOR" ]; then
        MINOR=$((MINOR+1))
    fi
    if [ "$1" = "MAJOR" ]; then
        MAJOR=$((MAJOR+1))
    fi

    TAG="$MAJOR.$MINOR.$PATCH"
fi

if [ -z "$(git describe --contains $TAG 2> /dev/null)" ]; then
    echo "Bumping Version to $TAG"
    git tag -a $TAG -m "$2"
    git push "https://$GITHUB_ACTOR:$GIT_ACCESS_TOKEN@github.com/$GITHUB_REPOSITORY.git" $TAG -f
else
    echo "Version already Bumped!"
fi

exit 0
