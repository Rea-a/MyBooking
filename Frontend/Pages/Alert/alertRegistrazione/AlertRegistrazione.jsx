import "./alertRegistrazione.css"

////////////////React Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

/////////////////////////////////////////////////////




function AlertRegistrazione({ bodyError, flag, onClose }) {


    if (flag !== 1) return null;                //se diverso da uno il fleg non si attiva e fa un return a null





    const divStyle = {                                                              //CSS per impostare la posizione del popup sullo schermo
        position: "fixed", /* fixed per restare in alto indipendentemente dallo scroll */
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,  /* per stare sopra tutto */
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };



    return <>
        <div style={divStyle} id="styleDiv">
            <Card sx={{ minWidth: 400 }} id="boxRegistrazioneAlert">
                <div id="posizionamento">

                    <div id="errore-alert-registrazione">
                        <ReportProblemRoundedIcon id="iconAlert"></ReportProblemRoundedIcon>
                        <p>Errore</p>
                    </div>

                    <p id="bodyErrore">{bodyError}</p>

                    <Button variant="outlined" color="error" onClick={onClose} id="button-alert-error">
                        HO CAPITO
                    </Button>
                    
                </div>
            </Card>
        </div>
    </>
        
}

export default AlertRegistrazione;