#!/bin/bash
# Migration script for all 6 missing chapters (22-27)

echo "========================================="
echo "Migrating Chapters 22-27"
echo "========================================="
echo ""

for chapter in 22 23 24 25 26 27; do
    echo "Processing Chapter $chapter..."
    if [ -f "scripts/update-chapter-${chapter}-content.js" ]; then
        node "scripts/update-chapter-${chapter}-content.js"
        if [ $? -eq 0 ]; then
            echo "✓ Chapter $chapter migrated successfully"
        else
            echo "✗ Chapter $chapter failed"
        fi
    else
        echo "✗ Migration script for Chapter $chapter not found"
    fi
    echo ""
done

echo "========================================="
echo "Migration complete!"
echo "========================================="
