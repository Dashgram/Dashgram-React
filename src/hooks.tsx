import { useContext, useEffect, useRef } from "react"
import type { FormEvent } from "react"
import { DashgramContext } from "./provider"
import type { DashgramContextValue } from "./types"

// Optional react-router-dom import
let useLocation: (() => { pathname: string; search: string; hash: string; state?: any }) | null = null

try {
  // Dynamic import for optional dependency
  // @ts-ignore - require may not be available in all environments
  if (typeof require !== "undefined" && require) {
    // @ts-ignore - react-router-dom is optional peer dependency
    const router = require("react-router-dom")
    useLocation = router.useLocation
  }
} catch {
  // react-router-dom not installed
}

/**
 * Hook to access Dashgram SDK
 */
export function useDashgram(): DashgramContextValue {
  const context = useContext(DashgramContext)

  if (!context) {
    throw new Error("useDashgram must be used within DashgramProvider")
  }

  return context
}

/**
 * Hook to track component mount
 */
export function useTrackMount(event: string, properties?: Record<string, any>): void {
  const { track, isInitialized } = useDashgram()
  const hasTracked = useRef(false)

  useEffect(() => {
    if (isInitialized && !hasTracked.current) {
      track(event, properties)
      hasTracked.current = true
    }
  }, [isInitialized, event, properties, track])
}

/**
 * Hook to track component unmount
 */
export function useTrackUnmount(event: string, properties?: Record<string, any>): void {
  const { track, isInitialized } = useDashgram()

  useEffect(() => {
    return () => {
      if (isInitialized) {
        track(event, properties)
      }
    }
  }, [isInitialized, event, properties, track])
}

/**
 * Hook to track screen views automatically (requires react-router-dom)
 *
 * Usage:
 * ```tsx
 * function App() {
 *   useScreenTracking();
 *   return <Routes>...</Routes>;
 * }
 * ```
 */
export function useScreenTracking(): void {
  const { track, isInitialized } = useDashgram()

  if (!useLocation) {
    // @ts-ignore - process.env may not be available in all environments
    const isDev = typeof process !== "undefined" && process?.env?.NODE_ENV !== "production"
    if (isDev) {
      console.warn(
        "Dashgram: useScreenTracking requires react-router-dom. " + "Install it or use manual screen tracking."
      )
    }
    return
  }

  const location = useLocation()
  const previousPath = useRef<string>("")

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    const currentPath = location.pathname

    // Don't track if path hasn't changed
    if (currentPath === previousPath.current) {
      return
    }

    previousPath.current = currentPath

    track("screen_view", {
      path: currentPath,
      search: location.search,
      hash: location.hash,
      state: location.state
    })
  }, [location, isInitialized, track])
}

/**
 * Hook to track button clicks
 *
 * Usage:
 * ```tsx
 * const handleClick = useTrackClick('button_clicked', { button: 'submit' });
 * return <button onClick={handleClick}>Submit</button>;
 * ```
 */
export function useTrackClick(event: string, properties?: Record<string, any>): () => void {
  const { track } = useDashgram()

  return () => {
    track(event, properties)
  }
}

/**
 * Hook to track form submissions
 *
 * Usage:
 * ```tsx
 * const handleSubmit = useTrackSubmit('form_submitted', { form: 'login' });
 * return <form onSubmit={handleSubmit}>...</form>;
 * ```
 */
export function useTrackSubmit(
  event: string,
  properties?: Record<string, any>
): (e: FormEvent<HTMLFormElement>) => void {
  const { track } = useDashgram()

  return (_e: FormEvent<HTMLFormElement>) => {
    track(event, properties)
  }
}

/**
 * Hook to track events imperatively
 *
 * Usage:
 * ```tsx
 * const trackEvent = useTrackEvent();
 *
 * const handleAction = () => {
 *   trackEvent('action_completed', { action: 'purchase' });
 * };
 * ```
 */
export function useTrackEvent(): (event: string, properties?: Record<string, any>) => void {
  const { track, isInitialized } = useDashgram()

  return (event: string, properties?: Record<string, any>) => {
    if (isInitialized) {
      track(event, properties)
    }
  }
}

/**
 * Hook to automatically track component lifecycle events
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   useAutoTrack('my_component');
 *   return <div>Content</div>;
 * }
 * ```
 *
 * This will automatically track:
 * - 'my_component_mounted' on mount
 * - 'my_component_unmounted' on unmount
 */
export function useAutoTrack(componentName: string, properties?: Record<string, any>): void {
  const { track, isInitialized } = useDashgram()
  const hasTrackedMount = useRef(false)

  // Track mount
  useEffect(() => {
    if (isInitialized && !hasTrackedMount.current) {
      track(`${componentName}_mounted`, properties)
      hasTrackedMount.current = true
    }
  }, [isInitialized, componentName, properties, track])

  // Track unmount
  useEffect(() => {
    return () => {
      if (isInitialized) {
        track(`${componentName}_unmounted`, properties)
      }
    }
  }, [isInitialized, componentName, properties, track])
}

/**
 * Hook to track page views (for SPA routing)
 *
 * Usage:
 * ```tsx
 * function Page() {
 *   usePageView('home_page', { section: 'landing' });
 *   return <div>Home</div>;
 * }
 * ```
 *
 * Or with React Router:
 * ```tsx
 * function App() {
 *   const location = useLocation();
 *   usePageView(location.pathname);
 *   return <Routes>...</Routes>;
 * }
 * ```
 */
export function usePageView(pageName: string, properties?: Record<string, any>): void {
  const { track, isInitialized } = useDashgram()
  const previousPage = useRef<string>("")

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    // Don't track if page hasn't changed
    if (pageName === previousPage.current) {
      return
    }

    previousPage.current = pageName

    track("page_view", {
      page: pageName,
      ...properties
    })
  }, [isInitialized, pageName, properties, track])
}
