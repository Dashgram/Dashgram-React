# Dashgram React SDK

React wrapper for Dashgram Analytics SDK for Telegram Mini Apps.

## Installation

```bash
npm install @dashgram/react @dashgram/javascript
```

## Quick Start

### 1. Wrap your app in Provider

```tsx
import { DashgramProvider } from "@dashgram/react"

function App() {
  return (
    <DashgramProvider projectId="your-project-id" trackLevel={2} debug={true}>
      <YourApp />
    </DashgramProvider>
  )
}
```

### 2. Use hooks for tracking

```tsx
import { useDashgram } from "@dashgram/react"

function HomePage() {
  const { track } = useDashgram()

  const handleButtonClick = () => {
    track("button_clicked", {
      button_name: "subscribe",
      screen: "home"
    })
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Subscribe</button>
    </div>
  )
}
```

## API

### `<DashgramProvider>`

Provider component for SDK initialization.

```tsx
interface DashgramProviderProps {
  projectId: string
  trackLevel?: 1 | 2 | 3
  apiUrl?: string
  batchSize?: number
  flushInterval?: number
  debug?: boolean
  disabled?: boolean
  onError?: (error: DashgramError) => void
  children: React.ReactNode
}
```

**Example:**

```tsx
<DashgramProvider projectId="prj_123" trackLevel={2} debug={process.env.NODE_ENV === "development"}>
  <App />
</DashgramProvider>
```

### `useDashgram()`

Main hook for accessing the SDK.

```tsx
const { track, isInitialized, flush, setTrackLevel, getTrackLevel } = useDashgram()

// Track event
track("purchase_completed", {
  product_id: "123",
  amount: 99.99
})

// Check initialization
if (isInitialized) {
  console.log("Dashgram ready")
}

// Flush pending events
await flush()

// Change track level
setTrackLevel(3)

// Get current track level
const level = getTrackLevel()
```

> [!NOTE]
> User identification is handled automatically via Telegram's `initData`. You don't need to call any identify method.

### `useTrackEvent()`

Hook to track events imperatively. Returns a function you can call anywhere.

```tsx
import { useTrackEvent } from "@dashgram/react"

function ProductCard({ product }) {
  const trackEvent = useTrackEvent()

  const handlePurchase = async () => {
    // Your purchase logic
    await purchaseProduct(product.id)

    // Track the event
    trackEvent("purchase_completed", {
      product_id: product.id,
      product_name: product.name,
      price: product.price
    })
  }

  return <button onClick={handlePurchase}>Buy</button>
}
```

### `usePageView(pageName, properties?)`

Hook to track page views (for SPA routing).

```tsx
import { usePageView } from "@dashgram/react"

function HomePage() {
  usePageView("home_page", {
    section: "landing"
  })

  return <div>Home</div>
}
```

Or with React Router:

```tsx
import { useLocation } from "react-router-dom"
import { usePageView } from "@dashgram/react"

function App() {
  const location = useLocation()

  usePageView(location.pathname, {
    search: location.search
  })

  return <Routes>...</Routes>
}
```

### `useAutoTrack(componentName, properties?)`

Automatically track component lifecycle events (mount/unmount).

```tsx
import { useAutoTrack } from "@dashgram/react"

function VideoPlayer() {
  useAutoTrack("video_player", {
    video_id: "123"
  })

  // This will automatically track:
  // - "video_player_mounted" on mount
  // - "video_player_unmounted" on unmount

  return <video src="..." />
}
```

### `useScreenTracking()`

Automatic navigation tracking (for React Router).

```tsx
import { useScreenTracking } from "@dashgram/react"
import { BrowserRouter } from "react-router-dom"

function App() {
  useScreenTracking() // Automatically tracks screen_view

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

function Root() {
  return (
    <BrowserRouter>
      <DashgramProvider {...config}>
        <App />
      </DashgramProvider>
    </BrowserRouter>
  )
}
```

### `useTrackMount(event, properties?)`

Track component mount.

```tsx
import { useTrackMount } from "@dashgram/react"

function HomePage() {
  useTrackMount("home_page_viewed", {
    source: "navigation"
  })

  return <div>Home Page</div>
}
```

### `useTrackUnmount(event, properties?)`

Track component unmount.

```tsx
import { useTrackUnmount } from "@dashgram/react"

function VideoPlayer() {
  useTrackUnmount("video_closed", {
    duration: videoRef.current?.currentTime
  })

  return <video ref={videoRef} />
}
```

### `useTrackClick(event, properties?)`

Helper for tracking clicks.

```tsx
import { useTrackClick } from "@dashgram/react"

function SubscribeButton() {
  const handleClick = useTrackClick("subscribe_clicked", {
    plan: "premium",
    price: 9.99
  })

  return <button onClick={handleClick}>Subscribe</button>
}
```

### `useTrackSubmit(event, properties?)`

Helper for tracking form submissions.

```tsx
import { useTrackSubmit } from "@dashgram/react"

function LoginForm() {
  const handleSubmit = useTrackSubmit("login_form_submitted", {
    method: "email"
  })

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <button type="submit">Login</button>
    </form>
  )
}
```

## Telegram Mini App Example

Complete example for a Telegram Mini App:

```tsx
import React from "react"
import { DashgramProvider, useDashgram, usePageView, useTrackEvent } from "@dashgram/react"

// Root component
function Root() {
  return (
    <DashgramProvider
      projectId={import.meta.env.VITE_DASHGRAM_PROJECT_ID}
      trackLevel={2}
      debug={import.meta.env.DEV}
    >
      <App />
    </DashgramProvider>
  )
}

// Main app
function App() {
  const location = window.location.pathname
  usePageView(location)

  return (
    <div>
      <HomePage />
    </div>
  )
}

// Home page component
function HomePage() {
  const trackEvent = useTrackEvent()

  const handleButtonClick = () => {
    trackEvent("cta_clicked", {
      button: "get_started",
      location: "hero"
    })
  }

  return (
    <div>
      <h1>Welcome to My Mini App</h1>
      <button onClick={handleButtonClick}>Get Started</button>
    </div>
  )
}

export default Root
```

## Complete Example with React Router

```tsx
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import {
  DashgramProvider,
  useDashgram,
  useScreenTracking,
  usePageView,
  useTrackEvent,
  useAutoTrack
} from "@dashgram/react"

// App component
function App() {
  useScreenTracking() // Automatic screen tracking

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

// Home page
function HomePage() {
  const trackEvent = useTrackEvent()

  usePageView("home") // Track page view

  const handleSubscribe = () => {
    trackEvent("subscribe_button_clicked", {
      location: "home_hero"
    })
  }

  return (
    <div>
      <h1>Welcome to Dashgram</h1>
      <button onClick={handleSubscribe}>Subscribe</button>
    </div>
  )
}

// Products page
function ProductsPage() {
  useAutoTrack("products_page") // Auto track mount/unmount

  return <div>Products</div>
}

// Profile page
function ProfilePage() {
  const { track } = useDashgram()

  usePageView("profile")

  return <div>Profile Page</div>
}

// Root
function Root() {
  return (
    <BrowserRouter>
      <DashgramProvider
        projectId="prj_123"
        trackLevel={2}
        debug={process.env.NODE_ENV === "development"}
      >
        <App />
      </DashgramProvider>
    </BrowserRouter>
  )
}

export default Root
```

## Track Levels

See [JavaScript SDK documentation](../Dashgram-Javascript/README.md#track-levels) for details about track levels.

## TypeScript

The SDK is fully typed:

```tsx
import { useDashgram, EventProperties, DashgramConfig } from "@dashgram/react"

const properties: EventProperties = {
  product_id: "123",
  price: 99.99
}
```

## Direct Access to Core SDK

If you need direct access to the JavaScript SDK:

```tsx
import { DashgramMini } from "@dashgram/react"

// Or
import DashgramMini from "@dashgram/javascript"

// Usage
await DashgramMini.flush()
DashgramMini.setTrackLevel(3)
DashgramMini.shutdown()
```

## Features

- ✅ **Thin wrapper** - No duplication, leverages `@dashgram/javascript` core SDK
- ✅ **Automatic initialization** - SDK initializes on provider mount
- ✅ **Automatic cleanup** - SDK shuts down on provider unmount
- ✅ **React 18 Strict Mode** - Compatible with React 18's double-render behavior
- ✅ **TypeScript** - Fully typed with comprehensive type definitions
- ✅ **Hooks API** - Idiomatic React hooks for all common scenarios
- ✅ **React Router integration** - Optional integration with `react-router-dom`
- ✅ **SSR-safe** - Works in server-side rendering environments
- ✅ **Telegram Mini Apps** - Optimized for Telegram Mini App environment
- ✅ **Event batching** - Automatic event batching and flushing
- ✅ **Telemetry enrichment** - Automatic telemetry data collection

## License

MIT
