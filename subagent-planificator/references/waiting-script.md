# Waiting Script - File-based coordination without CPU thrash

## Purpose

Specialists need to wait for other specialists to complete their work before proceeding. This script provides a polling mechanism with configurable intervals.

## Core Functions

### wait_for_files

Wait until all specified files exist.

```bash
#!/bin/bash
# wait-for-files.sh

set -e

MAX_WAIT=${MAX_WAIT:-300}      # 5 minutes default
INTERVAL=${INTERVAL:-5}        # 5 seconds between checks
TIMEOUT_EXIT=${TIMEOUT_EXIT:-1}

wait_for_files() {
    local files=("$@")
    local waited=0
    local remaining=()
    
    echo "Waiting for files: ${files[*]}"
    echo "Max wait: ${MAX_WAIT}s, Interval: ${INTERVAL}s"
    
    while [ $waited -lt $MAX_WAIT ]; do
        remaining=()
        
        for file in "${files[@]}"; do
            if [ ! -f "$file" ]; then
                remaining+=("$file")
            fi
        done
        
        if [ ${#remaining[@]} -eq 0 ]; then
            echo "All files present after ${waited}s"
            return 0
        fi
        
        echo "Waiting... (${waited}s elapsed, ${#remaining[@]} files pending)"
        sleep $INTERVAL
        waited=$((waited + INTERVAL))
    done
    
    echo "Timeout after ${waited}s. Missing files:"
    printf '  - %s\n' "${remaining[@]}"
    return $TIMEOUT_EXIT
}

# Usage: wait_for_files file1.md file2.md file3.md
wait_for_files "$@"
```

### wait_for_status

Wait for status.yaml to show all specialists at expected phase.

```bash
#!/bin/bash
# wait-for-status.sh

set -e

SESSION_DIR=${1:-.plans/session-current}
PHASE=${2:-draft}
EXPECTED_STATUS=${3:-complete}
MAX_WAIT=${MAX_WAIT:-300}
INTERVAL=${INTERVAL:-5}

wait_for_status() {
    local status_file="$SESSION_DIR/status.yaml"
    local waited=0
    
    if [ ! -f "$status_file" ]; then
        echo "Status file not found: $status_file"
        return 1
    fi
    
    # Extract specialist names from status.yaml
    local specialists=$(grep -E "^  [a-z].*:$" "$status_file" | sed 's/:$//' | tr -d ' ')
    
    echo "Waiting for specialists to reach $PHASE = $EXPECTED_STATUS"
    echo "Specialists: $specialists"
    
    while [ $waited -lt $MAX_WAIT ]; do
        local all_complete=true
        
        for spec in $specialists; do
            local status=$(grep -A1 "^  $spec:" "$status_file" | grep "$PHASE:" | awk '{print $2}' | tr -d '"')
            
            if [ "$status" != "$EXPECTED_STATUS" ]; then
                all_complete=false
                echo "  $spec: $status (waiting...)"
            else
                echo "  $spec: $status ✓"
            fi
        done
        
        if $all_complete; then
            echo "All specialists complete after ${waited}s"
            return 0
        fi
        
        sleep $INTERVAL
        waited=$((waited + INTERVAL))
    done
    
    echo "Timeout after ${waited}s"
    return 1
}

wait_for_status
```

### wait_with_callback

Wait with optional callback when files appear.

```bash
#!/bin/bash
# wait-with-callback.sh

wait_with_callback() {
    local pattern="$1"
    local callback="$2"
    local max_wait=${3:-300}
    local interval=${4:-5}
    local waited=0
    
    while [ $waited -lt $max_wait ]; do
        local files=$(ls $pattern 2>/dev/null || true)
        
        if [ -n "$files" ]; then
            if [ -n "$callback" ]; then
                eval "$callback \"$files\""
            fi
            return 0
        fi
        
        sleep $interval
        waited=$((waited + interval))
    done
    
    return 1
}

# Example: Wait for any review file, then process it
# wait_with_callback "plans/review-*.md" "process_reviews"
```

## Agent Instructions

### In Specialist Prompts

Include waiting instructions in the specialist dispatch:

```markdown
WAIT PROTOCOL:

Before starting your review, you must wait for all draft files to exist.

1. Check for these files:
   - plans/draft-backend-architect.md
   - plans/draft-frontend-lead.md
   - plans/draft-security-analyst.md

2. If any file is missing:
   - Wait 5 seconds
   - Check again
   - Repeat until all exist

3. If waiting more than 5 minutes, report timeout

You can implement this with:
```bash
for file in plans/draft-*.md; do
    while [ ! -f "$file" ]; do
        echo "Waiting for $file..."
        sleep 5
    done
done
echo "All drafts complete, proceeding with review"
```

DO NOT busy-wait (loop without sleep). Always use sleep between checks.
```

## Polling Intervals

| Situation | Recommended Interval |
|-----------|---------------------|
| Fast drafts (small scope) | 2-3 seconds |
| Normal drafts | 5 seconds |
| Complex drafts | 10-15 seconds |
| Final wait (near timeout) | 1 second |

## Timeout Handling

```markdown
TIMEOUT HANDLING:

If you timeout while waiting:

1. Report what you were waiting for
2. List which files exist and which are missing
3. Suggest:
   - Extending the timeout
   - Checking if other specialists are stuck
   - Proceeding with available information

Do not proceed without dependencies unless explicitly told to.
```

## Status Updates

Specialists should update status.yaml as they progress:

```bash
# Mark draft as complete
update_status() {
    local session_dir="$1"
    local specialist="$2"
    local phase="$3"
    local status="$4"
    
    local status_file="$session_dir/status.yaml"
    
    # Simple status update (requires yq or similar)
    if command -v yq &> /dev/null; then
        yq -i ".status.$specialist.$phase = \"$status\"" "$status_file"
    else
        # Fallback: append status line
        echo "  $phase: \"$status\"" >> "$status_file"
    fi
}

# Usage: update_status ".plans/session-abc" "backend-architect" "draft" "complete"
```

## CPU-Friendly Patterns

### Good
```bash
while [ ! -f "$file" ]; do
    sleep 5
done
```

### Bad
```bash
while [ ! -f "$file" ]; do
    : # No sleep - pegs CPU at 100%
done
```

### Good (with timeout)
```bash
waited=0
while [ $waited -lt 300 ] && [ ! -f "$file" ]; do
    sleep 5
    waited=$((waited + 5))
done
```

## Integration with Orchestrator

The orchestrator can also use these patterns:

```javascript
// Orchestrator checking for completion
async function waitForPhase(sessionDir, phase, specialists, timeout = 300000) {
    const startTime = Date.now();
    const interval = 5000; // 5 seconds
    
    while (Date.now() - startTime < timeout) {
        let allComplete = true;
        
        for (const specialist of specialists) {
            const file = `${sessionDir}/${phase}-${specialist}.md`;
            if (!fs.existsSync(file)) {
                allComplete = false;
                break;
            }
        }
        
        if (allComplete) {
            return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    return false;
}
```
