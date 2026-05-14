'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    Result.belongsTo(models.User, {

  foreignKey: 'user_id',

  as: 'user',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
Result.belongsTo(models.Exam, {

  foreignKey: 'exam_id',

  as: 'exam',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});


    }
  }
  Result.init({
    exam_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Result',
  });
  return Result;
};