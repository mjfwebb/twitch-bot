import './Chat.less';
import { NonDisappearingChat } from './NonDisappearingChat';
import { DisappearingChat } from './DisappearingChat';

export const Chat = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const foreground = searchParams.get('foreground') || 'white';
  const background = searchParams.get('background') || 'transparent';
  const disappears = searchParams.get('disappears') === 'true' ? true : false;
  const chatWidth = searchParams.get('width') || '500px';
  const chatHeight = searchParams.get('height') || '100vh';

  return (
    <div className="chat" style={{ background, width: chatWidth ?? undefined, height: chatHeight ?? undefined, color: foreground ?? undefined }}>
      {disappears ? <DisappearingChat /> : <NonDisappearingChat />}
    </div>
  );
};
