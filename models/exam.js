'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {

  Exam.hasMany(models.Question, {

    foreignKey: 'exam_id',

    as: 'questions',

    onDelete: 'CASCADE',

    onUpdate: 'CASCADE'

  });
  Exam.belongsTo(models.User, {

  foreignKey: 'user_id',

  as: 'user',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
Exam.belongsTo(models.StudyMaterial, {

  foreignKey: 'material_id',

  as: 'studyMaterial',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
Exam.hasMany(models.Result, {

  foreignKey: 'exam_id',

  as: 'results',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
}

  }
  Exam.init({
    user_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    number_of_questions: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Exam',
  });
  return Exam;
};