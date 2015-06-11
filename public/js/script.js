$(function()
{
var nomServicios = [
              {
                servicio  :   "Trae todos los Comentarios", 
                urlServicio :   "/getAllData", 
                metodo    :   "GET"
              }, 
              {
                servicio  :   "Crear Comentario", 
                urlServicio :  "/Create",
                metodo    :   "POST"
              },
              {
                servicio  :   "Actualiza Like", 
                urlServicio :   "/updateLike", 
                metodo    :   "GET"
              }];


listadoDatos = [];
like = [];
var elementos = ["Nombre", "txtArea"];
var consumeServicios = function(tipo, val)
{
        
        var servicio = {
            url   : nomServicios[tipo - 1].urlServicio, 
            metodo  : nomServicios[tipo - 1].metodo, 
            datos   : ""
          };
    if(tipo==3)
    {
        servicio.url += "/" + val;
    }else{
        servicio.datos = val !== "" ? JSON.stringify(val) : "";
    }

    $.ajax(
    {
      url     : servicio.url,
      type    : servicio.metodo, 
      data    : servicio.datos, 
      dataType  : "json",
      contentType: "application/json; charset=utf-8"
    }).done(function(data)
    {          
    if(tipo === 1)
			{
				listadoDatos = [];
				for(var i = 0; i < data.length; i++)
				{
					//console.log(data[i]);
					listadoDatos.push(new datoData(data[i]));
				}
				imprimeDatos();
			}
			else
			{
				if(tipo === 2 )
					{
				     if(data.status){
                     limpiarCampos();
                     console.log("Guardado Correctamente");
                     }
                     else{
                     console.log("Error");
                      }
					if(tipo === 3)
					{
					like = [ ];
					for(var i = 0; i < data.length; i++)
				{
					//console.log(data[i]);
					like.push(new datoData(data[i]));
				}
				imprimeDatos();
					}					
				}
				else
				{
				
};
consumeServicios(1, "");

  function datoData(datos)
  {
    this.idcomentario = datos.idcomentario;
    this.usuario = datos.usuario;
    this.comentario = datos.comentario;
    this.like = datos.like;
    this.fecha = datos.Fecha;    
    //Para devolver los datos del usuario a ser impresos...
    this.imprime = function()
    {
      return [ 
              this.usuario,
              this.comentario,
              this.like,
              this.fecha
             ];
    }
  }
  var imprimeDatos = function imprimeDatos()
  {
    var MeGusta = "Me Gusta";
    var txt = "<ul id='messages'>";
    for(var i = listadoDatos.length-1; i >= 0; i--)
    {
      datosPersona = listadoDatos[i].imprime();
      
        txt += "<li><h3>"+(datosPersona[0])+"<h3>";
        txt += "<span>"+(datosPersona[1])+"</span><br>";
        txt += "<span><img src='img/like.png' class='like'          >"+(datosPersona[2])+"        <button id='e_"+i+"' class='btnlike'>Me Gusta</button></span><br>";
        txt +="Fecha: "+(datosPersona[3])+"</span><br>";
        txt += "</li>"
      
  
    }
    txt += "</ul>";
    $("#imprime").html(txt);
    //Poner las acciones de editar y eliminar...
    for(var i = 0; i < listadoDatos.length; i++)
    {
      //Like...
      $("#e_" + i).click(function(event)
      {
        var indice = event.target.id.split("_")[1];
        idUser = listadoDatos[indice].idcomentario;
        console.log("Oprimiendo el boton "+idUser);
        consumeServicios(3, idUser);
        consumeServicios(1, "");
      });
    }
  }

  var limpiarCampos = function()
  {
    console.log("Limpia campos...");
    for(var i = 0; i < elementos.length; i++)
    {
      $("#" + elementos[i]).val("");
    }
  }

//Acciones sobre el botón guardar...
  $("#publicar").click(function(event)
  {      
    guardarDatos();
  });

  var guardarDatos = function()
  {
    console.log("publicar");
    var valores = [];
    var correcto = true;
    for(var i = 0; i < elementos.length; i++)
    {
      if($("#" + elementos[i]).val() === "")
      {
        alert("Digite todos los campos");
        $("#" + elementos[i]).focus();
        correcto = false;
        break;
      }
      else
      {
        valores[i] = $("#" + elementos[i]).val();
      }
    }

     if(correcto)
    {     
      var nuevoDato = {
                usuario  :   valores[0], 
                comentario :   valores[1],                 
                like    :   0
              };     
      console.log(nuevoDato);           
      consumeServicios(2,1, nuevoDato);
     
    }


  }
