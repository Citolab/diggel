import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import { EnvironmentProvider } from './environments/EnvironmentProvider';
import type { EnvironmentId } from './environments/config';
import { SessionProvider } from './hooks/useSession';
import { AssessmentPage } from './pages/AssessmentPage';
import { LoginPage } from './pages/LoginPage';
import { WelcomePage } from './pages/WelcomePage';

function EnvShell() {
  const { envId } = useParams<{ envId: string }>();

  if (envId !== 'spacebook' && envId !== 'spacegram') {
    return <Navigate to="/welcome" replace />;
  }

  // One page for the whole assessment; the session phase (derived from the QTI
  // section) decides which view renders. URL stays /:envId throughout.
  return (
    <EnvironmentProvider environmentId={envId as EnvironmentId}>
      <AssessmentPage />
    </EnvironmentProvider>
  );
}

export function App() {
  return (
    <EnvironmentProvider environmentId="spacebook" applyTheme={false}>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/:envId/*" element={<EnvShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionProvider>
    </EnvironmentProvider>
  );
}
