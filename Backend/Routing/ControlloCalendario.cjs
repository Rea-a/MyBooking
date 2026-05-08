const formatData = require('../Logica/FormattazioneDati/formatData.cjs');
const dateJS = require('../Logica/FormattazioneDati/dateJS.cjs')
const convertData = require('../Logica/FormattazioneDati/convertData.cjs')


///////////////////////////////USATO IN RoutingHotel.cjs -> USATO IN FormRicerca.jsx////////////////////////////////////////////



function checkCalendar (map , dataArrivo , dataPartenza , range) {                                                                              //il range lo ottengo grazie alla differenza tra date fatta in RoutingHotel

    let flag = 0;
    let formattedDataArrivo = formatData(dataArrivo)                                                                                            //Elimino gli zeri da dataArrivo   ("2025-07-03" --> "2025-7-3")
    let formattedDataPartenza = formatData(dataPartenza)                                                                                        //Elimino gli zeri da dataPartenza  

    map.forEach( ( value , key) => {                                                                                                            //prendo l'oggetto calendario contenente le date

        if( key == formattedDataArrivo ) {                                                                                                      //Trovata la corrispondenza date nel calendario

            let baseDynamicKey = dateJS(dataArrivo)                                                                                             //Creato la base per la chiave dinamica

            for( let i = 0 ; i < range ; i++ ){                                                                                                 //Data trovata -> Inizio a scorrere il calendario

                let dinamicKey = new Date(baseDynamicKey.getFullYear() , baseDynamicKey.getMonth() , baseDynamicKey.getDate() + i)              //Creo la chiave dinamica
                let c1 = convertData(dinamicKey)                                                                                                //Converto la data per RENDERLA COMPATIBILE CON IL MIO CALENDARIO

                if( map.get(c1) == true ){                                                                                                      //Data è già bloccata (dovrebbe essere false per essere disponibile)
                    flag++;                                                                                                                     //Modo per visualizzare un errore 
                }

                if(flag > 0){                                                                                                                   //Se ho già una prenotazione è inutile bloccare
                    return flag;
                }
            }
        } 

        if(flag > 0) {
            return flag;                                                                                                                        //Ci sono delle date occupate, quindi se una sola data diventa true
        }                                                                                                                                       //si incrementa il contantore e con una sola data incrementata non è possibile usare quel range
    })
    return flag;
}

module.exports = checkCalendar;