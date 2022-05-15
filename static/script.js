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

/**
 * function that searches for a product by its name and returns the 
 * list of corresponding products as a select menu
 */
function getProductsByName() {

    let item_name = document.getElementById("input_food_item").value;
    
    fetch('/api/v1/products')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 
        
        data = data.filter((elem)=>{
            return elem["name"].toLowerCase().includes(item_name.toLowerCase());
        });

        if (data.length <= 4){
            let res = "";
            data.forEach(element => {
                res += `<option value="${element['self']}">${element["name"]}</option>`;
            });

            floatingSelectProduct.innerHTML = res;
        }

    })
    .catch( error => console.error(error) ); // error handle
    
}

/**
 * function that fills the add food consumption form fields with the 
 * select option results of the search of the function getProductsByName
 */
function fillProductActivityForm(){
    let inputFoodName = document.getElementById("input_food_name");
    let inputFoodCode = document.getElementById("input_food_code");
    
    let productReference = document.getElementById("floatingSelectProduct").value;
    
    fetch(productReference)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 

        // fill the food consumption fields
        inputFoodName.value = data["name"];
        inputFoodCode.value = data["code"];
    })
    .catch( error => console.error(error) );  // error handle
}



/**
 * Inital calls
 */
loadMaterials();
getProductsByName();