const convertData = require('../Logica/FormattazioneDati/convertData.cjs')                                                                               //Conversione delle date
const dateZeri = require('../Logica/FormattazioneDati/dateZeri.cjs')                                                                                     //Metodo per rimuovere gli zeri dalle date


////////////////////////USATO IN RoutingPrenotazione.cjs -> USATO POI IN HotelPage.jsx//////////////////////////


function cercaData (dataArrivo , mappa , differenzaGiorni){                                                                                             //la mappa sarebbe l'array del calendario in un hotel

    let dataArrivoConvertita = dateZeri(dataArrivo)                                                                                                     //data per accedere alla mappa con zeri rimossi
    let dataArrivoDate = new Date( Number(dataArrivo.slice(0 , 4)) , (Number(dataArrivo.slice(5 , 7 )) - 1) , (Number(dataArrivo.slice(8 , )))   )      //data utile per creare la chiave la creo sulla base della DataArrivo (con zeri) di tipo  Date

    mappa.forEach( function (value , key) {                                                                                                             //Scorro gli elementi della mappa

        if(dataArrivoConvertita === key){                                                                                                               //se la data senza zeri è uguale a quella presente nel DB
            for(let i = 0 ; i < differenzaGiorni ;  i++){                                                                                               //allo imposto che da quella data fino a quella di arrivo determinata dal DayRange sarà true
                
                let tempData = new Date( dataArrivoDate )                                                                                               //salvo la data con gli zeri convertita nuovamente in un "Date()" in una variabile temporanea
                let chiaveDinamicaGenerata = new Date(tempData.setDate(tempData.getDate() + i))                                                         //Genero la chiave per accedere alla mappa e accedo in particolare al giorno incrementando di uno di volta in volta
                let c1 = convertData(chiaveDinamicaGenerata)                                                                                            //Converto la chiave per usarla 

                mappa.set(c1 , true)                                                                                                                    //Imposto le prenotazioni
            }
        }
    })
    return mappa;
}

module.exports = cercaData