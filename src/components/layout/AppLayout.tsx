import type { ReactNode } from 'react';

import { useEnvironment } from '../../environments/EnvironmentProvider';
import {
  SpacebookNavbar,
  SpacebookSidebar,
  SpacegramSidebar,
} from './EnvChrome';

interface AppLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function AppLayout({ children, sidebar }: AppLayoutProps) {
  const env = useEnvironment();

  if (env.layout === 'instagram') {
    return (
      <div className="env-app">
        <SpacebookNavbar />
        <main className="env-main">
          <div className="env-grid env-grid--instagram">
            <div className="env-grid__feed">{children}</div>
            <div className="env-grid__aside">
              {sidebar ?? <SpacegramSidebar />}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="env-app">
      <SpacebookNavbar />
      <main className="env-main">
        <div className="env-grid env-grid--facebook">
          <div className="env-grid__sidebar">
            {sidebar ?? <SpacebookSidebar />}
          </div>
          <div className="env-grid__feed">{children}</div>
          <div className="env-grid__spacer" />
        </div>
      </main>
    </div>
  );
}
