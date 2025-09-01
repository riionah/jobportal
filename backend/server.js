const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./db');
const authRoutes = require('./routes/authroutes');
const companyRoutes = require('./routes/companyroutes');
const jobRoutes = require('./routes/jobroutes');
const eventRoutes = require('./routes/eventroutes');
const newsRoutes = require('./routes/newroutes');
const usersRoutes = require('./routes/userroutes');
const industriesRoutes = require('./routes/industriesRoutes');
const profileRoutes = require('./routes/profileroutes');
const applicationRoutes = require('./routes/applicationroutes');
const Interviewroutes = require('./routes/interviewsroutes');
const app = express();

// ✅ Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's actual address
  credentials: true,
}));

app.use(express.json());
app.use(helmet());

app.use('/api/auth', authRoutes);
app.use('/api', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/industries', industriesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/apply', applicationRoutes);
app.use('/api/interviews', Interviewroutes);
const PORT = 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});