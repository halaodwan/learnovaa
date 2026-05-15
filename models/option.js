module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define("Option", {
    question_id: DataTypes.INTEGER,
    option_text: DataTypes.STRING,
    is_correct: DataTypes.BOOLEAN,
  });

  Option.associate = (models) => {
    Option.belongsTo(models.Question, {
      foreignKey: "question_id",
    });
  };

  return Option;
};
