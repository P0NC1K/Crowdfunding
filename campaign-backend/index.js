const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./routes/user');
const campaignRouter = require('./routes/campaign');
const donationRouter = require('./routes/donation')
const cronJobs = require('./utils/jobs');
// const userRoutes = require('./routes/user.route');
// const bookRoutes = require('./routes/book.route');

const app = express();

app.use(cors());
app.use(express.json());
cronJobs();
// app.use(express.urlencoded({extended: true}));

app.use('/user', userRouter);
app.use('/campaign', campaignRouter);
app.use('/donation', donationRouter);
// app.use('/book', bookRoutes);

app.listen(process.env.PORT || 3001, () => {
    console.log('server is running');
})