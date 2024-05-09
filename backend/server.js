const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const patientsRouter = require('');
const doctorsRouter = require('./routes/doctors');
const appoinmentsRouter = require('./routes/appointments');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
    'mongodb://localhost:27017/hospital',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const connection = mongoose.connection;
connection.once('open',()=> {
    console.log('MongoDB database connection established successfully');
});
connection.on('error',(error) => {
    console.log('MongoDB connection error:', error);
});

// app.use('/patients',patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appoinmentsRouter);

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});
