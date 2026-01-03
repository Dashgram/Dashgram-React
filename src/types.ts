import type { DashgramConfig, EventProperties, TrackLevel } from "@dashgram/javascript"

export type { DashgramConfig, EventProperties, TrackLevel }

/**
 * Dashgram context value
 */
export interface DashgramContextValue {
  /** Track custom event */
  track: (event: string, properties?: EventProperties) => void

  /** Check if SDK is initialized */
  isInitialized: boolean

  /** Flush all pending events */
  flush: () => Promise<void>

  /** Set track level */
  setTrackLevel: (level: TrackLevel) => void

  /** Get current track level */
  getTrackLevel: () => TrackLevel | undefined

  /** Shutdown SDK (cleanup) */
  shutdown: () => void
}
