'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {

      User.hasMany(models.Answer, {
        foreignKey: 'user_id',
        as: 'answers',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.Exam, {
        foreignKey: 'user_id',
        as: 'exams',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.StudyMaterial, {
        foreignKey: 'user_id',
        as: 'studyMaterials',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.Content, {
        foreignKey: 'user_id',
        as: 'contents',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.Flashcard, {
        foreignKey: 'user_id',
        as: 'flashcards',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.Result, {
        foreignKey: 'user_id',
        as: 'results',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.Task, {
        foreignKey: 'user_id',
        as: 'tasks',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.StudySession, {
        foreignKey: 'user_id',
        as: 'studySessions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',

    // 🚀 مهم: نخفي الباسورد من أي response
    defaultScope: {
      attributes: { exclude: ['password'] }
    }
  });

  // 🔐 Hash password before create
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  // 🔐 Hash password before update (if changed)
  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};