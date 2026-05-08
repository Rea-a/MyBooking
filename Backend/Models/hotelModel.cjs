const mongoose = require("mongoose");


const hotelSchema = new mongoose.Schema ({  
    emailProprietario: {
            type: String,
    },  
    nome_hotel: {
        type: String,
        required: [true, "Nome obbligatorio!"],
        trim: true
    },
    citta: {
        type: String,
        required: [true, "Città obbligatoria!"],
        trim: true
    },
    via: {
        type: String,
        required: [true, "Via obbligatoria!"],
        trim: true
    },
    descrizione: {
        type: String,
        required: [true, "Descrizione obbligatoria!"],
        trim: true
    },
    prezzo_a_notte: {
        type: Number,
        required: [true, "Nome obbligatorio!"],
        trim: true
    },
    n_ospiti: {
        type: Number,
        required: [true, "Nome obbligatorio!"],
        trim: true,
        validator: {
            validator: Number.isInteger,
            message: "Il numero massimo di ospiti deve essere un intero!"
        }
    },
    img: {
        type: String
    },
    calendario: {
        type: Map , required: true
    },
    prenotazioni: [ {
        emailUtente: {type: String , required: true} , 
        dataArrivo: {type: Date , required: true} , 
        dataPartenza: {type: Date , required: true} , 
        prezzo: {type: Number , required: true} , 
        giorniTotali: {type: Number , required: true}
    }] ,
    recensioni: [ 
        {
            nomeUtente: {type: String , required: true} ,
            voto: {type: Number , required: true} , 
            corpoRecensione: {type: String , required: true} , 
            emailUtente: {type: String , required: true} 
        }
    ]
})



module.exports = mongoose.model("Hotel", hotelSchema);