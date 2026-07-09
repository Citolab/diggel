import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import { EnvironmentProvider } from './environments/EnvironmentProvider';
import type { EnvironmentId } from './environments/config';
import { SessionProvider } from './hooks/useSession';
import { EndPage } from './pages/EndPage';
import { FeedPage } from './pages/FeedPage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { StartPage } from './pages/StartPage';
import { WelcomePage } from './pages/WelcomePage';

function EnvShell() {
  const { envId } = useParams<{ envId: string }>();

  if (envId !== 'spacebook' && envId !== 'spacegram') {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <EnvironmentProvider environmentId={envId as EnvironmentId}>
      <Routes>
        <Route path="start" element={<StartPage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="end" element={<EndPage />} />
        <Route path="*" element={<Navigate to="start" replace />} />
      </Routes>
    </EnvironmentProvider>
  );
}

export function App() {
  return (
    <EnvironmentProvider environmentId="spacebook">
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
