//////////////////////USATO IN ControlloCalendario.cjs -> USATO IN RoutingHotel.cjs -> USATO IN FormRicerca.jsx/////////////////////

//////////////////////USATO IN CercaData.cjs -> USATO IN RoutingPrenotazione.cjs -> HotelPage.jsx//////////////////////////////////

function convertData (data) {
    
    let dataString = "";

    dataString = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()

    return dataString;
}
module.exports = convertData;