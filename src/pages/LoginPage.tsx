import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { t } from '../data/translations';
import { useSession } from '../hooks/useSession';

export function LoginPage() {
  const navigate = useNavigate();
  const { enterDemo } = useSession();
  const [accepted, setAccepted] = useState(false);

  const handleDemo = () => {
    if (!accepted) return;
    enterDemo();
    navigate('/welcome');
  };

  return (
    <div className="login-page">
      <div className="login-page__panel login-page__panel--dark">
        <label className="login-page__terms">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span className={accepted ? 'text-light' : 'text-muted'}>
            {t.DIGGEL_TERMS}
          </span>
        </label>
        <button
          type="button"
          className="btn btn-primary btn-lg btn-block"
          disabled={!accepted}
          onClick={handleDemo}
        >
          {t.DIGGEL_LOGIN}
        </button>
      </div>
      <div className="login-page__panel login-page__panel--light">
        <p className="lead font-weight-bold">{t.DIGGEL_TITLE}.</p>
        <p className="text-secondary">{t.DIGGEL_LOGIN_DESCRIPTION}</p>
        <p className="font-italic">{t.DIGGEL_GOOD_LUCK}</p>
        <div className="login-page__logos">
          <img
            src="/assets/diggel/partnerlogos/universityoftwente.svg"
            alt="University of Twente"
            width={180}
          />
          <img
            src="/assets/diggel/partnerlogos/citolab-logo.svg"
            alt="Citolab"
            height={32}
          />
        </div>
      </div>
    </div>
  );
}
