/**
 * Provider component tests
 *
 * Ensures:
 * - Provider initializes SDK correctly
 * - Context is provided to children
 * - Cleanup works on unmount
 */

import { render, screen } from "@testing-library/react"
import { DashgramProvider, DashgramContext } from "../provider"
import { useDashgram } from "../hooks"
import React from "react"

// Mock the core SDK
const mockInit = jest.fn()
const mockShutdown = jest.fn()
const mockTrack = jest.fn()

jest.mock("@dashgram/javascript", () => ({
  __esModule: true,
  default: {
    init: mockInit,
    track: mockTrack,
    flush: jest.fn().mockResolvedValue(undefined),
    setTrackLevel: jest.fn(),
    shutdown: mockShutdown
  }
}))

describe("DashgramProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize SDK on mount", () => {
    render(
      <DashgramProvider projectId="test-project" trackLevel={2}>
        <div>Test</div>
      </DashgramProvider>
    )

    expect(mockInit).toHaveBeenCalledWith({
      projectId: "test-project",
      trackLevel: 2,
      apiUrl: undefined,
      batchSize: undefined,
      flushInterval: undefined,
      debug: undefined,
      disabled: undefined,
      onError: undefined
    })
  })

  it("should provide context to children", () => {
    const TestComponent = () => {
      const { track, isInitialized } = useDashgram()
      return (
        <div>
          <span data-testid="initialized">{String(isInitialized)}</span>
          <button
            data-testid="track-button"
            onClick={() => track("test_event")}
          >
            Track
          </button>
        </div>
      )
    }

    render(
      <DashgramProvider projectId="test-project">
        <TestComponent />
      </DashgramProvider>
    )

    expect(screen.getByTestId("initialized")).toBeInTheDocument()
    expect(screen.getByTestId("track-button")).toBeInTheDocument()
  })

  it("should shutdown SDK on unmount", () => {
    const { unmount } = render(
      <DashgramProvider projectId="test-project">
        <div>Test</div>
      </DashgramProvider>
    )

    unmount()

    expect(mockShutdown).toHaveBeenCalled()
  })

  it("should handle all config options", () => {
    const onError = jest.fn()

    render(
      <DashgramProvider
        projectId="test-project"
        trackLevel={3}
        apiUrl="https://custom.api"
        batchSize={20}
        flushInterval={10000}
        debug={true}
        disabled={false}
        onError={onError}
      >
        <div>Test</div>
      </DashgramProvider>
    )

    expect(mockInit).toHaveBeenCalledWith({
      projectId: "test-project",
      trackLevel: 3,
      apiUrl: "https://custom.api",
      batchSize: 20,
      flushInterval: 10000,
      debug: true,
      disabled: false,
      onError
    })
  })
})

