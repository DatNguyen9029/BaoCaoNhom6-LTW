let form_collection = document.getElementsByClassName("container1");
let form_collection2 = document.getElementsByClassName("required_field");
let submit_button = document.getElementById("mainbutton");

let PASSWORD_LENGTH=8;

function validate(obj){
    if (!obj.checkValidity){
        return null;
    }
    let first_bool=obj.checkValidity();
    let err_msg = null;
    if (obj.type=="password"){
        if (obj.id=="rpt_pswd"){
           first_bool=(first_bool&&obj.value==document.getElementById("pswd").value);
           if (first_bool==false){
            err_msg = "Hãy nhập đúng như mật khẩu!";
           }
        } else {
            first_bool=(first_bool && obj.value.length>=PASSWORD_LENGTH);
            if (first_bool==false){
                 err_msg = "Mật khẩu phải ít nhất "+PASSWORD_LENGTH+" ký tự!";
            }
           let rpt = document.getElementById("rpt_pswd");
           if (rpt!=undefined && rpt!=null){
            let stuff = validate(rpt);
            if (stuff[0]==true){ 
                rpt.parentElement.firstElementChild.nextSibling.innerHTML = "";
                rpt.parentElement.lastElementChild.innerHTML = "";
            } else {
                rpt.parentElement.firstElementChild.nextSibling.innerHTML = "*";
                rpt.parentElement.lastElementChild.innerHTML = "Hãy nhập đúng như mật khẩu!";
             }
           }
        }
    } else {
        first_bool=(first_bool&&obj.value.length>0);
        if (first_bool==false){
            if (obj.type=="email"){
                err_msg = "Hãy nhập email hợp lệ!";
            } else {
                err_msg = "Không được để trống dòng này!";
            }
        }
    }
    return [first_bool, err_msg];
}

for (let x = 0; x < form_collection.length; x=x+1){
    let this_one = form_collection[x];
    let bruh = this_one.firstElementChild;
    let lol = bruh.nextElementSibling;
    let kiddo = this_one.lastElementChild;
    lol.addEventListener("input",function(){
        let validity = validate(lol);
        console.log(validity[0]);
        if (validity[0]==true){
            kiddo.innerHTML = "";
            bruh.firstElementChild.innerHTML = "";
        } else {
            bruh.firstElementChild.innerHTML = "*";
            kiddo.innerHTML = validity[1];
        }
    })
}

submit_button.addEventListener("click",function(){
    for (let x = 0; x < form_collection.length; x=x+1){
    let this_one = form_collection[x];
    let bruh = this_one.firstElementChild;
    let lol = bruh.nextElementSibling;
    let kiddo = this_one.lastElementChild;

    //check every element.
    let validity = validate(lol);
        console.log(validity[0]);
        if (validity[0]==true){
            kiddo.innerHTML = "";
            bruh.firstElementChild.innerHTML = "";
        } else {
            bruh.firstElementChild.innerHTML = "*";
            kiddo.innerHTML = validity[1];
    }
}
})

