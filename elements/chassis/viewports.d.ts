// Hand-written declarations for viewports.js so TS test files can import the
// two viewports without allowJs. Keep in sync with the JS exports.

/** The phone: the width every mobile measurement and phone capture is taken at. */
export const NARROW_VIEWPORT: Readonly<{ width: number; height: number }>

/** The desktop the mockup is drawn at and the critics review. */
export const WIDE_VIEWPORT: Readonly<{ width: number; height: number }>
