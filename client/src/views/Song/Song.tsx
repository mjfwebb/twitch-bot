import { useRef } from 'react';

import { motion } from 'framer-motion';

import useStore from '../../store/store';
import type { SpotifySong } from '../../types';
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
  titleDropShadowEnabled,
  titleDropShadowSettings,
  titleTextStrokeEnabled,
  titleTextStrokeSettings,
  artistsDropShadowEnabled,
  artistsDropShadowSettings,
  artistsTextStrokeEnabled,
  artistsTextStrokeSettings,
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
  titleDropShadowEnabled: boolean;
  titleDropShadowSettings: string;
  titleTextStrokeEnabled: boolean;
  titleTextStrokeSettings: string;
  artistsDropShadowEnabled: boolean;
  artistsDropShadowSettings: string;
  artistsTextStrokeEnabled: boolean;
  artistsTextStrokeSettings: string;
  currentSong: SpotifySong;
  albumImage: string;
  showAlbumArt: boolean;
}) => {
  const songInfoRef = useRef<HTMLDivElement>(null);
  const songTitleRef = useRef<HTMLDivElement>(null);
  const songArtistsRef = useRef<HTMLDivElement>(null);
  const songInfoWidth = songInfoRef.current?.clientWidth || 0;
  const titleWidth = songTitleRef.current?.offsetWidth || 0;
  const artistsWidth = songArtistsRef.current?.offsetWidth || 0;
  const titleTooWide = titleWidth > songInfoWidth;
  const artistsTooWide = artistsWidth > songInfoWidth;

  // Add 32px for padding
  const titleOverflowWidth = titleWidth + 32 - songInfoWidth;
  const artistsOverflowWidth = artistsWidth + 32 - songInfoWidth;

  // Animation duration should be based on the overflow width and the font size
  const titleAnimationDuration = Math.ceil((Math.ceil(titleOverflowWidth / +titleFontSize) * 2000) / 1000);
  const artistsAnimationDuration = Math.ceil((Math.ceil(artistsOverflowWidth / +artistsFontSize) * 2000) / 1000);

  return (
    <div
      className="song"
      style={{
        width: width,
        height: height,
      }}
    >
      {showAlbumArt && <img src={albumImage} height={128} alt="" />}
      <div ref={songInfoRef} className="song-info">
        <motion.div
          className="song-title-wrapper"
          ref={songTitleRef}
          animate={{
            ...(titleTooWide
              ? {
                  x: [0, -titleOverflowWidth],
                }
              : {}),
          }}
          style={{
            ...(titleTooWide
              ? {
                  transform: `translateX(0px)`,
                }
              : {}),
          }}
          transition={{
            ...(titleTooWide
              ? {
                  ease: 'linear',
                  duration: titleAnimationDuration,
                  repeatDelay: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }
              : {}),
          }}
        >
          <div
            className="song-title"
            style={{
              color: primaryColor,
              fontFamily: titleFontFamily,
              fontSize: `${titleFontSize}px`,
              backgroundImage: `linear-gradient(45deg, ${secondaryColor} 20%, ${primaryColor} 30%, ${primaryColor} 70%, ${secondaryColor} 80%)`,
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% auto',
              ...(titleDropShadowEnabled
                ? {
                    textShadow: titleDropShadowSettings,
                  }
                : {}),
              ...(titleTextStrokeEnabled
                ? {
                    ['-webkit-text-stroke']: titleTextStrokeSettings,
                  }
                : {}),
            }}
          >
            {currentSong.item.name}
          </div>
        </motion.div>
        <motion.div
          className="song-artists-wrapper"
          ref={songArtistsRef}
          animate={{
            ...(artistsTooWide
              ? {
                  x: [0, -artistsOverflowWidth],
                }
              : {}),
          }}
          style={{
            ...(artistsTooWide
              ? {
                  transform: `translateX(0px)`,
                }
              : {}),
          }}
          transition={{
            ...(artistsTooWide
              ? {
                  ease: 'linear',
                  duration: artistsAnimationDuration,
                  repeat: Infinity,
                  repeatDelay: 2,
                  repeatType: 'reverse',
                }
              : {}),
          }}
        >
          <div
            className="song-artists"
            style={{
              color: primaryColor,
              fontFamily: artistsFontFamily,
              fontSize: `${artistsFontSize}px`,
              ...(artistsDropShadowEnabled
                ? {
                    textShadow: artistsDropShadowSettings,
                  }
                : {}),
              ...(artistsTextStrokeEnabled
                ? {
                    ['-webkit-text-stroke']: artistsTextStrokeSettings,
                  }
                : {}),
            }}
          >
            {currentSong.item.artists.map((artist) => artist.name).join(', ')}
          </div>
        </motion.div>
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
      titleDropShadowEnabled={songSearchParams.titleDropShadowEnabled}
      titleDropShadowSettings={songSearchParams.titleDropShadowSettings}
      titleTextStrokeEnabled={songSearchParams.titleTextStrokeEnabled}
      titleTextStrokeSettings={songSearchParams.titleTextStrokeSettings}
      artistsDropShadowEnabled={songSearchParams.artistsDropShadowEnabled}
      artistsDropShadowSettings={songSearchParams.artistsDropShadowSettings}
      artistsTextStrokeEnabled={songSearchParams.artistsTextStrokeEnabled}
      artistsTextStrokeSettings={songSearchParams.artistsTextStrokeSettings}
      currentSong={currentSong}
      albumImage={albumImage}
      showAlbumArt={songSearchParams.showAlbumArt}
    />
  );
};
