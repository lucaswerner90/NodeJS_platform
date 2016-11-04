/*
  MAIN FILE NODE SERVER
*/

// Declare of the express's app
let express=require('express');
let app=express();


// Inclusion of third-party middlewares
let bodyParser=require('body-parser');
let urlEncodedParser=bodyParser.json();



/*
  HERE IS WHERE WE CHARGE THE ROUTES THAT WE WILL USE IN THE SERVER APP
*/
// Inclusion of the routes
let authentication=require('./authentication/index');

// Route related with the DB manage
let bbdd=require('./db/index');

// Route related with the files functionality
let files=require('./files/index');



/*
  EXAMPLE TEST
*/
// app.get("/",function(req,res,next){
//   res.send("Bienvenido al servidor de nodeJS de TED");
// });

app.use(bodyParser.urlencoded({ extended: true }));


app.use(authentication);
app.use('/bbdd',bbdd);
app.use('/file',files);

app.get("/",(req,res) =>{
  res.send("Bienvenido al server de NodeJS");
})


// Manejo de los errores 404
app.use((req, res, next)=> {
  res.redirect("back");
});




app.listen(5000);
