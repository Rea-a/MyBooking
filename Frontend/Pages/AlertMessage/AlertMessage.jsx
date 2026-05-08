import './alertMessage.css'

function AlertMessage( { message , showAlertMethod , messageErrorMethod , mainMessage } ) {

    const handleClose = () => {                                             //appena viene cliccato 
        messageErrorMethod('')                                              //pulisce i campi del messagio
        showAlertMethod(0)                                                  //imposta a zero il flag showAlert per chiudere il popup dell'alert
    }

    return (
        <div id="mainContainerAlertMessage">

            <div id="messageContainerAlertMessage">
                <h3 id="titolo-errore">{mainMessage}</h3>                   {/*mainMessage è il titolo dell'alert */}
                <p>{message}</p>                                            {/*visualizzo contenuto dell'messaggio in errore */}
            </div>

            <div id="buttonContainerAlertMessage">
                <button id="ContainerButtonAlert" onClick={ handleClose }>Chiudi</button>       {/*se cliccato fa partire l'handleClose */}
            </div>

        </div>
    )
}

export default AlertMessage;
