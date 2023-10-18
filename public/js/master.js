$(document).ready(() => {
    $.ajax({
        url: `${siteUrl}/panel/hcenters/count`,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: ({ count }) => {
            $('#_hcCount').text(count)
        },
        error: err => console.log(err)
    });
});