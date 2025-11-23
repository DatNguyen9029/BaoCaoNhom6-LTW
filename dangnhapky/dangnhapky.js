document.addEventListener("DOMContentLoaded",function(){
    //Xử lý form tìm kiếm trong header
    const searchForm = document.querySelector('.header_search-bar form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = searchForm.querySelector('input[type="text"]');
        const query = input ? input.value.trim() : '';
        if (!query) {
            alert('Vui lòng nhập từ khóa tìm kiếm.');
            if (input) input.focus();
            return;
        }
        

        // Chuyển hướng tới trang kết quả tìm kiếm với query làm param
        const encoded = encodeURIComponent(query);
        window.location.href = `/search.html?q=${encoded}`;
    });
    //-------\\


    const form_collection = document.getElementsByClassName("container1");

    let PASSWORD_LENGTH=8;

    function them_tai_khoan(ten,ho,email,password){
        let key = "n6acc_"+email.toLowerCase();
        try {
            localStorage.setItem(key,JSON.stringify({
                "ten" : ten,
                "ho" : ho,
                "email" : email,
                "password" : password,
            }));
            return true;
        } catch(e) {
            alert("Đã xảy ra lỗi khi tạo tài khoản!");
            return false;
        }
    }

    //Thêm một số tài khoản có sẵn để test.
    const DEFAULT_ACCOUNTS = [
        {
            ten: "Tài khoản",
            ho: "Test",
            email: "test123@abc.com",
            password: "test1234", 
        },
        {
            ten: "Nguyễn Văn",
            ho: "A",
            email: "nguyenvana@gmail.com",
            password: "12345678",
        },
        {
            ten: "Nguyen Thi",
            ho: "B",
            email: "nguyenthib@gmail.com",
            password: "abcdefgh",
        },
    ]
    DEFAULT_ACCOUNTS.forEach(account => {
        let key = "n6acc_"+account.email.toLowerCase();
        if (!localStorage.getItem(key)){

            let pswd_length = account.password.length;
            if (pswd_length<PASSWORD_LENGTH){
                return;
            }

            them_tai_khoan(account.ten,account.ho,account.email,account.password);
        }
    });
    

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
                first_bool ? {} : err_msg=`Mật khẩu phải ít nhất ${PASSWORD_LENGTH} ký tự!`;

                let rpt = document.getElementById("rpt_pswd");
                if (rpt){
                    let is_rpt_valid = validate(rpt);
                    is_rpt_valid[0]?rpt.parentElement.lastElementChild.innerHTML = "": rpt.parentElement.lastElementChild.innerHTML = "Hãy nhập đúng như mật khẩu!";
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

    function process_form(form){
        //let form;
        if (form.name=="dangnhap"){
            try {
                //form = document.forms["dangnhap"];
                let retrieved_info = JSON.parse(localStorage.getItem("n6acc_"+form["user_email"].value.toLowerCase()));
                if (retrieved_info){
                    let password = retrieved_info["password"];
                    if (password==form["user_pswd"].value){
                        localStorage.setItem("n6acc_current",JSON.stringify({
                            "ten" : retrieved_info["ten"],
                            "ho" : retrieved_info["ho"],
                            "email" : retrieved_info["email"]
                        }));
                        if (confirm("Đăng nhập thành công, bạn có muốn về trang chủ?")==true){
                            window.location.href = "../trangchu.html";  
                        }
                    } else {
                        //sai mk
                        alert("Sai mật khẩu.");
                    }
                } else {
                    //Tai khoan khong ton tai
                    let status = confirm("Email chưa được đăng ký, bạn có muốn đến trang đăng ký?");
                    if (status){
                        window.location.href = "../dangky/dangky.html";
                    }
                }
            } catch(error) {
                alert("Đã xảy ra lỗi trong khi xử lý yêu cầu đăng nhập!\n"+error);
            }
        } else if (form.name=="dangky"){
            try {
                //form = document.forms["dangky"];
                let key = "n6acc_"+form["user_email"].value.toLowerCase();
                let retrieved_info = localStorage.getItem(key);
                if (!retrieved_info){
                    let register_status = them_tai_khoan(form["user_fname"].value,form["user_lname"].value,form["user_email"].value,form["user_pswd"].value);

                    //Tự động đăng nhập.
                    if (register_status){
                        localStorage.setItem("n6acc_current",JSON.stringify({
                            "ten" : form["user_fname"].value,
                            "ho" : form["user_lname"].value,
                            "email" : form["user_email"].value,
                        }));
                        if (confirm("Đăng ký thành công, bạn có muốn về trang chủ?")==true){
                            window.location.href = "../trangchu.html";
                        }
                    }
                } else {
                    //Tai khoan da co roi
                    let status = confirm("Email đã được đăng ký, bạn có muốn đến trang đăng nhập?");
                    if (status){
                        window.location.href = "../dangnhap/dangnhap.html";
                    }
                }
            } catch(error) { 
                alert("Đã xảy ra lỗi trong khi xử lý yêu cầu đăng nhập!\n"+error);
            }
        }
    }

    for (let x = 0; x < form_collection.length; x=x+1){
        let this_field = form_collection[x];
        let title = this_field.firstElementChild;
        let input_el = title.nextElementSibling;
        let error_p = this_field.lastElementChild;
        input_el.addEventListener("input",function(){
            let validity = validate(input_el);
            //console.log(validity[0]);
            if (validity[0]==true){
                error_p.innerHTML = "";
            } else {
                error_p.innerHTML = validity[1];
            }
        })
    }

    for (let x=0;x<document.forms.length;x++){
        let form = document.forms[x];
        if (form.name!="dangky"&&form.name!="dangnhap"){
            continue;
        }
        console.log(form);
        form.addEventListener("submit",function(event){
            event.preventDefault();
            let error = false;
            let containers = form.getElementsByClassName("container1");
            for (let x=0;x<containers.length;x++){
                let this_field = containers[x];
                let title = this_field.firstElementChild;
                let input_el = title.nextElementSibling;
                let error_p = this_field.lastElementChild;
                //console.log(this_field);
                let validity = validate(input_el);
                if (validity[0]==true){
                    error_p.innerHTML = "";
                } else {
                    error_p.innerHTML = validity[1];
                    error=true;
                }
            }
            
            
            if (!error){
                //Form is valid, process the form.
                process_form(form);
                return true;
            } else {
                return false;
            }
        })
    };
});