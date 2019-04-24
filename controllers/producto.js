'use strict'

const producto = require('../models/producto')
const Compras = require('../models/compra')

function getProducto(req, res) {
    var articulos = {};

    //Falta chequear por fecha y setear que las compras sean de una fecha limitada

    var userCheked = [];
     //Obtengo las compras relacionadas a ese articulo
    Compras.find({ "idCommerce": req.params.idComercio, "articles": req.params.idProducto }, (err, compraResult) => {
        //Obtengo las compras
        for (var i = 0; i < compraResult.length; i++) {
             //Obtengo las compras de ese usuario para saber que compro
             if (!userCheked.includes(compraResult[i].idUser)) {
                 userCheked.push(compraResult[i].idUser);
                 //EN ESTE PASO DEBO AGREGAR QUE LA FECHA SEA ENTRE LA FECHA DE compraResult[i].date
                  Compras.find({ "idCommerce": req.params.idComercio, "idUser": compraResult[i].idUser }, (err, compraResultUser) => {
                     //Recorro las compras de los usuarios
                    
                    for (var h = 0; h < compraResultUser.length; h++) {
                           //Recorro los articulos de los usuarios
                        for (var j = 0; j < compraResult[h].articles.length; j++) {
                            //Si el usuario compro un articulo igual al que preguntamos lo ignoro
                            if (compraResult[h].articles[j] != req.params.idProducto) {
 
                                //Si el articulo ya esta seteado le sumo 1 sino lo agrego al array
                                if (articulos[compraResult[h].articles[j]]) {
                                    articulos[compraResult[h].articles[j]] += 1;
                                } else {
                                    articulos[compraResult[h].articles[j]] = 1;
                                }
                            }
                        }
                    }
                });
            }


        }
    })
    //Como es una funcion async espero que termine de generar todo antes de enviar los datos a la vista
    setTimeout(function () {
        res.status(200).send({ articulos })
    }, 1000)

}




module.exports = {
    getProducto,
}