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

      setIsInitialized(true)
    } catch (error) {
      console.error("Dashgram: Failed to initialize", error)
    }

    // Cleanup on unmount
    return () => {
      DashgramMini.shutdown()
    }
  }, [projectId, trackLevel, apiUrl, batchSize, flushInterval, debug, disabled, onError])

  const value: DashgramContextValue = {
    track: (event, properties) => {
      if (isInitialized) {
        DashgramMini.track(event, properties)
      }
    },
    isInitialized,
    flush: async () => {
      if (isInitialized) {
        await DashgramMini.flush()
      }
    },
    setTrackLevel: level => {
      if (isInitialized) {
        DashgramMini.setTrackLevel(level)
        setCurrentTrackLevel(level)
      }
    },
    getTrackLevel: () => {
      return currentTrackLevel
    },
    shutdown: () => {
      if (isInitialized) {
        DashgramMini.shutdown()
        setIsInitialized(false)
        initRef.current = false
      }
    }
  }

  return <DashgramContext.Provider value={value}>{children}</DashgramContext.Provider>
}
