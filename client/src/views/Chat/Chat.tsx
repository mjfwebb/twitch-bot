import { DisappearingChat } from './DisappearingChat';
import { NonDisappearingChat } from './NonDisappearingChat';
import { useChatSearchParams } from './useChatSearchParams';

import './Chat.less';

export const Chat = () => {
  const chatSearchParams = useChatSearchParams();

  return (
    <div
      className="chat"
      style={{
        background: chatSearchParams.backgroundColor,
        width: chatSearchParams.width,
        height: chatSearchParams.height,
        color: chatSearchParams.foregroundColor,
        fontSize: chatSearchParams.fontSize,
        fontFamily: chatSearchParams.fontFamily,
      }}
    >
      {chatSearchParams.animatedExit ? <DisappearingChat /> : <NonDisappearingChat />}
    </div>
  );
};
