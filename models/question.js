module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    type: DataTypes.STRING,
    question_text: DataTypes.STRING,
    exam_id: DataTypes.INTEGER,
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Exam, {
      foreignKey: "exam_id",
    });

    Question.hasMany(models.Option, {
      foreignKey: "question_id",
      as: "Options",
    });
  };

  return Question;
};
