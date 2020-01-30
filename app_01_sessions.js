const express = require('express');
const PORT=process.env.PORT || 8080;
const body_parser = require('body-parse');
const session = require('express-session'); // pitää asentaa express-session npm install express session 

let app = express();

app.use(body_parser.urlencoded({
    extended: true
}));

app.use(session({
    secret: '1234qwerty',
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000000
    }
}));

let users = [];

// kuunnellaan kaikkea sisääntulevaa viestiä
app.use((req, res, next) => {
    console.log('path:${req.path}');
    next(); // seuraava kuuntelijakin olemassa
});

const is_logged_handler = (req, res, next => {
    if(!req.session.user){
        return res.redirect('/login');
    }
    next(); // seuraavaan käsittelijään
});

app.get('/', is_logged_handler, (req,res, next)=> {
    const user = req.session.user;
    res.write(`
        <html>
        <body>
            Logged is as user: ${user}
            <form action="/log out" method="POST">
            <button type="submit">Log out</button>
        </form>
    </body>
    </html>
    `);
    res.end();
});

app.post('/logout', (req, res, next)=>{
    req.session.destroy();
    res.redirect('/login');
});

app.get('/login', (req, res, next) => {
    console.log('user: ', req.session.user);
    res.write(`
    <html>
    <body>
        <form action="/login" method="POST">
            <input type="text" name = "user_name">
            <button type="submit">Log in</button>
        </form>
        <form action="/register" method="POST">
            <input type="text" name = "user_name">
            <button type="submit">Register</button>
        </form>
    </body>
    </html>
    `);
    res.end();
});

app.post('/login', (req, res, next)=> {
    const user_name= req.body.user_name;
    let user=users.find((name)=>{
        return user_name==name;
    });
    if(user) {
        console.log('User logged in: ', user);
        req.session.user = user;
        res.redirect('/login');
    }
    console.log('User name not registerd: ', user);
    res.redirect('/login')
});

app.use((req, res, next) => {
    console.log('TOIMII');
    next(); // seuraava kuuntelijakin olemassa
});

app.post('/register', (req, res, next) => {
    const user_name= req.body.user_name;
    let user=users.find((name)=>{
        return user_name==name;
    });
    if(user){
        return res.send('User name already registered');
    }
    users.push(user_name);
    console.log('users: ', users);
    res.redirect('/login');
});

app.use((req, res, next)=> {
    res.status(404);
    res.send(`
    page not found
    `);
});

// start server npm run start-dev
// Shutdown server CTRL + C
app.listen(8080);