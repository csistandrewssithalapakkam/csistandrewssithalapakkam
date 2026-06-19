import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Quiz } from './src/shared/models/quiz.model.ts';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let quizzes: Quiz[] = [];

// API Routes
app.get('/api/quizzes', (req, res) => {
  res.json(quizzes);
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = quizzes.find(q => q.id === req.params.id);
  if (quiz) {
    res.json(quiz);
  } else {
    res.status(404).json({ message: 'Quiz not found' });
  }
});

app.post('/api/quizzes', (req, res) => {
  const newQuiz: Quiz = {
    ...req.body,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date()
  };
  quizzes.push(newQuiz);
  io.emit('quiz:created', newQuiz);
  res.status(201).json(newQuiz);
});

app.put('/api/quizzes/:id', (req, res) => {
  const index = quizzes.findIndex(q => q.id === req.params.id);
  if (index !== -1) {
    quizzes[index] = { ...quizzes[index], ...req.body };
    io.emit('quiz:updated', quizzes[index]);
    res.json(quizzes[index]);
  } else {
    res.status(404).json({ message: 'Quiz not found' });
  }
});

app.delete('/api/quizzes/:id', (req, res) => {
  quizzes = quizzes.filter(q => q.id !== req.params.id);
  io.emit('quiz:deleted', req.params.id);
  res.status(204).send();
});

// WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
