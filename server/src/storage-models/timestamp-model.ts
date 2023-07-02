export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export const timestampPropertyTypes: Record<TimestampProperties, string> = {
  createdAt: 'string',
  updatedAt: 'string',
};

export const timestampProperties = ['createdAt', 'updatedAt'] as const;

export type TimestampProperties = typeof timestampProperties[number];
