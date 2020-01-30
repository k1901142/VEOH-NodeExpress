const express = require('express');

let app = express();

// kuunnellaan kaikkea sisääntulevaa viestiä
app.use((req, res, next) => {
    console.log('path:${req.path}');
    next(); // seuraava kuuntelijakin olemassa
});

app.use('/test', (req, res, next) => {
    console.log('TOIMII');
    next(); // seuraava kuuntelijakin olemassa
});

app.get('/', (req, res, next) => {
    res.send('Hello world 2');
    //res.write lukee
    //res.end(); // lopetetaan lähetys
});

app.use((req, res, next)=> {
    res.status(404);
    res.send(`
    page not found
    `);

});
//app.post()



// start server npm run start-dev
// Shutdown server CTRL + C
app.listen(8080);