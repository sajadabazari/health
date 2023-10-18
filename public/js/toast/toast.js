const Toast = (text,mode="success",close=true)=>{
    let background = "linear-gradient(to right, #00b09b, #96c93d)";
    switch(mode){
        case "error":
            background = "linear-gradient(to right, rgb(255 0 55), rgb(191 0 0))";
            break;
        case "info":
            background = "linear-gradient(to right, rgb(36, 22, 204), rgb(79, 176, 234))";
            break;
    }
    Toastify({
        text,
        duration: 3000,
        newWindow: true,
        close,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background
        },
        onClick: function(){}
      }).showToast();
}
