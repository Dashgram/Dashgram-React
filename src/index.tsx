/**
 * Dashgram React SDK
 *
 * React wrapper for Dashgram Analytics SDK
 */

export { DashgramProvider, DashgramContext } from "./provider"
export type { DashgramProviderProps } from "./provider"

export {
  useDashgram,
  useTrackEvent,
  useTrackMount,
  useTrackUnmount,
  useScreenTracking,
  usePageView,
  useAutoTrack,
  useTrackClick,
  useTrackSubmit
} from "./hooks"

export type { DashgramContextValue, DashgramConfig, EventProperties, TrackLevel } from "./types"

// Re-export core SDK for direct access if needed
export { default as DashgramMini } from "@dashgram/javascript"
