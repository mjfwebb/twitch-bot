import { CopyButton } from '../../components/CopyButton/CopyButton';

export const SongDashboard = () => {
  const songURLString = `${document.location.href}song`;

  return (
    <div className="song-dashboard">
      <h2>Current Song (through Spotify)</h2>
      <div className="link">
        <a target="_new" href="/song">
          {songURLString}
        </a>
      </div>
      <CopyButton textToCopy={songURLString} />
    </div>
  );
};
