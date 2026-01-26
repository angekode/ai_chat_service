import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';

export default async function globalSetup() {
  process.env.NODE_ENV = 'test';
  dotenv.config();

  const url = process.env.PG_DATABASE_URL;
  if (!url) {
    throw new Error('PG_DATABASE_URL is missing');
  }

  const sequelize = new Sequelize(url, {
    define: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    logging: false
  });

  sequelize.define(
    'User',
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    { tableName: 'user' }
  );

  sequelize.define(
    'Conversation',
    {
      title: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    { tableName: 'conversation' }
  );

  sequelize.define(
    'Message',
    {
      role: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      conversation_id: { type: DataTypes.INTEGER, allowNull: false }
    },
    { tableName: 'message' }
  );

  await sequelize.sync({ force: true });
  await sequelize.close();
}
