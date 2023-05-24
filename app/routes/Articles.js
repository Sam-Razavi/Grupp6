const express = require('express'); // Importera express-modulen
const router = express.Router(); // Skapa en ny router-instans från express-modulen.

const NodeCache = require('node-cache'); // Importera node-cache-modulen som används för att skapa en cache i minnet.
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); //Skapar en ny instans av node-cache där varje post i cachen lever i 100 sekunder och cachen kontrollerar sig själv var 120:e sekund.

const Article = require('../models/articleModel');

/////////////// CREATE ///////////////
router.post('/', async (req, res) => {
    try {
        const article = await Article.create(req.body);
        myCache.del('allArticles'); // Tar bort cachen så att vi inte har 2 olika uppsättningar data (gammalt och nytt)
        console.log('Deleted the cache due to posting a new article'); // Bekräftar att data i cachen har raderats
        res.status(200).send(`POSTED the new article!`);
    } catch (error) {
        // Fångar eventuella fel som kan uppstå.
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/////////////// READ ALL ///////////////
router.get('/', async (req, res) => {
    try {
        const value = myCache.get('allArticles'); // Hämtar värdet för nyckeln 'allArticles' från cachen.
        if (value == undefined) {
            // Om värdet inte hittas i cachen (key not found in cache)
            const articles = await Article.find({}); // Hämta data från databasen (Article.find({})).
            myCache.set('allArticles', articles); // Spara datan i cachen med nyckeln 'allArticles'.
            console.log('Fetched from database'); // Skriv ut 'Fetched from database' för att visa att datan genereras och hämtas från databasen.
            res.status(200).json(articles); // Skicka datan som JSON-svar med statuskod 200.
        } else {
            //  Om värdet finns i cachen
            console.log('Served from cache'); // Skriv ut 'Served from cache' för att visa att datan kommer från cachen som vi skapade.
            res.status(200).json(value);
        }
    } catch (error) {
        // Fångar eventuella fel som kan uppstå.
        res.status(500).json({ message: error.message }); // Skickar ett svar med statuskod 500 (Internal Server Error) och felmeddelandet som JSON-data.
    }
});

/////////////// READ ONE SPECIFIC ///////////////
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id); // Hämtar artikeln med det angivna "id"-värdet från databasen
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// COUNT THE LETTERS ///////////////

router.get('/:id/letterCount', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id); // Hämtar artikeln med det angivna "id"-värdet från databasen.
        if (!article) {
            // Om artikeln inte hittas i databasen: Skicka ett svar med statuskod 404 (Not Found) och meddelandet som informerar att ingen artikel med det angivna ID:et hittades.
            return res.status(404).send(`Oops... 404. Cannot find any article with ID ${id}`);
        }
        const letterCount = article.content.length; // Räkna antalet tecken i artikelns innehåll.
        res.status(200).send(`The text contains ${letterCount} characters!`); // Vid statuskod 200. Skriv ut antalet tecken i texten.
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.get('/:id/count', async (req, res) => {
//     try {
//         const { id } = req.params
//         const article = await Article.findById(id)
//         if (!article) {
//             return res
//                 .status(404)
//                 .json({ message: `Cannot find any article with ID ${id}` })
//         }
//         const letterCount = article.content.length
//         res.status(200).json({ letterCount })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

/////////////// UPDATE ///////////////
router.put('/update', async (req, res) => {
    try {
        const { _id } = req.body;
        const article = await Article.findByIdAndUpdate(_id, req.body, {
            // Uppdaterar artikeln med det angivna "_id"-värdet
            new: true // "new: true" innebär att det uppdaterade dokumentet returneras.
        });
        if (!article) {
            // Om artikeln inte hittas i databasen: Skicka ett svar med statuskod 404 (Not Found) och meddelandet som informerar att ingen artikel med det angivna ID:et hittades.
            return res.status(404).send(`Oops... 404. Cannot find any article with ID ${_id}`);
        }
        res.status(200).send(`UPDATED the article with ID ${_id}`); // Skicka ett svar med statuskod 200 (OK) och meddelandet som informerar om att artikeln har uppdaterats.
        myCache.del('allArticles'); // "Ogiltigförklarar" cachen för alla artiklar genom att ta bort data med nyckeln 'allArticles'.
        console.log('Deleted the cache due to update'); // Skriver ut ett meddelande i konsolen för att visa att både cachen och databasen har uppdaterats.
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// DELETE ///////////////
router.delete('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        const article = await Article.findByIdAndDelete(_id); // Tar bort artikeln med det angivna "_id"-värdet från databasen.
        if (!article) {
            // Om artikeln inte hittas i databasen: Skicka ett svar med statuskod 404 (Not Found) och meddelandet som informerar att ingen artikel med det angivna ID:et hittades.
            return res.status(404).send(`Oops... 404. Cannot find any article with ID ${_id}`);
        }
        res.status(200).send(`DELETED article with ID ${_id}`); // Skicka ett svar med statuskod 200 (OK) och meddelandet som informerar om att artikeln har tagits bort.
        myCache.del('allArticles'); // "Ogiltigförklarar" cachen för alla artiklar genom att ta bort data med nyckeln 'allArticles'.
        console.log('Deleted the cache'); // Skriver ut ett meddelande i konsolen för att visa att cachen har tagits bort och undviker att ha två separata uppsättningar av data.
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
