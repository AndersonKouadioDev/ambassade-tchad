import MesDemandesClient from "@/components/espace-client/MesDemandesClient";
import { prefetchMyDemandesListQuery } from "@/features/demande/queries/demande-me-list.query";

export default async function MesDemandes() {
  const params = {
    page: 1,
    limit: 12,
  };

  await prefetchMyDemandesListQuery(params);
  return <MesDemandesClient />;
}
