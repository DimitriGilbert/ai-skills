# OpenTUI Animations

## Timeline Animation System

OpenTUI uses a Timeline-based animation system for smooth, performant animations.

## Basic Animation

```typescript
import { Timeline } from "@opentui/core"

const box = new BoxRenderable()

const timeline = new Timeline({
  duration: 1000,        // ms
  easing: (t) => t,      // linear
  loop: false,           // don't repeat
  autoplay: false,       // don't start automatically
})

timeline.to(box, {
  backgroundColor: new Color(255, 0, 0),
}, {
  onUpdate: () => renderer.render(),
})

timeline.play()
```

## Easing Functions

```typescript
// Built-in easing functions
const easings = {
  linear: (t: number) => t,

  // Quad
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Cubic
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Quart
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  // Quint
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeInOutQuint: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
}

// Usage
const timeline = new Timeline({
  duration: 500,
  easing: easings.easeOutQuad,
})
```

## Animation Properties

### Animatable Properties

```typescript
// Color interpolation
timeline.to(box, {
  backgroundColor: new Color(255, 0, 0),
  foregroundColor: new Color(0, 0, 255),
})

// Number interpolation (for custom properties)
timeline.to(box, {
  customProperty: 100,
}, {
  onUpdate: (progress) => {
    // Use progress value
    box.setStyle({ width: progress })
  }
})
```

## Animation Sequences

### Sequential Animations

```typescript
const timeline = new Timeline()

// First animation
timeline.to(box, { backgroundColor: new Color(255, 0, 0) }, { duration: 500 })

// Second animation (after first completes)
timeline.to(box, { backgroundColor: new Color(0, 255, 0) }, { duration: 500 })

// Third animation
timeline.to(box, { backgroundColor: new Color(0, 0, 255) }, { duration: 500 })

timeline.play()
```

### Parallel Animations

```typescript
const box1 = new BoxRenderable()
const box2 = new BoxRenderable()

const timeline1 = new Timeline()
timeline1.to(box1, { backgroundColor: new Color(255, 0, 0) }, { duration: 1000 })

const timeline2 = new Timeline()
timeline2.to(box2, { backgroundColor: new Color(0, 255, 0) }, { duration: 1000 })

timeline1.play()
timeline2.play()
```

## Animation Control

```typescript
const timeline = new Timeline({ duration: 1000 })

// Start animation
timeline.play()

// Pause animation
timeline.pause()

// Resume from pause
timeline.resume()

// Stop and reset
timeline.stop()

// Reverse animation
timeline.reverse()

// Seek to specific time
timeline.seek(500) // 500ms

// Get current progress (0-1)
console.log(timeline.getProgress())

// Get current time (ms)
console.log(timeline.getTime())
```

## Looping

### Infinite Loop

```typescript
const timeline = new Timeline({
  duration: 1000,
  loop: true,
  easing: easings.easeInOutQuad,
})

timeline.to(box, {
  backgroundColor: new Color(255, 0, 0),
}, {
  yoyo: true, // Oscillate back and forth
})
```

### Counted Loop

```typescript
let loopCount = 0
const maxLoops = 3

const timeline = new Timeline({
  duration: 1000,
  loop: true,
})

timeline.to(box, {
  backgroundColor: new Color(255, 0, 0),
}, {
  onComplete: () => {
    loopCount++
    if (loopCount >= maxLoops) {
      timeline.stop()
    }
  }
})
```

## Animation Events

```typescript
const timeline = new Timeline({ duration: 1000 })

timeline.to(box, {
  backgroundColor: new Color(255, 0, 0),
}, {
  onUpdate: (progress) => {
    console.log("Progress:", progress)
    renderer.render()
  },

  onComplete: () => {
    console.log("Animation complete!")
  },

  onStart: () => {
    console.log("Animation started!")
  }
})
```

## Animation Engine

### Attaching to Renderer

```typescript
import { AnimationEngine } from "@opentui/core"

const animationEngine = new AnimationEngine()
renderer.attach(animationEngine)

const timeline = new Timeline({ duration: 1000 })
animationEngine.register(timeline)
```

### Multiple Timelines

```typescript
const engine = new AnimationEngine()

const timeline1 = new Timeline({ duration: 500 })
const timeline2 = new Timeline({ duration: 1000 })
const timeline3 = new Timeline({ duration: 750 })

engine.register(timeline1)
engine.register(timeline2)
engine.register(timeline3)

engine.start() // Start all timelines
```

## Common Animation Patterns

### Fade In
```typescript
function fadeIn(component: any, duration: number = 500) {
  const timeline = new Timeline({ duration })

  timeline.to(component, {
    opacity: 1,
  }, {
    from: { opacity: 0 },
    onUpdate: () => renderer.render(),
  })

  return timeline
}
```

### Slide In
```typescript
function slideIn(component: any, from: "left" | "right" | "top" | "bottom", duration: number = 500) {
  const timeline = new Timeline({ duration, easing: easings.easeOutQuad })

  const startPositions = {
    left: { left: -100 },
    right: { left: 100 },
    top: { top: -20 },
    bottom: { top: 20 },
  }

  timeline.to(component, {
    left: 0,
    top: 0,
  }, {
    from: startPositions[from],
    onUpdate: () => renderer.render(),
  })

  return timeline
}
```

### Pulse Effect
```typescript
function pulse(component: any, duration: number = 1000) {
  const timeline = new Timeline({
    duration,
    loop: true,
    easing: easings.easeInOutQuad,
  })

  const originalColor = component.getStyle().foregroundColor

  timeline.to(component, {
    foregroundColor: new Color(255, 255, 255),
  }, {
    yoyo: true,
    from: { foregroundColor: originalColor },
    onUpdate: () => renderer.render(),
  })

  return timeline
}
```

### Progress Bar
```typescript
class ProgressBar {
  private box: BoxRenderable
  private fill: BoxRenderable
  private timeline: Timeline

  constructor() {
    this.box = new BoxRenderable()
    this.box.setStyle({ width: 50, height: 3 })

    this.fill = new BoxRenderable()
    this.fill.setStyle({
      width: 0,
      height: 1,
      backgroundColor: new Color(46, 204, 113),
    })

    this.box.add(this.fill)
  }

  animate(progress: number, duration: number = 500) {
    this.timeline = new Timeline({ duration, easing: easings.easeOutQuad })

    this.timeline.to(this.fill, {
      width: progress,
    }, {
      onUpdate: () => renderer.render(),
    })

    this.timeline.play()
  }
}
```

## Performance Tips

1. **Use requestAnimationFrame**: OpenTUI handles this via AnimationEngine
2. **Avoid too many concurrent animations**: Keep it under 10-15
3. **Use simple easing**: Complex easing functions add overhead
4. **Optimize onUpdate**: Only render when necessary
5. **Clean up**: Stop timelines when components are destroyed

## Reference

- Timeline API: OpenTUI core types
- AnimationEngine: OpenTUI core types
- Examples: `.search-data/research/opentui/resources.md`
