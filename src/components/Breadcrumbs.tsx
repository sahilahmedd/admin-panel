"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // removes empty strings

  return (
    <nav className="text-sm text-muted-foreground mb-4">
      <ol className="flex items-center space-x-1">
        <li>
          <Link href="/" className="hover:underline text-primary font-medium">
            Dashboard
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const path = "/" + pathSegments.slice(0, index + 1).join("/");
          const label = segment.replace(/-/g, " ");
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={path} className="flex items-center space-x-1">
              <span className="mx-1 text-gray-400">/</span>
              {isLast ? (
                <span className="capitalize">{label}</span>
              ) : (
                <Link href={path} className="hover:underline capitalize text-primary">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
