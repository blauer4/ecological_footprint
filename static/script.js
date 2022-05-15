/**
 * Funzione che carica i dati del db riguardante i materiali di rifiuto
 * dell'applicazione
 */

function loadMaterials(){
    fetch('/api/v1/materials')
    .then((resp)=> resp.json())
    .then(function(data){
        console.log(data);
    });
}