import { redirect } from "@/i18n/navigation";

export default async function EspaceClientRoot({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  redirect({locale, href: '/espace-client/dashboard'});
}
