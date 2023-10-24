const { DataTypes } = require('sequelize')
const { sequelize } = require('../dbs/init.postgres')

const KeyToken = sequelize.define(
  'KeyToken',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Replace with the actual name of your "Shop" model
        key: 'id',
      },
      primaryKey: true,
    },
    public_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    private_key: {
      type: DataTypes.STRING,
      allowNull: true, // Adjust allowNull based on your requirements
    },
    refresh_token_used: {
      type: DataTypes.JSONB,
      defaultValue: [], // Default value for refresh_token_used
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    timestamps: true,
    modelName: 'KeyToken', // Optional model name
    tableName: 'keys', // Specify the table name
  }
)

module.exports = KeyToken
