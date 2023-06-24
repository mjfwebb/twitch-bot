import { useEffect, useRef, useState } from 'react';

import { useCopyToClipboard } from 'react-use';

import './CopyButton.less';

export const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const showCopiedTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (copyState.error || copyState.value) {
      clearTimeout(showCopiedTimeout.current);
      showCopiedTimeout.current = setTimeout(() => {
        setShowCopied(false);
      }, 5000);
    }
    () => {
      clearTimeout(showCopiedTimeout.current);
    };
  }, [copyState]);

  return (
    <div className="copy-button-wrapper">
      <button
        onClick={() => {
          setShowCopied(true);
          copyToClipboard(textToCopy);
        }}
      >
        copy
      </button>
      {showCopied && (
        <span className="copy-button-text">{copyState.error ? 'Something went wrong!' : copyState.value ? 'Link copied to clipboard' : ''}</span>
      )}
    </div>
  );
};
