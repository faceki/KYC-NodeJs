require('dotenv').config({path: '/Users/varunjain/IdeaProjects/Faceki/src/.env'})
const express = require('express')
const cors = require('cors');
const path = require('path')
const hbs = require('hbs')

var bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 4848


const publicDirectoryPath = path.join(__dirname,'../public/')
const publicDirectoryPath1 = path.join(__dirname,'../src/routers/uploads')
const viewsDirectoryPath = path.join(__dirname,'../templates/views')
const partialPaths = path.join(__dirname,'../templates/partials')

app.set('view engine','hbs')
app.set('views',viewsDirectoryPath)

hbs.registerPartials(partialPaths)
app.use(cors());
app.use(express.static(publicDirectoryPath))
app.use(express.static(publicDirectoryPath1))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('',(req, res)=>{
    res.render('index')
})

app.get('/idscaner',(req, res)=>{
    res.render('idscaner')
})

app.get('/take-selfie',(req, res)=>{
    res.render('take-selfie')
})

app.get('/verifying',(req, res)=>{
    res.render('verifying')
})

app.get('/successfull',(req, res)=>{
    res.render('successfull')
})

app.get('/extra-check',(req, res)=>{
    res.render('extra-check')
})

app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})

