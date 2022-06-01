
function register(){
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm_password").value;

    if (password != confirm){
        document.getElementById("error-message").innerHTML ="passwords do not match";
        return;
    }

    fetch('/api/v2/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            name: name,
            surname: surname,
            username: username,
            email: email,
            password: password 
        }),
    })
    .then((resp) => {
        if (resp.status == 201){
            document.getElementById("error-message").innerHTML = "Succesfully registered";
        }else{
            resp.text().then((data)=>{
                document.getElementById("error-message").innerHTML = data;
            });
        }

        return;
    })
    .catch( error => console.error(error) ); // error handle

}