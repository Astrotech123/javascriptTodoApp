let express = require("express")
let {MongoClient, ObjectId} = require("mongodb")
let sanitizeHTML = require("sanitize-html")
let ourApp = express()
let db 

async function go() {
let client = new MongoClient("mongodb+srv://TodoAppuser:Friday8394$@cluster0.ypqyasv.mongodb.net/TodoApp?retryWrites=true&w=majority")
await client.connect()
db = client.db()
ourApp.use(express.static("public"))
ourApp.listen(3000)
}

go()
ourApp.use(express.json())
ourApp.use(express.urlencoded({extended:false}))

// what about security ?

function passwordprotected(req, res, next) {
    res.set("www-authenticate", 'Basic realm="simple to do app"' )
    
    console.log(req.headers.authorization)
    if (req.headers.authorization== "Basic YXN0cm9jb206RnJpZGF5ODM5NCQ=") {
      next()
    }else {

      res.status(401).send("you need authentication!")
    }
  }

  ourApp.use(passwordprotected)
ourApp.get("/", async function(req, res) {
  const item = await db.collection("item").find().toArray()
  //console.log(item)
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id = "create-form" action ="/create_item" method ="POST">
            <div  class="d-flex align-items-center">
              <input id = "create-field" name ="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id ="item-list" class="list-group pb-5">
         
        </ul>
        
      </div>
      <script>let item = ${JSON.stringify(item)}
      </script>
      <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
      <script src ="/browser.js"></script>
    </body>
    </html>`)
})

ourApp.post("/create-item", async function (req, res) {
  let safetext = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes: {}})
  const info= await db.collection("item").insertOne({text: safetext})

    res.json({_id: info.insertedId, text:safetext }) 
})
ourApp.post("/update-item", async function(req, res) {
  let safetext = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes: {}})
 await db.collection("item").findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text:safetext}

}) 
 res.send("success")
})
 
ourApp.post("/delete-item", async function(req, res){
await db.collection("item").deleteOne({_id: new ObjectId(req.body.id)})
res.send("success")
})