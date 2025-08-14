const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/resq')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Multer setup for handling image upload
const storage = multer.memoryStorage(); // Store image in memory as buffer
const upload = multer({ storage: storage });

// Mongoose schema for cases
const caseSchema = new mongoose.Schema({
  name: String,
  age: Number,
  district: String,
  description: String,
  lastSeenLocation: String,
  image: Buffer,               // Binary data
  imageType: String            // MIME type: image/png, image/jpeg, etc.
});

const Case = mongoose.model('Case', caseSchema);

// Endpoint to handle form submission
app.post('/submit-case', upload.single('file'), async (req, res) => {
  try {
    const newCase = new Case({
      name: req.body.name,
      age: req.body.age,
      district: req.body.district,
      description: req.body.description,
      lastSeenLocation: req.body.lastSeenLocation,
      image: req.file.buffer,          // Binary image
      imageType: req.file.mimetype     // e.g. image/png
    });

    const saved = await newCase.save();
    res.status(200).send(`Case submitted! Photo ID: ${saved._id}`);
  } catch (error) {
    console.error('❌ Error saving case:', error);
    res.status(500).send('Error submitting case');
  }
});

// Endpoint to retrieve all cases
app.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving cases');
  }
});

// Endpoint to retrieve photo by case ID
app.get('/case-photo/:id', async (req, res) => {
  try {
    const found = await Case.findById(req.params.id);
    if (!found || !found.image) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', found.imageType);
    res.send(found.image);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving image');
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const express = require('express');
const server = express();

// Import your case routes
const caseRoutes = require('./routes/cases'); // Adjust path if needed

// Use the route
app.use('/api/cases', caseRoutes); // Now your route is live at /api/cases
