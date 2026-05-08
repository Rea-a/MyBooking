//VERIFICO SOLAMENTE LE INFORMAZIONI RISPETTO A DOCUMENTS SU UTENTI NORMALI
const mongoose = require('mongoose')
const hostSchema = require('../../Models/hostModel.cjs')                    //prelevo lo schema del DB dell'Host usato nel DB
const bcrypt = require('bcryptjs')                                          //uso bcrypt per la password criptata

async function verificaHost (emailUtente , passwordUtente ){                // ricevo in input email e password dell'utente

    console.log(`\nInformazioni Ricevute dal Metodo\n-Email: ${emailUtente}\n-Password Host: ${passwordUtente}`)      // stampo per essere sicuro delle informazioni ricevute

    if( emailUtente == null || passwordUtente == null){                     //se non ricevo nulla, invio messaggio a console per esortare di inserire
        console.log(`\nSpecificare Email e Password`)
        return 0;
    }

    const request5 = await hostSchema.findOne( {email: emailUtente})        // ricerco nel DB l'email dell'host visto che è unica per ognuno

    if( request5 == null){                                                  //se l'email non è presente
        console.log(`\nNon ci sono host con questa mail`)
        return 1;
    } 

    if( !await bcrypt.compare(passwordUtente , request5.password) ){       //faccio una comparazione tra la pass ricevuta e quella ritrovata tramite l'email da findOne
        console.log(`\nEmail o Password Errati`)                           //se diversa allora PASSWORD ERRATA
        return 2;
    }

    console.log( `\nBackend - Verifica HOST - HOST Loggato`)               // se nessuna eccezione allora Loggato
    return 3;

}

module.exports = verificaHost