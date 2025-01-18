const express = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const authController = require('./server/controllers/authController');
const path = require('path');

const app = express();
const port = process.env.PORT || 2000;

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // إضافة هذه السطر لتمكين قراءة البيانات بتنسيق JSON

app.use(express.static(path.join(__dirname, 'public')));

// إعداد مجلد views لعرض ملفات HTML ثابتة
app.set('views', path.join(__dirname, 'views'));

// Set up cookie-parser
app.use(cookieParser('CookingBlogSecure'));

// Use method-override for PUT and DELETE
app.use(methodOverride('_method'));

// Set up sessions
app.use(session({
  secret: 'CookingBlogSecretSession',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Log requests
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});

// Set up flash
app.use(flash());
app.use(fileUpload());


// إعداد مسارات الصفحات
app.get('/homePage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'homePage.html'));
});


app.get('/UserRecipesPage', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'UserRecipesPage.html'));
});

app.get('/SearchPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'SearchPage.html'));
});
app.get('/UserSearchPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'UserSearchPage.html'));
});

app.get('/AddRecipePage', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'AddRecipePage.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', authController.register); // Handle signup
app.post('/login', authController.login); // Handle login

// Add logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/UserRecipesPage'); // If there's an error, redirect to dashboard
    }
    res.redirect('/login'); // Redirect to login page
  });
});

// Error handling for 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); // Render a custom 404 page
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(err.status || 500).sendFile(path.join(__dirname, 'views', 'error.html')); // Render a custom error page
});

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
