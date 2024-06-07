const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Połączenie z bazą danych MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'rental_properties'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Połączono z bazą danych MySQL');
});

// Tworzenie tabeli, jeśli nie istnieje
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propertyName VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    pricePerDay DECIMAL(10, 2) NOT NULL,
    imagePath VARCHAR(255) NOT NULL
  )
`;
db.query(createTableQuery, err => {
  if (err) {
    throw err;
  }
  console.log('Tabela "properties" gotowa');
});

// Konfiguracja multer do przesyłania plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint do obsługi formularza
app.post('/api/properties', upload.single('image'), (req, res) => {
  const { propertyName, description, address, pricePerDay } = req.body;
  const imagePath = req.file.path;

  const insertQuery = 'INSERT INTO properties (propertyName, description, address, pricePerDay, imagePath) VALUES (?, ?, ?, ?, ?)';
  db.query(insertQuery, [propertyName, description, address, pricePerDay, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Obiekt dodany pomyślnie!', propertyId: result.insertId });
  });
});

// Endpoint do pobierania listy obiektów
app.get('/api/properties', (req, res) => {
    const selectQuery = 'SELECT * FROM properties';
    db.query(selectQuery, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const updatedResults = results.map(result => {
        result.imagePath = `http://localhost:5000/${result.imagePath.replace(/\\/g, '/')}`;
        return result;
      });
      res.status(200).json(updatedResults);
    });
  });
  

// Endpoint do usuwania obiektów
app.delete('/api/properties/:id', (req, res) => {
  const deleteQuery = 'DELETE FROM properties WHERE id = ?';
  const { id } = req.params;
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Obiekt usunięty pomyślnie' });
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));