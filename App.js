const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



// Import routes

const userRoutes = require('./Routes/UserRoutes');

const studyMaterialRoutes = require('./Routes/StudyMaterialRoutes');

const contentRoutes = require('./Routes/ContentRoutes');

const flashcardRoutes = require('./Routes/FlashcardRoutes');

const examRoutes = require('./Routes/ExamRoutes');

const QuestionRoutes = require('./Routes/QuestionRoutes');

const optionRoutes = require('./Routes/OptionRoutes');

const answerRoutes = require('./Routes/AnswerRoutes');

const resultRoutes = require('./Routes/ResultRoutes');

const taskRoutes = require('./Routes/TaskRoutes');

const studySessionRoutes = require('./Routes/StudySessionRoutes');

// Use routes

app.use('/users', userRoutes);

app.use('/study-materials', studyMaterialRoutes);

app.use('/contents', contentRoutes);

app.use('/flashcards', flashcardRoutes);

app.use('/exams', examRoutes);

app.use('/questions', QuestionRoutes);

app.use('/options', optionRoutes);

app.use('/answers', answerRoutes);

app.use('/results', resultRoutes);

app.use('/tasks', taskRoutes);

app.use('/study-sessions', studySessionRoutes);

// Test route

app.get('/', (req, res) => {

  res.send('Backend is running');

});

// Start server

const PORT = 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});