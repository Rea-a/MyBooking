const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome obbligatorio!"],
        trim: true
    },
    cognome: {
        type: String,
        required: [true, "Cognome obbligatorio!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email obbligatoria!"],
        unique: true,                                          //valore unico nel DB
        trim: true,                                            //rimozione spazi a inizio e fine del campo
        lowercase: true,                                       //conversione di tutti i valori inseriti in minuscolo
        match: [/\S+@\S+\.\S+/, "L'email non è valida"]
    },
    password: {
        type: String,
        required: [true, "Password obbligatoria!"]
    },
    dataNascita: {                                             //data di nascita è una stinga per il formato ISO recuparato dall'elemento di Material UI
        type: Date,
        required: [true, "Inserire data di nascita!"]
    },
    genere: {
        type: String,
        trim: true
    }
});



userSchema.pre("save", async function (next) {              //prima di salvare "save" un documento User, esegue questa funzone e gli passa next()
    if(!this.isModified("password")){                       //se la password non è modificata allora non eseguire nulla
        return next();
    }

    try{                                                    
        const salt = await bcrypt.genSalt(10);                      //se è modificata allora creo una stringa casuale usata per aumentare la sicurezza dell'hashing
        this.password = await bcrypt.hash(this.password, salt);     //faccio l'hashing della passwrod con "salt"
        next();
    }catch(err){
        next(err);
    }
})





module.exports = mongoose.model("User", userSchema);