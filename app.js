var express   =   require("express"),
  app         =   express(), 
  cons        =   require("consolidate"), 
  puerto      =   8081, 
  bodyParser  =   require('body-parser'),
  http        =   require('http').Server(app),
  MongoClient =   require("mongodb").MongoClient,db;
 

 
  //Conectarse a la base de datos de MngoDB...
MongoClient.connect("mongodb://127.0.0.1:27017/Comentario", function(err, database)
{
  if(err) throw err;
  //Buscar un documento en la colección...
  db = database;  
});


//consolidate integra swig con express...
app.engine("html", cons.swig); //Template engine...
app.set("view engine", "html");
app.set("views", __dirname + "/vistas");
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res)
{
  res.render("index", {
    titulo  :   "index"
  });
});

app.post('/create', function (req, res)
{   
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    var f=new Date();
    var fechahora=(diasSemana[f.getDay()]+""+f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear() + " son las " + f.getHours()+":"+f.getMinutes());
    var data = req.body;
  coleccion.count(function(err, count)
  {

    data.idcomentario = count + 1;
    data.like = 0;
    data.fecha = fechahora;
    coleccion.insert(data, function(err, records)
    {
      res.json({status : true});
    });
  });
});

app.get("/updateLike/:id", function(req, res)
{
  var query = {idcomentario : Number(req.param("id"))};
  var incrementa = {$inc : {"like" : 1}};
  coleccion.update(query, incrementa, function(err, actualiza)
  {
    var cursor = coleccion.find(query, {"_id" : false, "like" : true});
    cursor.toArray(function(err, doc)
    {
      res.json(doc);
    });
  });
});
app.get('/getAllData', function(req, res)
{
  var comentario = coleccion.find(); 
  comentario.toArray(function(err,doc)
  {
    if(err)
    {
      throw err
    }
    res.json(doc);
      
  });
});


app.listen(puerto);
console.log("Express server iniciado en el " + puerto);
