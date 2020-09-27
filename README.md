# MyWork

MyWork è un’applicazione web che permette ad un utente di tenere traccia in modo semplice ed
intuitivo dei progetti a cui lavora, segnalando le attività e i vari aggiornamenti annessi e fornendo
un sistema di interazione con gli altri partecipanti.

## Funzionalità

MyWork comprende, oltre ad un set di funzionalità che permettono all’utente di svolgere tutte le
azioni necessarie per gestire un progetto e le sue attività, altre che migliorano la user experience
e rendono la piattaforma più “personalizzabile”.

1. Autenticazione
2. Barra laterale intuitiva con tutte le funzionalità
3. Sistema di notifiche
4. Impostazioni e personalizzazione dell'esperienza
   1. Scelta del tema
5. Gestione dei progetti
6. Gestione delle attività relative ai progetti
   1. Sistema di aggiornamenti
   2. Commenti
7. Aggiornamenti real-time all-around

## Tecnologie utilizzate

ReactJS, HTML5, CSS3, JavaScript.
MaterialUI Icons, Avatar, Tooltip.
Firebase e Firestore.

## Per visualizzare l'applicazione live

Visita [https://mywork-final.web.app](https://mywork-final.web.app)

## Per testare l'applicazione in locale

Sono necessarie alcune dipendenze per avviare l'applicazione in locale

### Node.js e npm

Verifica che node e npm siano installati usando i comandi `node -v` e `npm -v`. <br />
Se non fossero installati, puoi installarli scaricando l'installer ufficiale da [https://nodejs.org/it/](nodejs.org) oppure utilizzando [https://brew.sh/index_it](brew) su MacOS/Linux, `brew update` e poi `brew install node`.
Su Windows potrebbe essere necessario aspettare qualche minuto e installare Chocolatey per compilare alcune dipendenze (viene richiesto da Node.js).
Al termine dell'installazione verificare di nuovo che node e npm siano installati.

Dalla directory principale del progetto:

### `npm install`

Per installare tutte le dipendenze del progetto

### `npm start`

Per avviare l'applicazione in modalità DEV. <br />
Visita [http://localhost:3000](http://localhost:3000) (se non hai cambiato la porta) per visualizzare l'applicazione.

### `npm run build`

Avvia il processo di `build` dell'applicazione per una versione di produzione.
