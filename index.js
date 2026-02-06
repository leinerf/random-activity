import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(
    import.meta.url));

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("main.ejs");
})

app.post('/', async(req, res) => {
    let apiURL;
    try {
        if (req.body.activityType === "random") {
            apiURL = "https://bored-api.appbrewery.com/random"
        } else {
            apiURL = "https://bored-api.appbrewery.com/filter?type=" + req.body.activityType;
            if (req.body.count != 0) {
                apiURL += `&choice=${req.body.count}`;
            }
        }
        const response = await axios.get(apiURL);
        let data;
        if (Array.isArray(response.data)) {
            const random = Math.floor(Math.random() * response.data.length);
            data = response.data[random];
        } else {
            data = response.data;
        }

        res.render("main.ejs", {
            activity: data.activity,
            type: data.type,
            participants: data.participants
        });
    } catch (error) {
        console.log(error.response.data);
        res.render("main.ejs", { error: error.response.data });
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})