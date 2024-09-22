const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime-types');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Dummy user details (replace with real ones as necessary)
const userId = "ujwala_Matha_29062004";
const email = "ujwala_m@srmap.edu.in";
const rollNumber = "AP21110011366";

// Helper function to validate and extract file details
const handleFileValidation = (file) => {
  if (!file) {
    return { fileValid: false, fileMimeType: null, fileSizeKB: null };
  }

  const fileMimeType = mime.lookup(file.originalname);
  const fileSizeKB = file.size / 1024;
  const fileValid = !!fileMimeType;

  return { fileValid, fileMimeType, fileSizeKB };
};

// Helper function to parse the data array
const parseDataArray = (data) => {
  const numbers = [];
  const alphabets = [];
  let highestLowercase = null;

  data.forEach(item => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (typeof item === 'string') {
      alphabets.push(item);
      if (/[a-z]/.test(item) && (!highestLowercase || item > highestLowercase)) {
        highestLowercase = item;
      }
    }
  });

  return { numbers, alphabets, highestLowercase };
};

// POST route to handle the request
app.post('/bfhl', upload.single('file_b64'), (req, res) => {
  const { data } = req.body;
  const file = req.file;

  if (!data) {
    return res.status(400).json({ is_success: false, message: "Invalid data input" });
  }

  // Parse the data array
  const { numbers, alphabets, highestLowercase } = parseDataArray(data);

  // Handle file validation
  const { fileValid, fileMimeType, fileSizeKB } = handleFileValidation(file);

  // Build the response object
  const response = {
    is_success: true,
    user_id: userId,
    email: email,
    roll_number: rollNumber,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB
  };

  res.status(200).json(response);
});

// GET route to return the operation code
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
