## 2026-07-07 - [Keyboard Accessibility in Interactive Modals and Grids]
**Learning:** Interactive elements that rely on hover states (like portfolio cards) or modal overlays (like lightboxes) often neglect keyboard users. Without proper focus management, keyboard users can become "trapped" in the background or lose their place when a modal closes.
**Action:** Always implement `:focus-within` for hover-dependent UI and manage focus explicitly when opening/closing modals to ensure a seamless experience for all users.

## 2026-07-08 - [Dynamic Accessibility for Multimedia Modals]
**Learning:** When loading dynamic content into a lightbox (like TikTok iframes), visual titles aren't enough for screen readers. Providing a dynamic `title` for the `iframe` and a descriptive `aria-label` for external links using the content's title ensures the context is maintained across assistive technologies.
**Action:** Always synchronize visual metadata (titles/categories) with accessibility attributes (`iframe[title]`, `a[aria-label]`) during dynamic content swaps.
