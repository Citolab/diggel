import { useNavigate, useParams } from 'react-router-dom';

import { useEnvironment } from '../environments/EnvironmentProvider';
import { t } from '../data/translations';
import { useSession } from '../hooks/useSession';

export function EndPage() {
  const { envId } = useParams<{ envId: string }>();
  const navigate = useNavigate();
  const env = useEnvironment();
  const { reset, session } = useSession();

  if (!session.loggedIn || session.environment !== envId) {
    navigate('/welcome');
    return null;
  }

  return (
    <div
      className="end-page"
      style={{ backgroundImage: `url('${env.splashEn}')` }}
    >
      <p className="end-page__message">{t.SPACEBOOK_COMPLETE}</p>
      <button
        type="button"
        className="btn btn-dark btn-lg end-page__btn"
        onClick={() => {
          reset();
          navigate('/');
        }}
      >
        {t.SPACEBOOK_END_FINISH}
      </button>
    </div>
  );
}
