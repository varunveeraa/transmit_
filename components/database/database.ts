import * as SQLite from 'expo-sqlite';

// Initialize and export the database instance
let db: any;

const initializeDatabase = async () => {
  if (!db) {
    try {
      db = await SQLite.openDatabaseAsync('chatApp.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          conversationId TEXT,
          senderId TEXT,
          receiverId TEXT,
          content TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Database initialized');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }
  return db;
};

export default initializeDatabase;
