import StreamModel from '../models/stream-model';

export async function updateStreamStartedAt(startedAt: string): Promise<void> {
  const stream = await StreamModel.findOne({});
  if (stream) {
    stream.startedAt = startedAt;
    await stream.save();
  } else {
    const newStream = new StreamModel({ startedAt });
    await newStream.save();
  }
}
