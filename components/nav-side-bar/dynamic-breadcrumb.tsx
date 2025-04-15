"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { navData } from "./nav-data";

type BreadcrumbItemType = {
  title: string;
  url: string;
  isLastItem?: boolean;
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Construir o breadcrumb com base no pathname atual
  const breadcrumbItems = useMemo(() => {
    // Sempre inicia com Dashboard
    const items: BreadcrumbItemType[] = [
      { title: "Dashboard", url: "/dashboard" },
    ];

    if (pathname === "/dashboard") {
      // Se estiver na página principal, apenas mostra Dashboard como atual
      return items.map((item, index) => ({
        ...item,
        isLastItem: index === items.length - 1,
      }));
    }

    // Para outras páginas, precisamos encontrar o item correspondente na navegação
    // E construir o breadcrumb adequadamente
    const getItemForPath = (path: string): BreadcrumbItemType | null => {
      // Procurar primeiro nos itens de nível superior
      for (const navItem of navData.navMain) {
        if (navItem.url === path) {
          return { title: navItem.title, url: navItem.url };
        }

        // Se não encontrou no nível superior, procura nos subitens
        if (navItem.items) {
          for (const subItem of navItem.items) {
            if (subItem.url === path) {
              return { title: subItem.title, url: subItem.url };
            }
          }
        }
      }
      return null;
    };

    // Construir o caminho hierárquico
    const pathSegments = pathname.split("/").filter(Boolean);
    let currentPath = "";

    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += "/" + pathSegments[i];

      // Pular o primeiro segmento ('dashboard') pois já foi adicionado
      if (i === 0 && pathSegments[i] === "dashboard") continue;

      const item = getItemForPath(currentPath);
      if (item) {
        items.push(item);
      }
    }

    // Se não encontrou nenhum item além do dashboard, mas o pathname é diferente,
    // adiciona o último segmento como item final
    if (items.length === 1 && pathname !== "/dashboard") {
      const lastSegment = pathname.split("/").filter(Boolean).pop() || "";
      items.push({
        title:
          lastSegment.charAt(0).toUpperCase() +
          lastSegment.slice(1).replace(/-/g, " "),
        url: pathname,
      });
    }

    // Marca o último item
    return items.map((item, index) => ({
      ...item,
      isLastItem: index === items.length - 1,
    }));
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.url}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {item.isLastItem ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
