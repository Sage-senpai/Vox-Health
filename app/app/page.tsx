import { redirect } from 'next/navigation';

/**
 * /app is kept as a stable URL for any external link, but the canonical
 * patient surface lives at /dashboard. This redirect collapses the two so
 * the app has a single source of truth.
 */
export default function PatientApp() {
  redirect('/dashboard');
}
