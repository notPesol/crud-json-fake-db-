const express = require('express');
const port = 5000;
const path = require('path');
const app = express();
const fs = require('fs');
const methodOverride = require('method-override');
const products = require('./db.json');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res, next) => {
  res.render('index.html', { products });
});

app.get('/new', (req, res, next) => {
  res.render('new.html');
});

app.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const product = products.find(product => product.id == id);
  res.render('detail.html', { product });
});

app.get('/edit/:id', (req, res, next) => {
  const { id } = req.params;
  const editProduct = products.find(product => product.id == id);
  res.render('edit_product.html', { product: editProduct });
});

app.post('/', (req, res, next) => {
  const { name, price, onSale } = req.body;
  const id = Math.floor(Math.random() * 100000 + 1);
  products.push({ id: id, name, price, onSale: onSale ? true : false });
  fs.writeFile('./db.json', JSON.stringify(products), {}, (err) => {
    if (err) next(err);
  })
  res.redirect('/');
});

app.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const newProducts = products.filter(product => product.id != id);
  fs.writeFile('./db.json', JSON.stringify(newProducts), {}, (err) => {
    if (err) next(err);
  })
  res.redirect('/');
});

app.put('/:id', (req, res, next) => {
  const editedProduct = req.body;
  const {onSale} = req.body;
  const { id } = req.params;
  const editProduct = products.map(product => {
    if (product.id == id) {
      return { ...editedProduct, id: parseInt(id), onSale: onSale ? true : false }
    }
    return product;
  });
  fs.writeFile('./db.json', JSON.stringify(editProduct), {}, (err) => {
    if (err) next(err);
  })
  console.log(editProduct);
  res.redirect('/');
});

app.use((err, req, res, next) => {
  res.json(err);
})

app.listen(port, () => {
  console.log(`Server running on port:`, port);
})