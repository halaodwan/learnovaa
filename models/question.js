module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    question: DataTypes.STRING,
    type: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    correctAnswer: DataTypes.INTEGER,
    exam_id: DataTypes.INTEGER,
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Exam, {
      foreignKey: "exam_id",
    });

    Question.hasMany(models.Option, {
      foreignKey: "questionId",
      as: "Options",
    });
  };

  return Question;
};