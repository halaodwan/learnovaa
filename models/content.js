'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
   
    static associate(models) {
    
  Content.belongsTo(models.StudyMaterial, {

  foreignKey: 'material_id',

  as: 'studyMaterial',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});
Content.belongsTo(models.User, {

  foreignKey: 'user_id',

  as: 'user',

  onDelete: 'CASCADE',

  onUpdate: 'CASCADE'

});

    }
  }
  Content.init({
    user_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    content_text: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Content',
    timestamps: true
  });
  return Content;
};