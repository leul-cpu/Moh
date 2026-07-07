## 2026-07-07 - [Keyboard Accessibility in Interactive Modals and Grids]
**Learning:** Interactive elements that rely on hover states (like portfolio cards) or modal overlays (like lightboxes) often neglect keyboard users. Without proper focus management, keyboard users can become "trapped" in the background or lose their place when a modal closes.
**Action:** Always implement `:focus-within` for hover-dependent UI and manage focus explicitly when opening/closing modals to ensure a seamless experience for all users.
