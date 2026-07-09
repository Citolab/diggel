import { t } from '../data/translations';
import { friendAvatarUrl } from '../environments/config';
import { useEnvironment } from '../environments/EnvironmentProvider';
import type { ItemDefinition } from '../types';

/** Author row shown at the top of a feed post: avatar + name + "Posted at …". */
export function FeedPostHeader({ item }: { item: ItemDefinition }) {
  const env = useEnvironment();
  const author = item.author ?? env.susanDisplayName;
  // "Susan" is the persona in item metadata; her avatar is the env profile pic
  // (there is no friend avatar named Susan, so friendAvatarUrl would 404).
  const isPersona = author === env.susanDisplayName || author === 'Susan';
  const avatar = isPersona
    ? env.susanProfilePic
    : friendAvatarUrl(env, author);
  const time = new Date().toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="feed-post__author-row">
      <img className="profile" src={avatar} alt="" />
      <div className="feed-post__author-meta">
        <div className="feed-post__author-name">{author}</div>
        <span className="feed-post__time">
          {t.SPACEBOOK_POSTED} {time}
        </span>
      </div>
    </div>
  );
}
