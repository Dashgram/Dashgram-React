import React, { createContext, useEffect, useRef, useState } from "react"
import DashgramMini from "@dashgram/javascript"
import type { DashgramConfig, TrackLevel } from "@dashgram/javascript"
import type { DashgramContextValue } from "./types"

/**
 * Dashgram context
 */
export const DashgramContext = createContext<DashgramContextValue | null>(null)

/**
 * Dashgram provider props
 */
export interface DashgramProviderProps extends DashgramConfig {
  children: React.ReactNode
}

/**
 * Dashgram provider component
 */
export function DashgramProvider({
  children,
  projectId,
  trackLevel = 2,
  apiUrl,
  batchSize,
  flushInterval,
  debug,
  disabled,
  onError
}: DashgramProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentTrackLevel, setCurrentTrackLevel] = useState<TrackLevel>(trackLevel)
  const initRef = useRef(false)

  useEffect(() => {
    // Prevent double initialization (React 18 StrictMode)
    if (initRef.current) {
      return
    }

    // Don't initialize if projectId is missing
    if (!projectId) {
      return
    }

    initRef.current = true

    try {
      DashgramMini.init({
        projectId,
        trackLevel,
        apiUrl,
        batchSize,
        flushInterval,
        debug,
        disabled,
        onError
      })

      // Verify initialization succeeded by checking if we can call a method
      // The SDK's init() is synchronous, so this should work immediately
      setIsInitialized(true)
    } catch (error) {
      console.error("Dashgram: Failed to initialize", error)
      setIsInitialized(false)
      initRef.current = false
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (initRef.current) {
        try {
          DashgramMini.shutdown()
        } catch (error) {
          // Ignore shutdown errors
        }
        initRef.current = false
        setIsInitialized(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, trackLevel, apiUrl, batchSize, flushInterval, debug, disabled])

  const value: DashgramContextValue = {
    track: (event, properties) => {
      // Check both React state and handle SDK errors gracefully
      if (!isInitialized) {
        if (debug) {
          console.warn("Dashgram: Track called before initialization", { event, properties })
        }
        return
      }

      try {
        DashgramMini.track(event, properties)
      } catch (error) {
        // SDK might not be initialized even if React state says it is
        // This can happen during re-initialization or if init() failed silently
        if (debug) {
          console.warn("Dashgram: Track failed", error)
        }
        // Update state to reflect actual SDK state
        setIsInitialized(false)
      }
    },
    isInitialized,
    flush: async () => {
      if (isInitialized) {
        try {
          await DashgramMini.flush()
        } catch (error) {
          if (debug) {
            console.warn("Dashgram: Flush failed", error)
          }
        }
      }
    },
    setTrackLevel: level => {
      if (isInitialized) {
        try {
          DashgramMini.setTrackLevel(level)
          setCurrentTrackLevel(level)
        } catch (error) {
          if (debug) {
            console.warn("Dashgram: SetTrackLevel failed", error)
          }
        }
      }
    },
    getTrackLevel: () => {
      return currentTrackLevel
    },
    shutdown: () => {
      if (isInitialized) {
        try {
          DashgramMini.shutdown()
          setIsInitialized(false)
          initRef.current = false
        } catch (error) {
          if (debug) {
            console.warn("Dashgram: Shutdown failed", error)
          }
        }
      }
    }
  }

  return <DashgramContext.Provider value={value}>{children}</DashgramContext.Provider>
}
