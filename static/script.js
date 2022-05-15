/**
 * Funzione che carica i dati del db riguardante i materiali di rifiuto
 * dell'applicazione
 */

function loadMaterials() {
    fetch('/api/v1/materials')
        .then((resp) => resp.json())
        .then(function (data) {
            let select = document.getElementById("materialSelect");
            data.forEach(element => {
                let option = document.createElement("option");
                option.setAttribute("value", element.self);
                let text = document.createTextNode(element.name);
                option.appendChild(text);
                select.appendChild(option);
            });
        }).catch(error => console.error(error));
}

loadMaterials();

function getProductsByName() {

    let item_name = document.getElementById("input_food_item").value;

    fetch('/api/v1/products')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) { // Here you get the data to modify as you please

            data.forEach(element => {
                if (element["name"].includes(item_name)) {
                    console.log(element["name"])
                }
            });

        })
        .catch(error => console.error(error));// If there is any error you will catch them here

}

getProductsByName();