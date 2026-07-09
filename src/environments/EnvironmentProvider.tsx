import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

import {
  ENVIRONMENTS,
  type EnvironmentConfig,
  type EnvironmentId,
} from './config';

const EnvironmentContext = createContext<EnvironmentConfig>(ENVIRONMENTS.spacebook);

export function EnvironmentProvider({
  environmentId,
  children,
}: {
  environmentId: EnvironmentId;
  children: ReactNode;
}) {
  const config = useMemo(() => ENVIRONMENTS[environmentId], [environmentId]);

  useEffect(() => {
    document.documentElement.dataset.environment = config.theme;
    document.documentElement.style.setProperty('--env-primary', config.primary);
    document.documentElement.style.setProperty(
      '--env-primary-light',
      config.primaryLight
    );
    document.documentElement.style.setProperty('--env-body-bg', config.bodyBg);
  }, [config]);

  return (
    <EnvironmentContext.Provider value={config}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
