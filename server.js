const express = require('express'); // Importerar Express-paketet som används för att skapa en webbserver och hantera HTTP-förfrågningar och svar.
const mongoose = require('mongoose'); //  Importerar Mongoose-paketet som används för att kommunicera med MongoDB-databasen.
const dotenv = require('dotenv'); // Importerar dotenv-paketet som används för att läsa miljövariabler från en .env-fil.

const app = express();

// ROUTES
const articleRoute = require('./app/routes/Articles');
const authorRoute = require('./app/routes/Authors');
const commentRoute = require('./app/routes/Comments');

app.use(express.json()); // Middleware som används för att tolka JSON-data i inkommande förfrågningar.
app.use(express.urlencoded({ extended: true })); // Middleware som används för att tolka URL-kodad data i inkommande förfrågningar.

dotenv.config();

app.get('/', (req, res) => {
    res.send('This is the Home side!');
});

app.use('/articles', articleRoute);
app.use('/authors', authorRoute);
app.use('/comments', commentRoute);

mongoose.set('strictQuery', false);
mongoose
    .connect(
        // Anslutning mot databasen. Användarnamn och lösenord 'DB_USERNAME' och 'DB_PASSWORD' hämtas från .env (som inte skickas till Github, ligger i .gitignore)
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xwkradj.mongodb.net/test`,
        {
            useNewUrlParser: true, //Används för att ange att Mongoose ska använda den nya URL-parsern när den ansluter till MongoDB. Den är mer robust och stödja fler funktioner
            useUnifiedTopology: true //Används för att aktivera den nya enhetliga topologin i MongoDB-drivern. Är utformad för att vara mer stabil och effektiv. Det hjälper till att hantera anslutningar, klystring och övervakning av MongoDB-servern på ett bättre sätt.
        }
    )
    .then(() => {
        console.log('Successfully connected to the database.');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Could not connect to the database. Error...', error);
        process.exit();
    });

const PORT = 3000;
