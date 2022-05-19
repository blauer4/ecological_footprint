/**
 * Funzione che carica i dati delle impronte ecologiche degli utenti e ne calcola la media
 */

 function loadGlobalImpact() {
    let somma = 0;
    let counter = 0;
    
    fetch('/api/v1/activities')
    .then((resp) => resp.json())
    .then(async function (data) {
           let h1 = document.getElementById("average_placeholder");
           h1.innerHTML = data[data.length - 1].total_impact;
        }).catch(error => console.error(error));
    console.log(somma/counter);
}

loadGlobalImpact();