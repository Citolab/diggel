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
  applyTheme = true,
}: {
  environmentId: EnvironmentId;
  children: ReactNode;
  /**
   * Whether this provider writes the document theme (`data-environment` + CSS
   * vars). Only the innermost, route-specific provider should — the app-level
   * fallback used for login/welcome must not, or (because React runs child
   * effects before parent) it would clobber the active environment's theme.
   */
  applyTheme?: boolean;
}) {
  const config = useMemo(() => ENVIRONMENTS[environmentId], [environmentId]);

  useEffect(() => {
    if (!applyTheme) return;
    // Theme CSS vars are keyed on data-environment in index.css, so we only set
    // the attribute (also read by currentEnvironmentConfig for the web
    // components). Setting vars inline here previously let the app-level fallback
    // provider clobber the active environment's theme. Reset on unmount so
    // login/welcome fall back to the :root default.
    const root = document.documentElement;
    root.dataset.environment = config.theme;
    return () => {
      delete root.dataset.environment;
    };
  }, [applyTheme, config]);

  return (
    <EnvironmentContext.Provider value={config}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
