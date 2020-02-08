console.log("hello node");

var express = require("express");
var app = express(); //create an app
var itemList = []; //store items in this array
var ItemDB;


//Configurations

var mongoose = require('mongoose');
mongoose.connect("mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");

var db = mongoose.connection;

//enable cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

//configure body-parse to read info
var bparser = require('body-parser');
app.use(bparser.json());


//serve static files (css,js,img,pdf)
app.use(express.static(__dirname + '/public'))

//to serve html
var ejs = require('ejs');
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);
app.set('view engine', ejs);

//Web Server endpoints




app.get('/', (req, res) => {
    console.log("Someone wants the root page");
    res.render('Catalog.html');
});


app.get('/contact', (req, res) => {
    console.log("Someone wants the contacts page");
    res.render('Contact.html');
});

app.get('/about', (req, res) => {
    console.log("Someone wants the about page");
    res.render('About.html');
});

app.get('/home', (req, res) => {
    console.log("Someone wants the home page");
    res.render('Home.html');
});

app.get('/FAQ', (req, res) => {
    console.log("Someone wants the faq page");
    res.render('FAQ.html');
});

app.get('/exc/:message', (req, res) => {
    //console.log("Message from the client: ", req.params.message);

    // exc: find vowels

    var msj = req.params.message;
    var vowels = '';
    var vowel = ['a', 'e', 'i', 'o', 'u'];

    for (i = 0; i < msj.length; i++) {
        var letter = msj[i];
        //console.log(letter);
        if (vowel.indexOf(letter.toLowerCase()) != -1) {
            vowels += letter;

        }
        //return each vowel only once
        var uniquevowel = [new Set(vowels)];
    }
    res.status(202);
    res.send("Hello my exc message!");
    console.log(uniquevowel);
});


// API End Points

app.post('/api/items', (req, res) => {
    console.log("Client wants to store items");

    //var item = req.body;
    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(
        function (error, savedItem) {
            if (error) {
                console.log("Error saving item", error);
                res.status(500);
                res.send(error);
            }
            console.log("Item has been saved");
            res.status(201);
            res.json(savedItem);
        }
    );

    //item.id = itemList.length + 1; //create unique ID

    //itemList.push(item);

    //moved to if statement res.status(201); //201=> created
    //moved to if statement res.json(item);//return the item as JSON


});


app.get('/api/items', (req, res) => {
    //console.log("Client wants to get items");
    //res.status(201); //201=> created
    //res.json(itemList);
    ItemDB.find({}, function (error, data) {
        if (error) {
            res.status(500);
            res.send(error);
        }
        res.status(200);
        res.json(data);
    })
});




app.get('/api/items/:id',(req,res)=> {
var id = req.params.id;
ItemDB.find({_id: id},function(error, item){
    if(error){
        res.status(404);
        res.send(error);
    }
    res.status(200);
    res.json(item);
});
});



app.get('/api/items/byName/:name',(req,res)=> {
    var name = req.params.name;
    ItemDB.find({user: name},function(error, data){
        if(error){
            res.status(404);
            res.send(error);
        }
        res.status(200);
        res.json(data);
    });
    });


app.delete('/api/items',(req,res)=> {
    var item = req.body;

    ItemDB.findByIdAndRemove(item._id,function(error){
        if(error){
            res.status(500);
            res.send(error);
        }
        res.status(200);
        res.send("Item removed.");
    });
});

//Start Server
db.on('open', function () {
    console.log("Mongo Connected");
    //define database structure
    var itemSchema = mongoose.Schema({
        code: String,
        description: String,
        price: Number,
        category: String,
        image: String,
        stock: Number,
        deliveryDays: Number,
        user: String
    });
    //create constructor (mongoose model)
    ItemDB = mongoose.model("itemCh6", itemSchema);
});

db.on('error', function (error) {
    console.log("Error connecting to Mongo");
    console.log(error);
})


app.listen(8080, function () {
    console.log("Server running at http://localhost:8080");
    console.log("Press Ctrl+C to kill it");

});