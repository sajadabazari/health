$(document).ready(() => {
    $('#loginUser').on('click', (e) => {
        // $(e.target).attr('data-id')
        let nationalCode = $('#nationalCode').val();
        let password = $('#password').val();
        let login = {
            nationalCode, password
        }
        login = JSON.stringify(login);

        $.ajax({
            url: `${siteUrl}/panel/loginUser`,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: login,
            success: (res) => {
                if (res.statusCode === 200) {
                    localStorage.setItem('login', res.token);
                    window.location.href = `${siteUrl}/panel`;
                }
            },
            error: function (err) {
                console.log(err)
                if (err.status === 401) {
                    Toastify({
                        text: "نام کاربری یا رمز عبور معتبر نمیباشد",
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "bottom", // `top` or `bottom`
                        position: "left", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, #d50000,#df007b)",
                        },
                    }).showToast();
                    
                } else {
                    console.log(err);
                }
            }
        });
    })
    let checkValidity = false;


    //========================Form Wizard========================================

    $('#registerForm').on('submit', (e) => {
        if (e.target.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            checkValidity = false;
        }
        checkValidity = true;
        e.target.classList.add('was-validated');
        e.preventDefault();
    })
    $('#userRegister').on('click', (e) => {
        e.preventDefault();
        $('#registerForm').trigger('submit');
        if (checkValidity == false) { return };          // $(e.target).attr('data-id')
        let fname = $('#fname').val();
        let lname = $('#lname').val();
        let nationalCode = $('#nationalCode').val();
        let email = $('#email').val();
        let password = $('#password').val();
        let register = {
            fname,
            lname,
            mobileNumber:'09111111111',
            nationalCode,
            isPatient:true,
            email,
            password
        }
        register = JSON.stringify(register);

        $.ajax({
            url: `${siteUrl}/panel/user/register`,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: register,
            success: (res) => {
                if (res.statusCode === 200) {
                    window.location.href = `${siteUrl}/panel`;
                }
            },
            error: function (err) {
                console.log('sasas', err)
            }
        });
    })

});