#!/bin/sh

set -e
export GIT_HEAD=541b2aa969bba89be003ff5b35e208f61909973e
export TAG_VERSION=v0.0.1

echo "start publish"
pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/element-plus
npm publish
cd -

# cd internal/eslint-config
# npm publish
# cd -

# cd internal/metadata
# pnpm build
# npm publish
# cd -

echo "✅ Publish completed"
