'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User, {

  foreignKey: 'user_id',

  as: 'user',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
    }
  }
  Task.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    time: DataTypes.STRING,
    is_completed: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};