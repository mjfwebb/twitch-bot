import useStore from '../../store/store';

import './Song.less';

export const Song = () => {
  const currentSong = useStore((s) => s.currentSong);

  if (!currentSong) {
    return <></>;
  }

  const albumImage = currentSong.item.album.images[0].url;

  return (
    <div className="song-wrapper">
      <div className="song">
        <img src={albumImage} height={128} alt="" />
        <div className="song-info">
          <div className="song-name">{currentSong.item.name}</div>
          <span className="song-artists">{currentSong.item.artists.map((artist) => artist.name).join(', ')}</span>
        </div>
      </div>
    </div>
  );
};
