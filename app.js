const express = require("express");
const path = require("path");
const session = require("express-session");
require("./db/conn");
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder for public files
app.use(express.static(path.join(__dirname, 'public')));

//Sessions
app.use(session({
    secret: 'dch1FDJDsn!dhf',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    httpOnly: true,
    store: new MongoStore({
        url: 'mongodb+srv://appUser:8rod40huijz75698@cluster0.rqilf.mongodb.net/sessionData?retryWrites=true&w=majority',
    }),
    cookie: {
        maxAge: 1000 * 60,
        secure: false
   }
}))

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