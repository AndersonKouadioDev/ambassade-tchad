"use client";
import { usePathname } from "next/navigation";
import { Children } from "react";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Si on est dans l'espace client, n'affiche que le contenu principal (children)
  if (pathname.includes("/espace-client")) {
    // On suppose que le layout global structure les children comme [<Head/>, contenu, <Footer/>]
    const arrayChildren = Children.toArray(children);
    // Le contenu principal est à l'index 1
    return <div className="w-full overflow-x-hidden">{arrayChildren[1]}</div>;
  }
  // Sinon, affiche tout (header, children, footer)
  return <div className="w-full overflow-x-hidden">{children}</div>;
}
