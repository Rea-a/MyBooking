import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import "../../Pages/GestioneStruttura/GestioneStruttura";


////////////////////////////////////////COMPONENTE PER VISUALIZZARE LE STRUTTURE NEL FormRicerca.jsx/////////////////////////

////////////////ESPORTATO CON QUALCHE MODIFICA///////////////////


function StrutturaCard({
                           struttura,
                           showModificaButton = false,
                           onModificaClick = null,
                           customButton = null
                       }) {
    return (
        <div className="fade-in-up">
            <Card sx={{ width: 390, height: 300, position: 'relative' }} id="box">
                {(showModificaButton || customButton) && (
                    <div id="posizione-bottone">
                        {showModificaButton && (
                            <Button
                                id="visualizzaButton"
                                type="submit"
                                variant="contained"
                                onClick={() => onModificaClick(struttura)}
                            >
                                Modifica
                            </Button>
                        )}
                        {customButton}
                    </div>
                )}

                <div>
                    <img
                        id="img"
                        src={struttura.img}
                        alt={"Hotel " + struttura.nome_hotel}
                    />

                    <ImageListItemBar
                        id="descrizioneHotel"
                        title={"Hotel " + struttura.nome_hotel}
                        subtitle={struttura.citta + ", Via " + struttura.via}

                    />
                </div>
            </Card>
        </div>
    );
}

export default StrutturaCard;