import appCss from "@/app/global.css?url";
import { type QueryClient, useQueryClient } from "@tanstack/react-query";
import { Outlet, ScrollRestoration, createRootRouteWithContext } from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/utils";
import type { ReactNode } from "react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
});

function HydrateQueryClientAtom({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
}

function RootComponent() {
  return (
    <RootDocument>
      <HydrateQueryClientAtom>
        <Outlet />
      </HydrateQueryClientAtom>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
