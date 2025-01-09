/*
Author: Harsh Bhanushali
Date: 12/01/2024
Description: This is a js which is connected to messageboard.sqlite database. It has login menu where the data in users table is fetched,data is added using create account.It has all the basic function of a message board app like add a message to the board and it displays it .express is used for client side.Bcrypt is used in this now to hash the password and store it in db to the user.
*/
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 8000;
const SALT_ROUNDS = 10;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Handlebars
const hbs = create({ defaultLayout: 'main', extname: '.handlebars' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// SQLite database setup
const db = new sqlite3.Database('./database/messageboard.db', (err) => {
    if (err) console.error('Error connecting to SQLite database:', err.message);
});

// Route to display the home page
app.get('/', (req, res) => {
    const username = req.cookies.username;

    db.all(
        `SELECT messages.id, messages.content, messages.timestamp, users.username 
         FROM messages 
         JOIN users ON messages.user_id = users.id 
         ORDER BY timestamp DESC`,
        [],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error retrieving messages");
                return;
            }

            rows.forEach(row => {
                row.timestamp = new Date(row.timestamp).toLocaleString();
            });

            res.render('home', { messages: rows, username });
        }
    );
});

// Registration page
app.get('/register', (req, res) => {
    res.render('register');
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
        if (row) {
            res.send("Username already exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
                if (err) {
                    res.send("Error creating user");
                } else {
                    res.redirect('/login');
                }
            });
        }
    });
});

// Handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (user && await bcrypt.compare(password, user.password)) {
            res.cookie('username', username);
            res.redirect('/');
        } else {
            const errorMessage = user ? "Invalid password" : "User not found";
            res.render('login', { errorMessage });
        }
    });
});

// Post a new message
app.post('/message', (req, res) => {
    const { message } = req.body;
    const username = req.cookies.username;

    if (!username) {
        res.status(401).send("Unauthorized");
        return;
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (user) {
            db.run('INSERT INTO messages (content, user_id, timestamp) VALUES (?, ?, ?)',
                [message, user.id, new Date().toISOString()],
                function (err) {
                    if (err) {
                        res.status(500).send("Error posting message");
                        return;
                    }

                    const newMessage = {
                        username,
                        message,
                        timestamp: new Date().toLocaleString()
                    };

                    io.emit('newMessage', newMessage); // Emit the new message to all clients
                    res.redirect('/');
                });
        } else {
            res.status(401).send("Unauthorized");
        }
    });
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
});

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
