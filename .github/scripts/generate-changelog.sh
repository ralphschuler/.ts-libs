#!/bin/bash

# This script generates a changelog based of git tags
# Usage:
# ./generate-changelog.sh

previous_tag=$(git rev-list --max-parents=0 HEAD) # Initialize to the first commit
index=0
for current_tag in $(git tag --sort=-creatordate -l); do

    if [ "$index" -ge "5" ]; then
        exit 0
    fi

    if [ "$previous_tag" != "$current_tag" ]; then
        tag_date=$(git log -1 --pretty=format:'%ad' --date=short ${current_tag})
        printf "## ${current_tag} (${tag_date})\n"
        git log ${previous_tag}...${current_tag} --pretty=format:"* [%h (%an) %s](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commits/%H)" --reverse | grep -v Merge
        printf "\n"
    fi

    previous_tag=${current_tag}
    let "index++"
done

exit 0
