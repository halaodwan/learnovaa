'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudyMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    StudyMaterial.hasMany(models.Exam, {

  foreignKey: 'material_id',

  as: 'exams',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
StudyMaterial.belongsTo(models.User, {

  foreignKey: 'user_id',

  as: 'user',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
StudyMaterial.hasMany(models.Content, {

  foreignKey: 'material_id',

  as: 'contents',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
StudyMaterial.hasMany(models.Flashcard, {

  foreignKey: 'material_id',

  as: 'flashcards',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});

    }
  }
  StudyMaterial.init({
    user_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    type: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'StudyMaterial',
  });
  return StudyMaterial;
};