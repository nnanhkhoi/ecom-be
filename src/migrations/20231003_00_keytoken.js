const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('keys', {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('keys')
  },
}
