const express = require('express');
const app = express();
const { quotes } = require('./data');  // Import quotes array
const { getRandomElement } = require('./utils');  // Import helper function

const PORT = process.env.PORT || 4001;

// Middleware to serve static files (for the front-end)
app.use(express.static('public'));

// GET /api/quotes/random
app.get('/api/quotes/random', (req, res) => {
  const randomQuote = getRandomElement(quotes);
  res.send({ quote: randomQuote });
});

// GET /api/quotes
app.get('/api/quotes', (req, res) => {
  const person = req.query.person;  // Get query parameter

  if (person) {
    const personQuotes = quotes.filter(quote => quote.person === person);
    res.send({ quotes: personQuotes });
  } else {
    res.send({ quotes });
  }
});

// POST /api/quotes
app.post('/api/quotes', (req, res) => {
  const { person, quote } = req.query;  // Destructure query params

  if (person && quote) {
    const newQuote = { person, quote };
    quotes.push(newQuote);  // Add new quote to the array
    res.status(201).send({ quote: newQuote });
  } else {
    res.status(400).send('Invalid input: quote and person are required.');
  }
});
// PUT /api/quotes/:id
app.put('/api/quotes/:id', (req, res) => {
    const quoteIndex = quotes.findIndex(quote => quote.id === Number(req.params.id));
    if (quoteIndex !== -1) {
      const { person, quote } = req.query;
      if (person && quote) {
        quotes[quoteIndex] = { id: Number(req.params.id), person, quote };
        res.send({ quote: quotes[quoteIndex] });
      } else {
        res.status(400).send('Invalid input: quote and person are required.');
      }
    } else {
      res.status(404).send('Quote not found.');
    }
  });
  
  // DELETE /api/quotes/:id
app.delete('/api/quotes/:id', (req, res) => {
    const quoteIndex = quotes.findIndex(quote => quote.id === Number(req.params.id));
    if (quoteIndex !== -1) {
      quotes.splice(quoteIndex, 1);
      res.status(204).send();  // No content
    } else {
      res.status(404).send('Quote not found.');
    }
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
