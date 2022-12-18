import { sendToAuthId } from '../functions/socket/sendToAuthId';

type HandleErrorArgs = {
  error: unknown;
  authId?: string;
  next?: SocketAcknowledgement;
  errorMessage?: string;
  clientErrorData?: unknown;
  logError?: boolean;
};

export const handleError = ({ error, authId, next, clientErrorData = '', errorMessage = '', logError = true }: HandleErrorArgs): void => {
  if (!(error instanceof Error)) {
    return;
  }
  logError && console.warn(error);

  if (authId) {
    if (clientErrorData) {
      sendToAuthId(authId, clientErrorData);
    }
    sendToAuthId(authId, { error: { name: error.name, message: errorMessage || error.message } });
  } else {
    next && next({ error: { name: error.name, message: errorMessage || error.message } });
  }
};
