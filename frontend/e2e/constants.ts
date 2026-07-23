// Shared E2E constants. All E2E-created data is tagged E2E_MARKER (or the admin
// email domain) so global-teardown can delete it from the dev DB.
export const API_URL = "http://localhost:4000";
export const ADMIN_EMAIL = "e2e_admin@gptest.local";
export const ADMIN_PASSWORD = "Test1234!secure";
export const ADMIN_NAME = "__E2E__ Admin";
export const E2E_MARKER = "__E2E__";
