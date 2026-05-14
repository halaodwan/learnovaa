require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./models");

db.sequelize.authenticate()
  .then(() => console.log("DB CONNECTED ✅"))
  .catch(err => console.log("DB ERROR ❌", err));

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log("🔥 APP HIT:", req.method, req.url);
  next();
});

const userRoutes = require("./Routes/UserRoutes");
const studyMaterialRoutes = require("./Routes/StudyMaterialRoutes");
const contentRoutes = require("./Routes/ContentRoutes");
const flashcardRoutes = require("./Routes/FlashcardRoutes");
const examRoutes = require("./Routes/ExamRoutes");
const QuestionRoutes = require("./Routes/QuestionRoutes");
const optionRoutes = require("./Routes/OptionRoutes");
const answerRoutes = require("./Routes/AnswerRoutes");
const resultRoutes = require("./Routes/ResultRoutes");
const taskRoutes = require("./Routes/TaskRoutes");
const studySessionRoutes = require("./Routes/StudySessionRoutes");
const aiRoutes = require("./Routes/AIRoutes");

app.use("/users", userRoutes);
app.use("/study-materials", studyMaterialRoutes);
app.use("/contents", contentRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/exams", examRoutes);
app.use("/questions", QuestionRoutes);
app.use("/options", optionRoutes);
app.use("/answers", answerRoutes);
app.use("/results", resultRoutes);
app.use("/tasks", taskRoutes);
app.use("/study-sessions", studySessionRoutes);
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});