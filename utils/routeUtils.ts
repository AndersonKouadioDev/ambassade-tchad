export interface SubRoute {
    label: string;
    href: string;
    id: string;
}

export interface MenuItem {
    label: string;
    href: string;
    icon?: any;
    id: string;
    expandable?: boolean;
    subRoutes?: SubRoute[];
}

/**
 * Nettoie et normalise une URL pour la comparaison
 */
export function normalizePathname(pathname: string): string {
    return pathname.toLowerCase().replace(/\/$/, '');
}

/**
 * Vérifie si une route est active
 */
export function isRouteActive(currentPath: string, targetHref: string, exact = false): boolean {
    const cleanCurrent = normalizePathname(currentPath);
    const cleanTarget = normalizePathname(targetHref);

    if (exact) {
        return cleanCurrent === cleanTarget;
    }

    return cleanCurrent === cleanTarget;
}

/**
 * Vérifie si au moins une sous-route est active
 */
export function hasActiveSubRoute(currentPath: string, subRoutes: SubRoute[]): boolean {
    return subRoutes.some(subRoute =>
        isRouteActive(currentPath, subRoute.href)
    );
}

/**
 * Extrait les sous-routes dynamiques basées sur le pathname actuel
 */
export function extractDynamicSubRoutes(
    pathname: string,
    locale: string,
    tServices: (key: string) => string
): { mesDemandesSubRoutes: SubRoute[]; nouvelleDemandeSub: SubRoute[] } {
    const cleanPathname = normalizePathname(pathname);

    // Sous-routes pour "Mes demandes"
    const mesDemandesSubRoutes: SubRoute[] = [];
    const demandeMatch = cleanPathname.match(/\/mes-demandes\/([^\/]+)/);
    if (demandeMatch) {
        const demandeId = demandeMatch[1].toUpperCase();
        mesDemandesSubRoutes.push({
            label: demandeId,
            href: `/${locale}/espace-client/mes-demandes/${demandeMatch[1]}`,
            id: `demande-${demandeMatch[1]}`
        });
    }

    // Sous-routes pour "Nouvelle demande"
    const nouvelleDemandeSub: SubRoute[] = [
        {
            label: tServices('overview'),
            href: `/${locale}/espace-client/nouvelle-demande`,
            id: 'overview'
        },
        {
            label: tServices('visa'),
            href: `/${locale}/espace-client/nouvelle-demande/visa`,
            id: 'visa'
        },
        {
            label: tServices('acteNaissance'),
            href: `/${locale}/espace-client/nouvelle-demande/birth-act`,
            id: 'birth-act'
        },
        {
            label: tServices('carteConsulaire'),
            href: `/${locale}/espace-client/nouvelle-demande/consular-card`,
            id: 'consular-card'
        },
        {
            label: tServices('laissezPasser'),
            href: `/${locale}/espace-client/nouvelle-demande/laissez-passer`,
            id: 'laissez-passer'
        },
        {
            label: tServices('capaciteMariage'),
            href: `/${locale}/espace-client/nouvelle-demande/marriage-capacity`,
            id: 'marriage-capacity'
        },
        {
            label: tServices('acteDeces'),
            href: `/${locale}/espace-client/nouvelle-demande/death-act`,
            id: 'death-act'
        },
        {
            label: tServices('procuration'),
            href: `/${locale}/espace-client/nouvelle-demande/power-of-attorney`,
            id: 'power-of-attorney'
        },
        {
            label: tServices('certificatNationalite'),
            href: `/${locale}/espace-client/nouvelle-demande/nationality-certificate`,
            id: 'nationality-certificate'
        }
    ];

    return { mesDemandesSubRoutes, nouvelleDemandeSub };
}