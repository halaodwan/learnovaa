module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define("Option", {
    text: DataTypes.STRING,
    isCorrect: DataTypes.BOOLEAN,
    questionId: DataTypes.INTEGER,
  });

  Option.associate = (models) => {
    Option.belongsTo(models.Question, {
      foreignKey: "questionId",
    });
  };

  return Option;
};