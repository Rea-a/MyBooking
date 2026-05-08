//RICHIESTA DEI MODULI 
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//METODI FORMATTAZIONE DATI
const rangeDay = require('../Logica/FormattazioneDati/DifferenzaGiorni.cjs')
const checkCalendar = require('./ControlloCalendario.cjs')
const cercaData = require('./cercaData.cjs')


//DB SCHEMA 
const hotel = require('../Models/hotelModel.cjs')

//MIDDLEWARE DI APP
app.use(express.json())
app.use(express.urlencoded({extended: false}))                      //serve per dire a Express di interpretare i dati provenienti da un form HTML (POST) nel formato usato dai form senza file (es. <form method="POST">)
                                                                    //false = usa la libreria querystring (più semplice)
                                                                    //true = usa qs, una libreria che supporta oggetti annidati e array complessi



/////////////////////USATO IN HotelPage.jsx///////////////////////////





//EFFETTUO LA PRENOTAZIONE NELLA PAGINA//////////////////////////////

app.post( '/struttura' , async ( req , res ) => {

    if( req.body ){     
        console.log("Sto iniziando la prenotazione");

        let calendario
        const { dataArrivo , dataPartenza , nome_hotel , cittaHotel , emailUtente , giorniTotali } = req.body                      //Prelevo le informazioni dal corpo della richiesta 

        console.log("Ecco cosa ho ricevuto nel Backend: ",  dataArrivo , dataPartenza , nome_hotel , cittaHotel , emailUtente , giorniTotali)   //le visualizzo

        const dbRequest = await ( hotel.findOne( { $and: [ {nome_hotel: nome_hotel} , {citta: cittaHotel} ] } ) )                               //Ricerco nel mio DB gli hotel che sono affini ai miei criteri di ricerca
                                                                                                                                                // "$gte - great then equal" Cerca solo gli hotel dove il campo n_ospiti è maggiore o uguale a "numeroOspiti"
                                                                                                                                                // "$and - AND logico" cioè voglio i documenti nel DB che soddisfano tutte le condizioni elencate

        if( dbRequest !== null) {                                                                                                               //se trovo l'hotel
            //CORRISPONDENZA FRA GLI HOTEL
            calendario = dbRequest.calendario                                                                                                   //salvo il vecchio calendario dell'hotel
        } else {
            //NESSUNA CORRISPONDENZA FRA GLI HOTEL
            res.status(200).json( {message: "Hotel non trvato"} )                                                                               //altrimenti hotel non trovato
        }

        const dataDifference = rangeDay( dataArrivo , dataPartenza );                                                                           //Differenza giorni fra arrivo e partenza
        let nuovoCalendario = cercaData( dataArrivo , calendario , dataDifference)                                                              //Calendario con le date aggiornate impostate su true

        

        await hotel.updateOne( {$and: [ {nome_hotel: nome_hotel} , {citta: cittaHotel} ] } , { $set: {calendario : nuovoCalendario}} )          //Reimposto il calendario con le date aggiornate

        const nuovaPrenotazione = {                                                                                                             //Creo il nuovo oggetto 'Prenotazione'
            dataArrivo: dataArrivo , 
            dataPartenza: dataPartenza , 
            emailUtente: emailUtente , 
            prezzo: Number( Number(giorniTotali) * Number( dbRequest.prezzo_a_notte ) ) ,
            giorniTotali: giorniTotali
        }
        await hotel.updateOne( {$and: [ {nome_hotel: nome_hotel} , {citta: cittaHotel} ] } , { $push: {prenotazioni : nuovaPrenotazione}} )       //Associo all'hotel la nuova prenotazione, push per l'array prenotazioni
        console.log("Prenotazione effettuata!")
        res.status(200).json({ message: "Prenotazione riuscita!" });
    }

})






module.exports = app;