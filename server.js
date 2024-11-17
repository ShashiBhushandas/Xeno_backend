// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const connectDB = require('./config/db');
// const cors = require('cors');

// const dataIngestionRoutes = require('./routes/dataIngestion');
// const campaignManagementRoutes = require('./routes/campaignManagement');
// const messagingRoutes = require('./routes/messaging');
// const swaggerDocsRoutes = require('./routes/swaggerDocs');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// app.use('/api/data-ingestion', dataIngestionRoutes);
// app.use('/api/campaign-management', campaignManagementRoutes);
// app.use('/api/messaging', messagingRoutes);
// app.use('/', swaggerDocsRoutes);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
// });


const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const dataIngestionRoutes = require('./routes/dataIngestion');
const campaignManagementRoutes = require('./routes/campaignManagement');
const messagingRoutes = require('./routes/messaging');
const swaggerDocsRoutes = require('./routes/swaggerDocs');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Allow frontend origin
    credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false, // Ensure only authenticated sessions are saved
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day session
    },
}));

// Session setup
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_secret_key',
//     resave: false,
//     saveUninitialized: true
// }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT || 5001}/auth/google/callback`
},
    function (token, tokenSecret, profile, done) {
        // Save profile information in session
        return done(null, profile);
    }
));

// Serialize user
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Deserialize user
passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Routes
// app.get('/', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.send(`<h1>Hello, ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
//     } else {
//         res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
//     }
// });

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect to React frontend
        const redirectURL = `http://localhost:3000/campaign`;
        res.redirect(redirectURL);
    }
);

// Google login route
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/api/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
        // console.log(res)
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Google callback route
// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     }
// );

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        res.redirect('/');
    });
});

// Existing routes
app.use(bodyParser.json());
app.use(cors());
app.use('/api/data-ingestion', dataIngestionRoutes);
app.use('/api/campaign-management', campaignManagementRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/', swaggerDocsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});