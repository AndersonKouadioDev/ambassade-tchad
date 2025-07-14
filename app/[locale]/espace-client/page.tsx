import { redirect } from 'next/navigation';

export default function EspaceClientRoot() {
  redirect('./espace-client/dashboard');
  return null;
}
