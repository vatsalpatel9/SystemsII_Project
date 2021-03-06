const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./db/conn");
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder for public files
app.use(express.static(path.join(__dirname, 'public')));

//Sessions
app.use(
  session({
    secret: process.env.SESSIONSEC,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    httpOnly: true,
    store: new MongoStore({
      url: process.env.SESSIONSTORE,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
  })
);

//middlewares

////////////////////////////////////////////////////////////////////////////////
//                               ROUTES
////////////////////////////////////////////////////////////////////////////////
app.use('/', require('./routes/'));

////////////////////////////////////////////////////////////////////////////////
//                              API ROUTES
////////////////////////////////////////////////////////////////////////////////
app.use('/api/', require('./api/'));

app.use('/rm-session', (req, res) => {
    db.close;
    req.session.destroy();
    res.redirect('/');
})

////////////////////////////////////////////////////////////////////////////////
//                              Route the 404
////////////////////////////////////////////////////////////////////////////////
app.use((req, res) => {
    res.sendFile(path.resolve('public/html/404.html'));
})

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

// Listen on port
app.listen(port, () => console.log(`Listening on port ${port}.`));