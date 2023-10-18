
var checkValidVaccineDose = (e) => {
    let vaccineDose = {
        vaccineDose: $(e.target).val(),
        user: $(e.target).attr('userId')
    }
    vaccineDose = JSON.stringify(vaccineDose);

    $.ajax({
        url: `${siteUrl}/panel/patient/checkVaccineDoseExist`,
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: vaccineDose,
        success: (res) => {
            console.log(res)
            if (res.field == false) {
                document.getElementById('vaccineDose').setCustomValidity("false");
                $(e.target).siblings('.invalid-feedback').text(`
                نوبت واکسن وارد شده قبلا ثبت شده است!
            `);
                isValidVaccineDose = false;
            } else {
                isValidVaccineDose = true;
                document.getElementById('vaccineDose').setCustomValidity("");
                $(e.target).siblings('.invalid-feedback').text(`
                بازه مجاز برای نوبت واکسن 1-4 میباشد!
                `);
            }
        },
        error: (err) => {
            console.log(err)
        }
    });

}
var checkEcrfValidity = () => {
    if (
        (parseInt($('#vaccineDose').val()) > 4) ||
        (parseInt($('#age').val()) < 5) ||
        (parseInt($('#weight').val()) < 15 || parseInt($('#weight').val()) > 250) ||
        (parseInt($('#height').val()) < 50 || parseInt($('#height').val()) > 250)
    ) {
        return false;
    } else {
        return true;
    }
}
$(document).ready(() => {
    // User Exsist Validation =================================================

    /*     $("#email").on('input', (e) => {
            let email = {
                email: $(e.target).val(),
            }
            email = JSON.stringify(email);
            $.ajax({
                url: `${siteUrl}/panel/checkUserExist`,
                type: 'POST',
                dataType: "json",
                contentType: "application/json",
                data: email,
                success: (res) => {
                    if (res.field == false) {
                        document.getElementById('email').setCustomValidity("false");
                        $(e.target).siblings('.invalid-feedback').text(`
                    ایمیل وارد شده ثبت شده است!
                    `);
    
                    } else {
                        $(e.target).siblings('.invalid-feedback').text(`
            لطفا یک ایمیل معتبر وارد کنید!
                    `);
                        document.getElementById('email').setCustomValidity("");
                    }
                },
                error: (err) => {
                    console.log(err)
                }
            });
    
        }); */
    $("#nationalCode").on('input', (e) => {
        let nationalCode = { nationalCode: $(e.target).val() }
        nationalCode = JSON.stringify(nationalCode);
        $.ajax({
            url: `${siteUrl}/panel/checkUserExist`,
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: nationalCode,
            success: (res) => {
                if (res.field == false) {
                    document.getElementById('nationalCode').setCustomValidity("false");
                    $(e.target).siblings('.invalid-feedback').text(`
            کدملی وارد شده ثبت شده است!
                `);

                } else {
                    document.getElementById('nationalCode').setCustomValidity("");
                    $(e.target).siblings('.invalid-feedback').text(`
            پر کردن این فیلد الزامی است!
                `);
                }
            },
            error: (err) => {
                console.log(err)
            }
        });
    });
    $("#username").on('input', (e) => {
        let username = { username: $(e.target).val() }
        username = JSON.stringify(username);
        $.ajax({
            url: `${siteUrl}/panel/checkUserExist`,
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: username,
            success: (res) => {
                if (res.field == false) {
                    document.getElementById('username').setCustomValidity("false");
                    $(e.target).siblings('.invalid-feedback').text(`
            نام کاربری وارد شده ثبت شده است!
                `);

                } else {
                    document.getElementById('username').setCustomValidity("");
                    $(e.target).siblings('.invalid-feedback').text(`
            پر کردن این فیلد الزامی است!
                `);
                }
            },
            error: (err) => {
                console.log(err)
            }
        });

    });

    $("#vaccineDose").on('input', (e) => {
        checkValidVaccineDose(e)
    });

   /* $('#fname,#lname,#e_hcenterName,#hCenterName').on('keyup', (el) => {
        if ($(el.target).attr('id') != 'username') {
            $(el.target).val((index, val) => {
                val = val.replace(/[0-9A-Za-z]+/g, '');
                if (val == '') return '';
                return val;
            });
        }
    });*/
    $('#fname,#lname,#e_hcenterName,#hCenterName').on('keyup', (el) => {
        if ($(el.target).attr('id') != 'username') {
            $(el.target).val((index, val) => {
                val = val.replace(/[A-Za-z]+/g, '');
                if (val == '') return '';
                return val;
            });
        }
    });
/*     $('input[type="text"]').on('keyup', (el) => {
        if ($(el.target).attr('id') != 'username') {
            $(el.target).val((index, val) => {
                val = val.replace(/[0-9A-Za-z]+/g, '');
                if (val == '') return '';
                return val;
            });
        }
    }); */
    $('#birthDay').on('keyup', (e) => {
        $(e.target).val('');
    });
    $('#postCode').on('keyup', (e) => {
        keyupNumbers(e.target);
    });
    $('#emergancyPhone,#faxPhone,#healthCarePrxyPhone,#homePhone,#workPhone').on('keyup', (e) => {
        if ($(e.target).val() == '' || $(e.target).val().slice(0, 1) != '0') $(e.target).val('0');
        keyupNumbers(e.target);
    });
    $('#emergancyPhone,#faxPhone,#healthCarePrxyPhone,#homePhone,#workPhone').on('focus', (e) => {
        if ($(e.target).val() == '') $(e.target).val('0');
    });
    $('#cellularPhone,#cellPhone').on('keyup', (e) => {
        if ($(e.target).val() == '' || $(e.target).val().slice(0, 2) != '09') $(e.target).val('09');
        keyupNumbers(e.target);
    });
    $('#cellularPhone,#cellPhone').on('focus', (e) => {
        if ($(e.target).val() == '') $(e.target).val('09');
    });

    $('#postCode').on('change', (e) => {
        if (e.target.value.length < 10) {
            document.getElementById('postCode').setCustomValidity('false');
        } else {
            document.getElementById('postCode').setCustomValidity("");
        }
    });
    $('#nationalCode').on('change', (e) => {
        if (e.target.value.length < 10) {
            document.getElementById('nationalCode').setCustomValidity('false');
        } else {
            document.getElementById('nationalCode').setCustomValidity("");
        }
    });

    $('#age,#vaccineDose,#weight,#height').on('change', (e) => {
        isValidForm = checkEcrfValidity();
    });


})
