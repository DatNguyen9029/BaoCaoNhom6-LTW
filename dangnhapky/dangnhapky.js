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
           first_bool ? {} : err_msg="Hãy nhập đúng như mật khẩu!";
        } else {
            first_bool=(first_bool && obj.value.length>=PASSWORD_LENGTH);
            first_bool ? {} : err_msg=`Mật khẩu phải ít nhất "${PASSWORD_LENGTH}" ký tự!`;

           let rpt = document.getElementById("rpt_pswd");
           if (rpt){
            let stuff = validate(rpt);
            stuff[0]?rpt.parentElement.lastElementChild.innerHTML = "": rpt.parentElement.lastElementChild.innerHTML = "Hãy nhập đúng như mật khẩu!";
           }
        }
    } else {
        first_bool=(first_bool&&obj.value.length>0);
        if (first_bool==false){
            obj.type=="email"? err_msg = "Hãy nhập email hợp lệ!" : err_msg = "Không được để trống dòng này!";
        }
    }
    return [first_bool, err_msg];
}

for (let x = 0; x < form_collection.length; x=x+1){
    let this_field = form_collection[x];
    let title = this_field.firstElementChild;
    let input_el = title.nextElementSibling;
    let error_p = this_field.lastElementChild;
    input_el.addEventListener("input",function(){
        let validity = validate(input_el);
        console.log(validity[0]);
        if (validity[0]==true){
            bruh.firstElementChild.innerHTML = "";
        } else {
            error_p.innerHTML = validity[1];
        }
    })
}

submit_button.addEventListener("click",function(){
    for (let x = 0; x < form_collection.length; x=x+1){
        let this_field = form_collection[x];
        let title = this_field.firstElementChild;
        let input_el = title.nextElementSibling;
        let error_p = this_field.lastElementChild;

        //check every element.
        let validity = validate(input_el);
            console.log(validity[0]);
            if (validity[0]==true){
                bruh.firstElementChild.innerHTML = "";
            } else {
                error_p.innerHTML = validity[1];
        }
    }
})

