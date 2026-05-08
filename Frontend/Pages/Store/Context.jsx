import { createContext } from 'react'


const Context = createContext( {} )     //creo Context che inizializza un oggetto vuoto in modo da specificare in App.jsx con Provider i campi che voglio rendere
                                        //disponibili a tutti gli utenti


export default Context;
