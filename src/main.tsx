import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimateUIProvider } from '@animate-ui/react/provider';
import { ReducedMotionConfig } from '@animate-ui/react/utils/motion';
import './index.css';

import App from './App.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AnimateUIProvider>
                <ReducedMotionConfig>
                    <App />
                </ReducedMotionConfig>
            </AnimateUIProvider>
        </QueryClientProvider>
    </StrictMode>
);
