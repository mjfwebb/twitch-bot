import { CopyButton } from '../../components/CopyButton';

export const SongDashboard = () => {
  const songURLString = `${document.location.href}song`;

  return (
    <>
      <h2>Current Song (through Spotify)</h2>
      <a target="_new" href="/song">
        {songURLString}
      </a>
      <CopyButton textToCopy={songURLString} />
    </>
  );
};
