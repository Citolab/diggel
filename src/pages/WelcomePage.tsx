import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ENVIRONMENTS, type EnvironmentId } from '../environments/config';
import { t } from '../data/translations';
import { useSession } from '../hooks/useSession';
import { SusanNotification } from '../components/SusanNotification';

const PICKER_ENVS: EnvironmentId[] = ['spacebook', 'spacegram'];

export function WelcomePage() {
  const navigate = useNavigate();
  const { selectEnvironment, session } = useSession();
  const [showSusan, setShowSusan] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSusan(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!session.loggedIn) {
    navigate('/');
    return null;
  }

  return (
    <div className="welcome-page">
      <SusanNotification
        notification={
          showSusan
            ? { itemId: 'welcome', html: `<p>${t.DIGGEL_WELCOME}</p>` }
            : null
        }
        onDismiss={() => setShowSusan(false)}
      />

      <h2 className="welcome-page__title">{t.DIGGEL_PICK_ENV}</h2>
      <div className="welcome-page__grid">
        {PICKER_ENVS.map((id) => {
          const env = ENVIRONMENTS[id];
          return (
            <button
              key={id}
              type="button"
              className="welcome-page__card"
              onClick={() => {
                selectEnvironment(id);
                navigate(`/${id}`);
              }}
            >
              <img src={env.logoPicker} alt={env.label} />
              <span>{env.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
