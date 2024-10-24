import initializeDatabase from './database';

export const storeEncryptedMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  message: string
): Promise<number | void> => {
  const db = await initializeDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO messages (conversationId, senderId, receiverId, content) VALUES (?, ?, ?, ?)',
      [conversationId, senderId, receiverId, message]
    );
    const lastInsertRowId: number = result.lastInsertRowId;
    console.log('Last Insert Row ID:', lastInsertRowId);
    return lastInsertRowId;
  } catch (error) {
    console.error('Error storing encrypted message:', error);
  }
};

export const fetchEncryptedMessage = async (messageId: number): Promise<string | undefined> => {
  const db = await initializeDatabase();
  try {
    const row = await db.getFirstAsync('SELECT * FROM messages WHERE id = ?', [messageId]);
    if (row) {
      return row.content;
    } else {
      console.log('No message found');
    }
  } catch (error) {
    console.error('Error fetching message:', error);
  }
};
