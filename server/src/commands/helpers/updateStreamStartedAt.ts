import Config from '../../config';
import StreamModel from '../../models/stream-model';
import { setStreamStartedAt } from '../../streamState';

export async function updateStreamStartedAt(startedAt: string): Promise<void> {
  setStreamStartedAt(startedAt);

  if (!Config.mongoDB.enabled) {
    return;
  }

  const stream = await StreamModel.findOne({});
  if (stream) {
    stream.startedAt = startedAt;
    await stream.save();
  } else {
    const newStream = new StreamModel({ startedAt });
    await newStream.save();
  }
}
