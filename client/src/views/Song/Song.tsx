import type { SpotifySong } from '../../types';
import useStore from '../../store/store';
import { useSongSearchParams } from './useChatSearchParams';

import './Song.less';

export const SongDisplay = ({
  primaryColor,
  secondaryColor,
  width,
  height,
  titleFontFamily,
  titleFontSize,
  artistsFontFamily,
  artistsFontSize,
  dropShadowEnabled,
  dropShadowSettings,
  textStrokeEnabled,
  textStrokeSettings,
  currentSong,
  albumImage,
  showAlbumArt,
}: {
  primaryColor: string;
  secondaryColor: string;
  width: string;
  height: string;
  titleFontFamily: string;
  titleFontSize: string;
  artistsFontFamily: string;
  artistsFontSize: string;
  dropShadowEnabled: boolean;
  dropShadowSettings: string;
  textStrokeEnabled: boolean;
  textStrokeSettings: string;
  currentSong: SpotifySong;
  albumImage: string;
  showAlbumArt: boolean;
}) => {
  return (
    <div
      className="song-wrapper"
      style={{
        width: width,
        height: height,
      }}
    >
      <div className="song">
        {showAlbumArt && <img src={albumImage} height={128} alt="" />}
        <div
          className="song-info"
          style={{
            ...(dropShadowEnabled
              ? {
                  textShadow: dropShadowSettings,
                }
              : {}),
            ...(textStrokeEnabled
              ? {
                  ['-webkit-text-stroke']: textStrokeSettings,
                }
              : {}),
          }}
        >
          <div className="song-title-wrapper">
            <div
              className="song-title"
              style={{
                color: primaryColor,
                fontFamily: titleFontFamily,
                fontSize: titleFontSize,
                backgroundImage: `linear-gradient(45deg, ${secondaryColor} 20%, ${primaryColor} 30%, ${primaryColor} 70%, ${secondaryColor} 80%)`,
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% auto',
              }}
            >
              {currentSong.item.name}
            </div>
          </div>
          <div className="song-artists-wrapper">
            <div
              className="song-artists"
              style={{
                color: primaryColor,
                fontFamily: artistsFontFamily,
                fontSize: artistsFontSize,
                textShadow: dropShadowEnabled ? dropShadowSettings : 'none',
              }}
            >
              {currentSong.item.artists.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Song = () => {
  const currentSong = useStore((s) => s.currentSong);
  const songSearchParams = useSongSearchParams();

  if (!currentSong) {
    return <></>;
  }

  const albumImage = currentSong.item.album.images[0].url;

  return (
    <SongDisplay
      primaryColor={songSearchParams.primaryColor}
      secondaryColor={songSearchParams.secondaryColor}
      width={songSearchParams.width}
      height={songSearchParams.height}
      titleFontFamily={songSearchParams.titleFontFamily}
      titleFontSize={songSearchParams.titleFontSize}
      artistsFontFamily={songSearchParams.artistsFontFamily}
      artistsFontSize={songSearchParams.artistsFontSize}
      dropShadowEnabled={songSearchParams.dropShadowEnabled}
      dropShadowSettings={songSearchParams.dropShadowSettings}
      textStrokeEnabled={songSearchParams.textStrokeEnabled}
      textStrokeSettings={songSearchParams.textStrokeSettings}
      currentSong={currentSong}
      albumImage={albumImage}
      showAlbumArt={songSearchParams.showAlbumArt}
    />
  );
};
