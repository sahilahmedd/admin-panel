"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs based on the current path if no items are provided
  const breadcrumbs = useMemo(() => {
    if (items.length > 0) return items;

    if (!pathname || pathname === "/") return [];

    const segments = pathname.split("/").filter(Boolean);
    let path = "";

    return segments.map((segment, index) => {
      path = `${path}/${segment}`;

      // Format the label to be more readable (capitalize, replace hyphens with spaces)
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      // If it's the last segment, don't make it a link
      return {
        label,
        href: index < segments.length - 1 ? path : undefined,
      };
    });
  }, [pathname, items]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-indigo-600 flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.label} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400 flex-shrink-0" />

              {isLast ? (
                <span className="font-medium text-gray-900 truncate">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href!}
                  className="text-gray-500 hover:text-indigo-600 truncate"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
