const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

 const app = express();
 const port = 3001;

 app.use(bodyParser.json());

 app.post('/saveData', (req, res) => {
  const {name, birthday } = req.body;
  const data = { name, birthday };

  fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data');
      return;
    }
    console.log('Data saved:', data);
    res.status(200).send('Data saved');
  });
 });

 app.listen(port, () => {
  console.log(`Server running ${port}`)
 })
