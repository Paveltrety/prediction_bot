export interface IMessagesCollectionModel {
  userId: number;
  username: string;
  messageCount: number;
  predictionCount: number;
}

export interface IMessagesHistoryCollectionModel {
  userId: number;
  chatId: number;
  username: string;
  text: string;
  timestamp: Date;
  messageId: number;
}

export interface IMessagesChunksCollectionModel {
  userId: number;
  chatId: number;
  username: string;
  from: Date;
  to: Date;
  text: string;
  createdAt: Date;
}

export interface ISaveUserMessageParams {
  userId: number;
  chatId: number;
  username: string;
  messageId?: number;
  text: string;
  timestamp: Date;
}

export interface ITryCreateChunkForUserParams {
  username: string;
  userId: number;
  chatId: number;
  chunkSize?: number;
}
