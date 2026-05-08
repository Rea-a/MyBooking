const convertData = require( './convertData.cjs')

////////////////////////USATO IN IndexServer.cjs//////////////////////

///mi serve per generare una mappa con le date quando creo un hotel


//GENERAZIONE DATE
const today = new Date()                        //creo una nuova data riguardante oggi
let tempData = new Date()                       //TEST

const calendar = new Map()                      //creo un una mappa contenente il calendario

for( let i = 0 ; i < 100 ; i++){                //genero un totale di 100 date a partire da oggi
    dataTemp = new Date( today.getFullYear() , today.getMonth() , today.getDate() + i)      //dalla data di oggi creo una data temporanea che si incrementa di volta in volta con "i"
    calendar.set( convertData(dataTemp) , false )                                           //imposto nella mappa "calendar" la data generata convertita in base all'utilizzo con convertData() e la imposto a false
}                                                                                           //false significa che non è stata prenotata

module.exports = calendar;