let api = axios.create({
    baseURL: window.location.origin,
/*     headers: {
        'X-CSRF-Token': document.querySelector("meta[name=_token]").getAttribute('content')
    } */
  });
  api.interceptors.response.use((response) => response, (error) => {
    if(error.response.status === 500){
        Toast("خطایی از سمت سرور رخ داده است!","error")
    }else if(error.response.status === 401){
        Toast("خطا احرازهویت، دوباره وارد!","error")
    }else if(error.response.status === 422){
        Toast(error.response.data.message,"error")
    }else{
        Toast("خطایی از سمت سرور رخ داده است!","error")
    }
    throw error;
  });
