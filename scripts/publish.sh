#!/bin/bash

# Publish script for Enact Protocol packages
set -e

PACKAGE=$1

if [ -z "$PACKAGE" ]; then
    echo "Usage: $0 [cli|mcp-server|all]"
    exit 1
fi

echo "🚀 Publishing Enact Protocol packages..."

case $PACKAGE in
    "cli")
        echo "📦 Building and publishing CLI package..."
        npm run build:cli
        npm publish --workspace=packages/cli
        echo "✅ CLI package published successfully!"
        ;;
    "mcp-server")
        echo "📦 Building and publishing MCP Server package..."
        npm run build:mcp
        npm publish --workspace=packages/mcp-server
        echo "✅ MCP Server package published successfully!"
        ;;
    "all")
        echo "📦 Building and publishing all packages..."
        npm run build
        npm run publish:all
        echo "✅ All packages published successfully!"
        ;;
    *)
        echo "❌ Invalid package name. Use: cli, mcp-server, or all"
        exit 1
        ;;
esac

echo "🎉 Publishing complete!"
