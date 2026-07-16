## 2026-07-07 - [Keyboard Accessibility in Interactive Modals and Grids]
**Learning:** Interactive elements that rely on hover states (like portfolio cards) or modal overlays (like lightboxes) often neglect keyboard users. Without proper focus management, keyboard users can become "trapped" in the background or lose their place when a modal closes.
**Action:** Always implement `:focus-within` for hover-dependent UI and manage focus explicitly when opening/closing modals to ensure a seamless experience for all users.

## 2026-07-08 - [Dynamic Accessibility for Multimedia Modals]
**Learning:** When loading dynamic content into a lightbox (like TikTok iframes), visual titles aren't enough for screen readers. Providing a dynamic `title` for the `iframe` and a descriptive `aria-label` for external links using the content's title ensures the context is maintained across assistive technologies.
**Action:** Always synchronize visual metadata (titles/categories) with accessibility attributes (`iframe[title]`, `a[aria-label]`) during dynamic content swaps.

## 2026-07-09 - [Scroll-Spy Accessibility & Selector Logic]
**Learning:** Scroll-Spy systems often fail when navigation links use inconsistent selectors (e.g., mixing `.nav-link` and `.btn`). Additionally, visual active states must be accompanied by `aria-current="page"` to ensure orientation for non-visual users in single-page applications.
**Action:** Use a broad enough selector for scroll-spy observers to capture all primary navigation elements and synchronize visual `.active` classes with `aria-current="page"`.

## 2026-07-10 - [Inconsistent Focus Feedback across Card Components]
**Learning:** While the primary portfolio grid implements `:focus-within` to mirror hover states, secondary card-like elements such as `.vault-card`, `.client-card`, and `.contact-item` often lack this, creating an inconsistent experience for keyboard users who expect visual feedback when interacting with these components.
**Action:** When implementing hover effects for card-like interactive components, always pair them with `:focus-within` and `:focus-visible` to ensure visual parity between mouse and keyboard navigation.

## 2026-07-11 - [Dynamic UI Hints via JS in Strict CSS Environments]
**Learning:** In repositories with strict "no custom CSS" rules and limited utility classes, JS-driven micro-UX (like dynamic element counts) can still achieve high polish by combining semantic HTML tags (e.g., `<small>`) with minimal, targeted inline styles to match existing aesthetics without polluting stylesheets.
**Action:** Use semantic elements and existing classes first; fallback to precise inline styles for micro-adjustments only when necessary to maintain design consistency.

