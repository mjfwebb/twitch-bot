import { useEffectOnce, useInterval } from 'react-use';

import useStore from '../../store/store';

export const MarkOrRemoveOldChatMessages = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const disappears = searchParams.get('disappears') === 'true' ? true : false;
  const disappearsTime = searchParams.get('disappears-time') !== null ? Number(searchParams.get('disappears-time')) : 10;

  useEffectOnce(() => {
    if (disappears) {
      useStore.getState().markOrRemoveOldMessages(disappearsTime);
    }
  });

  useInterval(() => {
    if (disappears) {
      useStore.getState().markOrRemoveOldMessages(disappearsTime);
    }
  }, 1000);

  return null;
};
