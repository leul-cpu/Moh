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
**Learning:** In repositories with strict "no custom CSS" rules and limited utility classes, JS-driven micro-UX (like dynamic element counts) can still achieve high polish by combining semantic HTML tags (e.g., `<small>`) to match existing aesthetics without polluting stylesheets.
**Action:** Use semantic elements and existing classes first; fallback to precise inline styles for micro-adjustments only when necessary to maintain design consistency.

## 2026-07-12 - [Targeted Line formatting vs. Full-File Formatting]
**Learning:** In repositories with strict lines-of-code budgets (< 50 lines) or missing project-wide build/lint tooling, running global formatters can introduce massive changesets (whitespace/indents/quotes) that obscure high-impact UX improvements and clutter git history.
**Action:** Always format modified code segments manually or locally instead of running global full-file formatting, ensuring the final patch remains concise and easy to review.

## 2026-07-29 - [Focus Restorations in Modals with Internal Navigation]
**Learning:** In modals with internal navigation (e.g., Lightboxes with Next/Prev videos), simply tracking the `document.activeElement` when the modal opens is insufficient. Navigating inside the modal must preserve the original trigger outside the modal as the restoration point, rather than accidentally overwriting it with modal navigation buttons. If overwritten, closing the modal results in focus loss to the body.
**Action:** Explicitly track the restoration element and protect it from being overwritten during intra-modal navigation. Ensure any "next/prev" actions dynamically trace back to the corresponding trigger element on the parent page.

## 2026-08-02 - [Interactive Focus-Visible Syncing for Secondary Elements]
**Learning:** Adding hover animations and scale/translation transforms to interactive elements (like social icons, mobile menu buttons, and lightbox controls) makes a page feel extremely polished. However, if `:focus-visible` styles are not also updated to synchronize with these hover effects (or are missing entirely), keyboard users are deprived of that visual delight and can struggle to track focus during single-page navigation.
**Action:** Always pair visual hover transforms and gradients with equivalent `:focus-visible` styles and smooth transitions to ensure mouse and keyboard users enjoy a consistent, accessible, and delightful interactive experience.

## 2026-08-03 - [Implementation of fixed scroll progress indicator]
**Learning:** Adding a scroll progress indicator offers immediate visual feedback and wayfinding on content-rich, scroll-heavy single page websites. Implementing this using a semantic, visually hidden or hidden-by-aria (`aria-hidden="true"`) element avoids cluttering assistive technologies while providing a delightful micro-interaction that updates smoothly on scroll.
**Action:** Always implement scroll progress elements with `aria-hidden="true"`, fixed positioning with high z-index (e.g. 2000), and dynamic script updates on both scroll events and page initialization to handle persisted scroll positions upon page refreshes.

## 2026-08-05 - [Focus Accessibility on Contact Form Inputs]
**Learning:** Standard form designs often disable default outline styles on input fields with `outline: none` on focus, creating significant barriers for keyboard-only users who can no longer track focus visually. Utilizing modern CSS selectors like `:focus-visible` lets developers show high-contrast focus rings solely to keyboard navigation users without affecting the clean visual flow of pointer interactions.
**Action:** Avoid raw `outline: none` on inputs or textareas without setting custom, high-contrast, brand-aligned outlines with `:focus-visible` to satisfy both visual design and keyboard accessibility (WCAG 2.1).

## 2026-08-08 - [Static Form Submission On-Page Feedback and Fallbacks]
**Learning:** Forms on static websites often initiate client-side mailto links or redirect to webmail without displaying any on-page success confirmation. This leaves users, especially those using screen readers or assistive technologies, confused as the page does not acknowledge submission. Moreover, mailto links often fail on platforms without a default mail client.
**Action:** Provide immediate, accessible status feedback in a container with `aria-live="polite"`, and include explicit manual fallback links (e.g. for default mail client and webmail) to allow users to recover if the automated client action fails.

## 2026-08-10 - [Focus Outline Shape Mutation on Circular and Pill-Shaped Elements]
**Learning:** Applying a global `border-radius` override under a `:focus-visible` CSS rule causes interactive elements with unique shapes (such as circular navigation buttons, social icons, and pill-shaped navigation links) to morph or mutate their shapes upon keyboard focus. Modern web browsers natively adapt outlines to respect each element's custom `border-radius`, making global focus shape overrides unnecessary and visually disruptive.
**Action:** Avoid declaring `border-radius` globally in `:focus-visible` rules to ensure that browser focus rings perfectly match and preserve the native shape of every styled interactive component.
