'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
  
    static associate(models) {
      // define association here
      Answer.belongsTo(models.Question, {

    foreignKey: 'question_id',

    as: 'question',

    onDelete: 'CASCADE',

    onUpdate: 'CASCADE'

  });
  Answer.belongsTo(models.User, {

  foreignKey: 'user_id',

  as: 'user',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
Answer.belongsTo(models.Option, {

  foreignKey: 'selected_option_id',

  as: 'option',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});


    }
  }
  Answer.init({
    user_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    selected_option_id: DataTypes.INTEGER,
    answer_text: DataTypes.STRING,
    is_correct: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};