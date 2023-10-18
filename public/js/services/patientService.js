const getCities = async (id) => {
    try {
      console.log(id);
  
      const { data } = await api.post("/panel/hcenters/getCities", { id });
      console.log(data);
      $("#city_id").empty();
       $("#city_id").append(`
       <option value="null">انتخاب کنید</option>
      `);
      data.forEach((city, key) => {
        $("#city_id").append(`
           <option value="${city._id}">${city.name}</option>
           `);
      });
      $("#city_id").prop("disabled", 0);
    } catch (err) {
      console.log(err);
    }
    return false;
  };
const getHCenters = async (id) => {
    try {
      console.log(id);
  
      const { data } = await api.post("/panel/hcenters/getHCenters", { id });
      console.log(data);
      $("#hcenter_id").empty();
       $("#hcenter_id").append(`
       <option value="null">انتخاب کنید</option>
      `);
      data.forEach((hcenter, key) => {
        $("#hcenter_id").append(`
           <option value="${hcenter._id}">${hcenter.name}</option>
           `);
      });
      $("#hcenter_id").prop("disabled", 0);
    } catch (err) {
      console.log(err);
    }
    return false;
  };
const getVillages = async (id) => {
    try {
      console.log(id);
  
      const { data } = await api.post("/panel/hcenters/getVillages", { id });
      console.log(data);
      $("#village_id").empty();
       $("#village_id").append(`
       <option value="null">انتخاب کنید</option>
      `);
      data.forEach((village, key) => {
        $("#village_id").append(`
           <option value="${village._id}">${village.name}</option>
           `);
      });
      $("#village_id").prop("disabled", 0);
    } catch (err) {
      console.log(err);
    }
    return false;
  };
  
  const regPatient = async (pData) => {
    try {
      const { data } = await api.post("/panel/patient/create", pData);
      console.log(data);
      Toast("بیمار با موفقیت ثبت شد !", "success", false);
      $('.sw-toolbar-bottom').html(`
        <a class="btn btn-success" style="margin-left:20px" href="/panel/patient/e_crfs/${data.patient._id}">ثبت عوارض بیمار</a>
        <a class="btn btn-primary" href="/panel/patients">انتقال به صفحه بیماران</a>
      `);
      $('#step-12').html(`
      <h4 style="
    color: #3d3d3d;
    margin: auto;
    text-align: center;
    margin-top: 200px;
    ">بیمار با موفقیت ثبت شد، جهت ثبت عوارض بیمار روی لینک زیر کلیک کنید</h4>
      `);
      $('a.nav-link').addClass('disabled');
      $('a.nav-link').unbind("click");
    } catch (err) {
      console.log(err);
    }
    return false;
  }
  const updatePatient = async (pData) => {
    try {
      const { data } = await api.post("/panel/patient/update", pData);
      console.log(data);
      Toast("تغییرات با موفقیت ثبت شد!", "success", false);
      $('.sw-toolbar-bottom').html(`
        <a class="btn btn-success" style="margin-left:20px" href="/panel/patient/e_crfs/${data._user._id}">ثبت عوارض بیمار</a>
        <a class="btn btn-primary" href="/panel/patients">انتقال به صفحه بیماران</a>
      `);
      $('#step-12').html(`
      <h4 style="
    color: #3d3d3d;
    margin: auto;
    text-align: center;
    margin-top: 200px;
    ">بیمار با موفقیت ثبت شد، جهت ثبت عوارض بیمار روی لینک زیر کلیک کنید</h4>
      `);
      $('a.nav-link').addClass('disabled');
      $('a.nav-link').unbind("click");
      setTimeout(()=>{
        window.location.href = `${window.location.origin}/panel/patients`;
         },800)
    } catch (err) {
      console.log(err);
    }
    return false;
  }