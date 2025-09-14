"use client";

import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  const allItems = [
    { name: "Home", href: "/", current: false },
    ...items.map((item, index) => ({
      ...item,
      current: index === items.length - 1,
    })),
  ];

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 text-sm">
        {allItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === 0 ? (
              <div className="flex items-center">
                {item.current ? (
                  <span className="flex items-center text-gray-500 dark:text-gray-400">
                    <HomeIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="ml-1 font-medium">{item.name}</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <HomeIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="ml-1 font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                {item.current ? (
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="ml-2 font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
