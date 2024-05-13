import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <div className="h-screen w-screen bg-neutral-100 supports-[height:100dvh]:h-dvh supports-[width:100dvw]:w-dvw">
        <Outlet />
      </div>
    ),
  },
);
