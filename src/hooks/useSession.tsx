import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { ITEMS_BY_ENV } from '../data/items';
import type { EnvironmentId } from '../environments/config';
import type { ItemResult, SessionState } from '../types';

const STORAGE_KEY = 'diggel-new-session';

const defaultState: SessionState = {
  loggedIn: false,
  isDemo: false,
  environment: null,
  phase: 'login',
  currentIndex: 0,
  results: [],
};

function load(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return defaultState;
}

function persist(state: SessionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface SessionContextValue {
  session: SessionState;
  items: ReturnType<typeof getItems>;
  currentItem: ReturnType<typeof getItems>[number] | null;
  currentIndex: number;
  isComplete: boolean;
  enterDemo: () => void;
  selectEnvironment: (environment: EnvironmentId) => void;
  beginRegistration: () => void;
  recordResult: (result: ItemResult) => void;
  advance: (result?: ItemResult) => void;
  reset: () => void;
}

function getItems(environment: EnvironmentId | null) {
  return environment ? ITEMS_BY_ENV[environment] : [];
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(load);

  useEffect(() => {
    persist(session);
  }, [session]);

  const patch = useCallback((updater: (prev: SessionState) => SessionState) => {
    setSession((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const items = getItems(session.environment);
  const currentItem = items[session.currentIndex] ?? null;
  const isComplete =
    session.environment !== null && session.currentIndex >= items.length;

  const enterDemo = useCallback(() => {
    patch(() => ({
      loggedIn: true,
      isDemo: true,
      environment: null,
      phase: 'welcome',
      currentIndex: 0,
      results: [],
    }));
  }, [patch]);

  const selectEnvironment = useCallback(
    (environment: EnvironmentId) => {
      patch((s) => ({
        ...s,
        environment,
        phase: 'start',
        currentIndex: 0,
        results: [],
      }));
    },
    [patch]
  );

  const beginRegistration = useCallback(() => {
    patch((s) => ({ ...s, phase: 'registration', currentIndex: 0 }));
  }, [patch]);

  const recordResult = useCallback(
    (result: ItemResult) => {
      patch((prev) => {
        const index = prev.results.findIndex((r) => r.id === result.id);
        const results =
          index === -1
            ? [...prev.results, result]
            : prev.results.map((r) => (r.id === result.id ? result : r));
        return { ...prev, results };
      });
    },
    [patch]
  );

  const advance = useCallback(
    (result?: ItemResult) => {
      patch((prev) => {
        const envItems = prev.environment
          ? ITEMS_BY_ENV[prev.environment]
          : [];
        const nextIndex = prev.currentIndex + 1;
        const nextPhase: SessionState['phase'] =
          nextIndex >= envItems.length
            ? 'end'
            : nextIndex === 1
              ? 'feed'
              : prev.phase;

        let results = prev.results;
        if (result) {
          const index = results.findIndex((r) => r.id === result.id);
          results =
            index === -1
              ? [...results, result]
              : results.map((r) => (r.id === result.id ? result : r));
        }

        return {
          ...prev,
          currentIndex: Math.min(nextIndex, envItems.length),
          phase: nextPhase,
          results,
        };
      });
    },
    [patch]
  );

  const reset = useCallback(() => {
    persist(defaultState);
    setSession(defaultState);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        items,
        currentItem,
        currentIndex: session.currentIndex,
        isComplete,
        enterDemo,
        selectEnvironment,
        beginRegistration,
        recordResult,
        advance,
        reset,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession requires SessionProvider');
  return ctx;
}
