import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useSession } from '../hooks/useSession';
import { EndPage } from './EndPage';
import { FeedPage } from './FeedPage';
import { RegistrationPage } from './RegistrationPage';
import { StartPage } from './StartPage';

/**
 * Single page that hosts the whole assessment. Which section view is shown is
 * driven by the session phase (derived from the active QTI section), so the URL
 * stays `/:envId` throughout — no per-phase routes.
 */
export function AssessmentPage() {
  const { envId } = useParams<{ envId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const validEnv = envId === 'spacebook' || envId === 'spacegram';
  const authorized =
    session.loggedIn && session.environment === envId && validEnv;

  useEffect(() => {
    if (!authorized) {
      navigate(session.loggedIn ? '/welcome' : '/', { replace: true });
    }
  }, [authorized, session.loggedIn, navigate]);

  if (!authorized) return null;

  switch (session.phase) {
    case 'registration':
      return <RegistrationPage />;
    case 'feed':
      return <FeedPage />;
    case 'end':
      return <EndPage />;
    case 'start':
    default:
      return <StartPage />;
  }
}
