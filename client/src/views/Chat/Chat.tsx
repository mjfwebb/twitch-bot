import './Chat.less';
import { useChatSearchParams } from './useChatSearchParams';
import { NonDisappearingChat } from './NonDisappearingChat';
import { DisappearingChat } from './DisappearingChat';

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
