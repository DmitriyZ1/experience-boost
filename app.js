import express from'express'
import path from 'path'
import jsonfile from 'jsonfile'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4111

const root = path.join(__dirname)
app.use(express.static(root))

app.get("/", (req, res) => {
   res.sendFile('index.html', {
      root
   });
});

app.get("/tasks", (req, res) => {
    jsonfile.readFile(__dirname + '/tasks.json')
        .then(data => {
            if(Array.isArray(data)){
                let arr = data.map((item) => {
                    return item.id
                })
                res
                .status(200)
                .json({data: arr})
            }
        })
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .json({err: "the file could not be read :" + err})    
        })
});

app.get('/task/:id', (req, res) => {
    const id = req.params.id
    jsonfile.readFile(__dirname + '/tasks.json')
        .then(arr => {
            const text = arr.find((item) => item.id === id).text
            if(!text) return
            res
                .status(200)
                .json({text})
        })
        .catch(err => {
            res
                .status(500)
                .json({err: "Something didn't go according to plan :" + err})
        })
})


app.listen(PORT);

console.log('App is listening on port ' + PORT);