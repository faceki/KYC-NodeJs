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

app.get('/login',(req, res)=>{
    res.render('login')
})
app.get('/face-scane',(req, res)=>{
    res.render('face-scane')
})
app.get('/kyc',(req, res)=>{
    res.render('kyc')
})
app.get('/idscane-front',(req, res)=>{
    res.render('idscane-front')
})
app.get('/idscane-back',(req, res)=>{
    res.render('idscane-back')
})
app.get('/driving-front',(req, res)=>{
    res.render('idscane-front')
})
app.get('/driving-back',(req, res)=>{
    res.render('idscane-back')
})
app.get('/passport-front',(req, res)=>{
    res.render('idscane-front')
})
app.get('/passport-back',(req, res)=>{
    res.render('idscane-back')
})
app.get('/take-selfie',(req, res)=>{
    res.render('take-selfie')
})
app.get('/kyc-result',(req, res)=>{
    res.render('kyc-result')
})
app.get('/kyc-success',(req, res)=>{
    res.render('kyc-success')
})
app.get('/kyc-declined',(req, res)=>{
    res.render('kyc-declined')
})
app.get('/kyc-error',(req, res)=>{
    res.render('kyc-error')
})
app.get('/faceki-sign-in',(req, res)=>{
    res.render('faceki-sign-in',{
        title:'Faceki Login',
        name: 'Faceki'
    })
})
app.get('/faceki-sign-up',(req, res)=>{
    res.render('faceki-sign-up',{
        title:'Faceki Signup',
        name: 'Faceki'
    })
})
app.get('/faceki-request-a-sign-in',(req, res)=>{
    res.render('faceki-request-a-sign-in',{
        title:'Request Sigin',
        name: 'Faceki'
    })
})
app.get('/faceki-request-a-sign-in-pending',(req, res)=>{
    res.render('faceki-request-a-sign-in-pending',{
        title:'Request Sigin',
        name: 'Faceki'
    })
})
app.get('/dashboard',async (req, res)=>{
    try{
        //var user = await User.findByFaceId(req.query.id)
        res.render('faceki-sign-in-complete',{
            title: 'success'
        })
    }catch (e){
        res.render('error',{
            title:'Some error Occured',
            name: 'Faceki'
        })
    }
})
app.get('/lowquality',(req, res)=>{
    res.render('lowquality',{
        title: 'Low Quality Photo',
        desc:"Quality of photo is not good please try again..",
        name:'Faceki'
    })
})
app.get('/loginfailed',(req, res)=>{
    res.render('error',{
        title: 'Login Failed',
        desc:"You are not Authenticated to login into the account.",
        name:'Faceki'
    })
})
app.get('/facedistance',(req, res)=>{
    res.render('facedistance',{
        title: 'Face is far from camera',
        desc:"Bring your eye more closer to the camera.",
        name:'Faceki'
    })
})
app.get('/error',(req, res)=>{
    res.render('error',{
        title: 'Not live photo',
        desc:"You are not Authenticated to login into the account.",
        name:'Faceki'
    })
})
app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})

