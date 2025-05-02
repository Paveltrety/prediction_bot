export interface IMessagesCollectionModel {
  userId: number;
  username: string;
  messageCount: number;
  predictionCount: number;
}

export interface IMessagesCollectionHistoryModel {
  userId: number;
  chatId: number;
  username: string;
  text: string;
  timestamp: Date;
  messageId: number;
}
