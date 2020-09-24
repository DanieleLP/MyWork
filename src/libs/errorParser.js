const errorParser = (e) => {
    switch (e) {
        case "auth/email-already-exists":
            return "La mail fornita risulta già in uso da un altro utente!"
        case "auth/internal-error":
            return "Errore di sistema durante la procedura di autenticazione!"
        case "auth/invalid-argument":
            return "Errore di sistema: argomento non valido!"
        case "auth/user-not-found":
            return "Non è stato trovato alcun account con la mail inserita!"
        case "auth/invalid-email":
            return "L'indirizzo mail fornito non è valido!"
        default:
            return "Si è verificato un errore durante la procedura di autenticazione!"
    }
}

export default errorParser