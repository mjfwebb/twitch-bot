import useStore from '../../store/store';

import './Song.less';

export const Song = () => {
  const currentSong = useStore((s) => s.currentSong);

  return <div className="song">Current song: {currentSong?.item.name}</div>;
};
