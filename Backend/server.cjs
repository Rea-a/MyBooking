const mongoose = require("mongoose");                                           //utilizzo la libreria mongoose


const connectDB = async() => {                                                  //salvo il contenuto della funzione in "connectDB"
    try {                                                                       //eseguo la connessione al DB tramite la stringa datami direttamente da MongoDB
        const conn = await mongoose.connect("mongodb+srv://XXXXXXXXXXXXXXXXXXXXXXXXXXXXX");    // inserire il link per la connessione al Database
        console.log(`Connesso al Database!!!`)
    } catch (err){                                                              //se ci sono errori me li restituisce
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;                                                     //esporto il modulo in indexServer.cjs