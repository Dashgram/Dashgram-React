/**
 * Type safety tests
 *
 * This file ensures TypeScript types are correct.
 * Run with: tsc --noEmit
 *
 * These are compile-time checks, not runtime tests.
 */

import type {
  DashgramContextValue,
  DashgramConfig,
  EventProperties,
  TrackLevel
} from "../types"
import type { DashgramProviderProps } from "../provider"

// Type checks - these will fail at compile time if types are wrong

// Test DashgramConfig
const validConfig: DashgramConfig = {
  projectId: "test",
  trackLevel: 2,
  apiUrl: "https://api.example.com",
  batchSize: 10,
  flushInterval: 5000,
  debug: true,
  disabled: false
}

// Test TrackLevel
const level1: TrackLevel = 1
const level2: TrackLevel = 2
const level3: TrackLevel = 3
// @ts-expect-error - should fail: invalid level
const invalidLevel: TrackLevel = 4

// Test EventProperties
const validProperties: EventProperties = {
  string: "value",
  number: 123,
  boolean: true,
  array: [1, 2, 3],
  object: { nested: "value" }
}

// Test DashgramContextValue
const contextValue: DashgramContextValue = {
  track: (event: string, properties?: EventProperties) => {},
  isInitialized: true,
  flush: async () => {},
  setTrackLevel: (level: TrackLevel) => {},
  getTrackLevel: () => 2 as TrackLevel,
  shutdown: () => {}
}

// Test DashgramProviderProps
const providerProps: DashgramProviderProps = {
  ...validConfig,
  children: null as any
}

// Ensure all required properties exist
const _required: {
  track: DashgramContextValue["track"]
  isInitialized: DashgramContextValue["isInitialized"]
  flush: DashgramContextValue["flush"]
  setTrackLevel: DashgramContextValue["setTrackLevel"]
  getTrackLevel: DashgramContextValue["getTrackLevel"]
  shutdown: DashgramContextValue["shutdown"]
} = contextValue

export {}

