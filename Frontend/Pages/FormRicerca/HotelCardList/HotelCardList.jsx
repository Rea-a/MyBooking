import './hotelCardList.css'
import Context from "../../Store/Context";
import { useContext , useState } from 'react'
import {useNavigate} from "react-router-dom"



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//////////////////////////////////////////////////////////




function HotelCardList ( {structure , dayRange} ) {

    const navigate = useNavigate()

    const { hotelPrenotation , setHotelPrenotation } = useContext(Context);               //prendo lo state globale che mi è utile per salvare le informazioni dell'hotel che voglio visualizzare
                                                                                          //utilizzato dopo per visualizzare le prenotazioni
    const handleDiscoverMore = () => {                                                    //se clicco il bottone di "Scopri di più"
        setHotelPrenotation( structure );                                                 //setto nello state globale la struttura scelta da visualizzare
        navigate('/prenotazione')                                                         //nella pagina prenotazione (dove vedrò solo quella singola ricerca con dettagli aggiuntivi, es: commenti)
    }

    return(



            <div>
                <Card id="box-hotelcardlist" sx={{ width: 900, height: 500 }} key={structure.id}>
                   

                    <div id="container-hotel">

                        <div id="immagine-hoterlcardlist">
                            <img
                                id="img-modifica"
                                src={structure.img || " "}
                                alt={"Hotel " + structure.nome_hotel}
                            />
                        </div>


                        <div id="descrizione-hotelcardlist">
                            <div id="contenitore-descrizione-hotelcardlist">
                                <ul id="listadescrizione">
                                    <li key={structure.id}><h3>Hotel {structure.nome_hotel}</h3></li>
                                    <li>Città: {structure.citta}, via {structure.via}</li>
                                    <li>Descrizione: {structure.descrizione}</li>
                                    <li>Numero Giorni Scelti: {dayRange}</li>
                                    <li>Prezzo a Notte: {structure.prezzo_a_notte} €</li>
                                    <li>Prezzo Totale: { Number(structure.prezzo_a_notte) * Number(dayRange)} €</li>            {/*converto le date in number altrimenti visualizzo NaN */}
                                </ul>
                            </div>

                            <div id="posizione-scopridipiu">
                                <Button id="button-hotelcardlist" type="button"  variant="outlined" onClick={handleDiscoverMore}>Scopri di più</Button>
                            </div>
                            
                        </div>


                    </div>



                    
                </Card>
            </div>







    )
}

export default HotelCardList
