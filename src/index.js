const express = require('express');
const port = process.env.PORT || 3000;
const requests = require('requests');
const app = express();
const path = require('path');
const staticPath = path.join(__dirname, "../public");
// console.log(staticPath)
app.set('view engine', 'hbs');
app.use(express.static(staticPath));

app.get("/", (req, res) => {
    if (req.query.city) {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=1b7c17cce68e77567c56fc34bf15e8f9`)
            .on('data', (chunk) => {
                const data = JSON.parse(chunk);
                if (data.cod !== '404') {
                    res.render('index', {
                        tempval: (data.main.temp - 273.15).toFixed(2),
                        tempMin: (data.main.temp_min - 273.15).toFixed(2),
                        tempMax: (data.main.temp_max - 273.15).toFixed(2),
                        feelsLike: (data.main.feels_like - 273.15).toFixed(2),
                        city: data.name,
                        country: data.sys.country,
                        tempStatus: data.weather[0].main
                    });
                } else {
                    res.render('index', {
                        city: 'No city found'
                    });
                }
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
            });
    } else {
        res.render('index',{
            city: 'No city found'
        })
    }

});


app.listen(port)

