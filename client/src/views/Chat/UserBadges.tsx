import useStore from '../../store/store';
import type { Badges } from '../../twitchTypes';

interface BadgesProps {
  badges?: Badges;
}

export const UserBadges = ({ badges }: BadgesProps) => {
  const chatBadges = useStore((s) => s.chatBadges);

  if (!badges) {
    return null;
  }

  const badgeImages = Object.entries(badges).map((badge) => {
    const foundBadge = chatBadges[`${badge[0]}_${badge[1]}`];

    if (!foundBadge) {
      return null;
    }

    return <img className="chat-message-badge" alt="" key={foundBadge.name} src={foundBadge.url} width={18}></img>;
  });

  return <>{badgeImages}</>;
};
