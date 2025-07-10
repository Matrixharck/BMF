
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/submit', upload.fields([
  { name: 'teamImage', maxCount: 1 },
  { name: 'proof', maxCount: 1 }
]), (req, res) => {
  const data = req.body;
  const files = req.files;

  const newEntry = {
    Team: data.team,
    Captain: data.captain,
    Member1: data.member1 || '',
    Member2: data.member2 || '',
    Member3: data.member3 || '',
    Member4: data.member4 || '',
    Member5: data.member5 || '',
    Member6: data.member6 || '',
    TeamImage: files.teamImage ? files.teamImage[0].filename : '',
    PaymentProof: files.proof ? files.proof[0].filename : '',
    Timestamp: new Date().toISOString()
  };

  const filePath = 'inscriptions.xlsx';
  let workbook, worksheet;

  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = xlsx.utils.sheet_to_json(worksheet);
    json.push(newEntry);
    const newSheet = xlsx.utils.json_to_sheet(json);
    workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  } else {
    worksheet = xlsx.utils.json_to_sheet([newEntry]);
    workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Inscriptions');
  }

  xlsx.writeFile(workbook, filePath);
  res.json({ message: "✅ Inscription enregistrée avec succès !" });
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
