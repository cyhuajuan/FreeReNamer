import ReactDOM from 'react-dom/client';
import './styles.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { atomStore } from './lib/atoms';

const queryClient = new QueryClient();
const router = createRouter({ routeTree, context: { queryClient } });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={atomStore}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>,
);
