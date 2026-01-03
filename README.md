# Dashgram React SDK

React SDK for **Telegram Mini Apps**. Track user interactions and send events to Dashgram analytics.

> [!NOTE]
> This SDK is for **Telegram Mini Apps** built with React. For vanilla JavaScript or other frameworks, see our [other SDKs](https://docs.dashgram.io/sdk).

## Quick Start

### 1. Installation

```bash
npm install @dashgram/react
# or
pnpm add @dashgram/react
# or
yarn add @dashgram/react
```

### 2. Basic Setup

Wrap your app with `DashgramProvider`:

```tsx
import { DashgramProvider } from "@dashgram/react"

export function App() {
  return (
    <DashgramProvider projectId="your-project-id" trackLevel={2}>
      ...
    </DashgramProvider>
  )
}
```

**Configuration:**

- `projectId` — Your project identifier from the [Dashgram dashboard](https://app.dashgram.io). Get it after creating a project.
- `trackLevel` — Controls which events are automatically captured. See [Track Levels](#track-levels) section below for details.

### 3. Track custom events (optional)

If you want to send custom events to Dashgram, use the useTrackEvent hook.
Simply call it with an event name and optional properties whenever the action happens.

```tsx
import { useTrackEvent } from "@dashgram/react"

export function Button() {
  const track = useTrackEvent()

  const handleClick = () => {
    track("button_click", { label: "Buy" })
  }

  return <button onClick={handleClick}>Click me</button>
}
```

## Track Levels

Choose how much data to collect. Higher levels capture more events but send more data.

### Level 1 — Core

**Minimal tracking** — Basic app lifecycle events only.

| Event       | Description                       |
| ----------- | --------------------------------- |
| `app_open`  | Mini App opened or became visible |
| `app_close` | Mini App closed or hidden         |

**Use when:** You only need basic usage metrics.

### Level 2 — Interactions

**Standard tracking** — Level 1 + user interactions.

| Event                 | Description                      |
| --------------------- | -------------------------------- |
| `screen_view`         | Page/route navigation            |
| `button_click`        | Button clicks                    |
| `link_click`          | Link clicks (external detection) |
| `form_submit`         | Form submissions                 |
| `input_focus`         | Input field focus                |
| `input_change`        | Input field value changed        |
| `copy`                | Text copied to clipboard         |
| `cut`                 | Text cut to clipboard            |
| `paste`               | Text pasted from clipboard       |
| `text_select`         | Text selection                   |
| `js_error`            | JavaScript errors                |
| `unhandled_rejection` | Unhandled Promise rejections     |

**Use when:** You want standard web analytics (recommended for most apps).

### Level 3 — Deep Analytics

**Comprehensive tracking** — Level 1 + 2 + performance metrics + all Telegram events.

| Event                            | Description                    |
| -------------------------------- | ------------------------------ |
| `scroll_depth`                   | Scroll milestone reached       |
| `element_visible`                | Tracked element became visible |
| `rage_click`                     | Rapid repeated clicks          |
| `long_task`                      | JS task >50ms                  |
| `web_vital_lcp`                  | Largest Contentful Paint       |
| `web_vital_fid`                  | First Input Delay              |
| `web_vital_cls`                  | Cumulative Layout Shift        |
| `network_status`                 | Online/offline status          |
| `orientation_change`             | Device orientation change      |
| `media_play/pause/ended`         | Video/audio events             |
| `telegram_theme_changed`         | Telegram theme change          |
| `telegram_viewport_changed`      | Viewport size change           |
| `telegram_main_button_clicked`   | Main button pressed            |
| `telegram_back_button_clicked`   | Back button pressed            |
| `telegram_invoice_closed`        | Invoice closed                 |
| ...and all other Telegram events |                                |

**Use when:** You need detailed performance monitoring and all Telegram WebApp events.

## API Reference

### `<DashgramProvider>`

Provider component that initializes the SDK.

```tsx
<DashgramProvider projectId="your-project-id" trackLevel={2} debug={false} disabled={false}>
  <YourApp />
</DashgramProvider>
```

**Props:**

- `projectId` — **Required.** Your project ID from [Dashgram dashboard](https://app.dashgram.io)
- `trackLevel` — Event collection level: `1`, `2`, or `3` (default: `2`)
- `debug` — Enable debug logging (default: `false`)
- `disabled` — Disable all tracking (default: `false`)

### `useTrackEvent()`

Hook that returns a function to track custom events with optional properties.

```tsx
const track = useTrackEvent()

track("purchase_completed", {
  product_id: "premium-plan",
  price: 100,
  currency: "TON"
})
```

**Parameters:**

- `event` — Event name (string)
- `properties` — Optional event properties (object)

### `useDashgram()`

Hook to access the SDK instance.

```tsx
const { track, isInitialized, flush } = useDashgram()

track("event_name")
await flush()
```

### `usePageView(pageName, properties?)`

Track page views for SPA routing.

```tsx
usePageView("home_page", { section: "landing" })
```

## Contributing

Contributions are welcome! Please open issues or pull requests on the [GitHub repository](https://github.com/dashgram/dashgram-javascript).

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Contact

For questions or support, reach out to us at [team@dashgram.io](mailto:team@dashgram.io) or visit our [website](https://dashgram.io).
