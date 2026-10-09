/**
 * Scroll lengths shared by the Agency section's exit and the Contact
 * section's entrance, which happen on the same pinned screen.
 *
 * The Agency track ends with AGENCY_EXIT_VH of extra pinned scroll. In the
 * first AGENCY_UNWIND_VH everything in the section plays back out and the
 * folder pops; the Contact section — tucked up underneath so its pinned
 * screen lines up with the Agency stage exactly then — plays its entrance in
 * the rest, and the two scroll away together.
 */
export const AGENCY_EXIT_VH = 260;
export const AGENCY_UNWIND_VH = 160;

/** How far the Contact section is tucked up under the Agency track. */
export const CONTACT_TUCK_VH = AGENCY_EXIT_VH + 100 - AGENCY_UNWIND_VH;

/**
 * The same hand-off again, from the Contact section to Our Story (only on
 * `stage:` viewports, where Our Story pins). After its entrance, Contact
 * holds for CONTACT_EXIT_VH more: in the first CONTACT_UNWIND_VH it plays
 * back out, then Our Story — tucked up underneath — pins on that screen and
 * plays its entrance, and the two scroll away together.
 */
export const CONTACT_HOLD_VH = CONTACT_TUCK_VH - 100;
export const CONTACT_EXIT_VH = 220;
export const CONTACT_UNWIND_VH = 100;
export const LEADERSHIP_TUCK_VH = CONTACT_EXIT_VH + 100 - CONTACT_UNWIND_VH;
