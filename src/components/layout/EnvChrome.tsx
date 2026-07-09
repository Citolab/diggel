import { FRIENDS } from '../../data/items';
import { t } from '../../data/translations';
import { friendAvatarUrl } from '../../environments/config';
import { useEnvironment } from '../../environments/EnvironmentProvider';

export function SpacebookNavbar() {
  const env = useEnvironment();

  return (
    <nav className={`env-navbar ${env.navbarClass}`}>
      <div className="env-navbar__inner">
        <span className="env-navbar__brand">
          <img src={env.icon} width={24} height={24} alt="" />
          <span>{env.label}</span>
        </span>
      </div>
    </nav>
  );
}

export function SpacebookSidebar() {
  const env = useEnvironment();

  return (
    <aside className="env-sidebar env-sidebar--facebook">
      <div className="profile-card">
        {env.profileCover && (
          <div
            className="profile-card__cover"
            style={{ backgroundImage: `url('${env.profileCover}')` }}
          >
            <img
              className="profile-lg profile-card__avatar"
              src={env.susanProfilePic}
              alt={env.susanDisplayName}
            />
          </div>
        )}
        <div className="profile-card__body">
          <h5>{env.susanDisplayName}</h5>
        </div>
      </div>

      <div className="friends-card">
        <div className="friends-card__header">{t.SPACEBOOK_FRIENDS}</div>
        <div className="friends-card__body">
          {FRIENDS.map((name) => (
            <div key={name} className="friends-card__friend">
              <img
                className="profile-sm"
                src={friendAvatarUrl(env, name)}
                alt=""
              />
              {name}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function SpacegramSidebar() {
  const env = useEnvironment();

  return (
    <aside className="env-sidebar env-sidebar--instagram">
      <div className="spacegram-profile">
        <img
          className="profile-lg spacegram-profile__avatar"
          src={env.susanProfilePic}
          alt=""
        />
        <div className="spacegram-profile__meta">
          <strong>{env.susanDisplayName}</strong>
          <div className="spacegram-profile__sub">Susan</div>
        </div>
      </div>

      <div className="followers-card">
        <div className="followers-card__header">{t.SPACEGRAM_FOLLOWERS}</div>
        <div className="followers-card__body">
          {FRIENDS.map((name) => (
            <div key={name} className="followers-card__follower">
              <img
                className="profile-sm"
                src={friendAvatarUrl(env, name)}
                alt=""
              />
              <div className="followers-card__meta">
                <strong>{name}</strong>
                <span className="followers-card__sub">
                  {t.SPACEGRAM_FOLLOWER}
                </span>
              </div>
            </div>
          ))}
          <span className="followers-card__source">{t.SPACEGRAM_SOURCE}</span>
        </div>
      </div>
    </aside>
  );
}
