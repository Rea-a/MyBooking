//////////////////////USATO IN ControlloCalendario.cjs -> USATO IN RoutingHotel.cjs -> USATO IN FormRicerca.jsx/////////////////////

//CREO LA DATA
function dateJS ( date ) {                                          //Passo un valore e creo una variabile di tipo data 

    //PRELEVO ANNO - MESE - GIORNO DA 'date'
    let year = Number(date.slice( 0 , 4))
    let month = Number(date.slice( 5 , 7))
    let day = Number(date.slice( 8 , ))

    let newDate = new Date(year , month - 1, day)                     //Creo una data con quelle informazioni
                                                                      // month - 1 perché parte da posizione 0 altrimenti risulterebbe il mese dopo
    return newDate;
}
module.exports = dateJS