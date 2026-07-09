/**
 * Per-environment app config. The item list itself is no longer registered
 * here — it is derived from each environment's QTI assessment test (see
 * loadAssessmentStructure). Only the test location and app chrome config live
 * here.
 */
export const TEST_URL_BY_ENV = {
  spacebook: '/packages/spacebook/assessment-test.xml',
  spacegram: '/packages/spacegram/assessment-test.xml',
} as const;

/** Registration wizard steps (chrome), mirrored by the div-registration-steps rubric. */
export const REGISTRATION_STEPS = [
  'Account',
  'Preferences',
  'Profile picture',
  'Groups',
  'Pages',
] as const;

export const FRIENDS = ['Bahia', 'Camil', 'Tom', 'Anne', 'Novan'] as const;
