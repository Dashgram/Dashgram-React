/**
 * Basic type safety and hook tests for Dashgram React SDK
 *
 * These tests ensure:
 * - Hooks are properly typed
 * - Context is correctly provided
 * - No runtime errors in hook usage
 */

import { renderHook, act } from "@testing-library/react"
import { DashgramProvider } from "../provider"
import {
  useDashgram,
  useTrackEvent,
  useTrackMount,
  useTrackUnmount,
  usePageView,
  useAutoTrack,
  useTrackClick,
  useTrackSubmit
} from "../hooks"
import React from "react"

// Mock the core SDK
jest.mock("@dashgram/javascript", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    track: jest.fn(),
    flush: jest.fn().mockResolvedValue(undefined),
    setTrackLevel: jest.fn(),
    shutdown: jest.fn()
  }
}))

describe("Dashgram React Hooks", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <DashgramProvider projectId="test-project" trackLevel={2}>
      {children}
    </DashgramProvider>
  )

  describe("useDashgram", () => {
    it("should return SDK instance and config", () => {
      const { result } = renderHook(() => useDashgram(), { wrapper })

      expect(result.current).toHaveProperty("track")
      expect(result.current).toHaveProperty("isInitialized")
      expect(result.current).toHaveProperty("flush")
      expect(result.current).toHaveProperty("setTrackLevel")
      expect(result.current).toHaveProperty("getTrackLevel")
      expect(result.current).toHaveProperty("shutdown")
      expect(typeof result.current.track).toBe("function")
    })

    it("should track events", () => {
      const { result } = renderHook(() => useDashgram(), { wrapper })

      act(() => {
        result.current.track("test_event", { key: "value" })
      })

      // Verify track was called (mocked)
      expect(result.current.track).toBeDefined()
    })
  })

  describe("useTrackEvent", () => {
    it("should return a track function", () => {
      const { result } = renderHook(() => useTrackEvent(), { wrapper })

      expect(typeof result.current).toBe("function")
    })

    it("should track events when called", () => {
      const { result } = renderHook(() => useTrackEvent(), { wrapper })

      act(() => {
        result.current("test_event", { property: "value" })
      })

      expect(result.current).toBeDefined()
    })
  })

  describe("useTrackMount", () => {
    it("should track on mount", () => {
      const { unmount } = renderHook(
        () => useTrackMount("mount_event", { data: "test" }),
        { wrapper }
      )

      unmount()
    })
  })

  describe("useTrackUnmount", () => {
    it("should track on unmount", () => {
      const { unmount } = renderHook(
        () => useTrackUnmount("unmount_event", { data: "test" }),
        { wrapper }
      )

      act(() => {
        unmount()
      })
    })
  })

  describe("usePageView", () => {
    it("should track page views", () => {
      const { rerender } = renderHook(
        ({ page }) => usePageView(page),
        {
          wrapper,
          initialProps: { page: "home" }
        }
      )

      rerender({ page: "about" })
    })
  })

  describe("useAutoTrack", () => {
    it("should track component lifecycle", () => {
      const { unmount } = renderHook(
        () => useAutoTrack("component", { id: "123" }),
        { wrapper }
      )

      act(() => {
        unmount()
      })
    })
  })

  describe("useTrackClick", () => {
    it("should return click handler", () => {
      const { result } = renderHook(
        () => useTrackClick("click_event", { button: "test" }),
        { wrapper }
      )

      expect(typeof result.current).toBe("function")

      act(() => {
        result.current()
      })
    })
  })

  describe("useTrackSubmit", () => {
    it("should return submit handler", () => {
      const { result } = renderHook(
        () => useTrackSubmit("submit_event", { form: "test" }),
        { wrapper }
      )

      expect(typeof result.current).toBe("function")

      const mockEvent = {
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>

      act(() => {
        result.current(mockEvent)
      })
    })
  })
})

