/**
 * Funxione che controlla la corrispondenza tra le password create e di conferma
 */

 function checkPasswords() {
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm_password").value;

    if (password != confirm){
        console.log("different pws inserted in registration fase");
        document.getElementById("error-message").innerHTML ="passwords do not match";
    } else {
        document.getElementById("register_form").submit();
    }

}
