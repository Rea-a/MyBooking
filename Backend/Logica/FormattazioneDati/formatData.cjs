//////////////////////USATO IN ControlloCalendario.cjs -> USATO IN RoutingHotel.cjs -> USATO IN FormRicerca.jsx/////////////////////


//RIMUOVO GLI ZERI DALLA DATA  ("2025-07-03" --> "2025-7-3")
function formatData( data ) {

    //let dataConverted = dataSlice(data)

    let month = Number( data.slice(5 , 7) )
    let day = Number( data.slice( 8 ,  ))

    let monthString = data.slice( 5 , 7)
    let dayString = data.slice(8 ,  )

    if(month < 10) {                    //controllo se è un numero inferiore a 10 quindi diventerebbe 01 o 02 ...
        //C'E ZERO AVANTI
        monthString = data.slice(6 , 7)
    }

    if(day < 10) {                     //controllo se è un numero inferiore a 10 quindi diventerebbe 01 o 02 ...
        //C'E ZERO AVANTI
        dayString = data.slice(9 ,  )
    }

    data = data.slice(0 , 5) + monthString + "-" + dayString;

    return data;
}

module.exports = formatData;