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
  const createUser = async (user) => {
    $("#createUser").prop("disabled", true);
    $("#createUser span").removeClass("visually-hidden");
    try {
      const { data } = await api.post("/panel/user/create", user);
      console.log(data);
      Toast("کاربر با موفقیت ثبت شد !", "success", false);
      setTimeout(()=>{
        window.location.href = `${window.location.origin}/panel/users`;
      },800)
    } catch (err) {
      console.log(err);
    }
    $("#createUser").prop("disabled", false);
    $("#createUser span").addClass("visually-hidden");
    return false;
  }
  const updateUser = async (user) => {
    $("#updateUser").prop("disabled", true);
    $("#updateUser span").removeClass("visually-hidden");
    try {
      const { data } = await api.post("/panel/user/update", user);
      console.log(data);
      Toast("تغییرات با موفقیت انجام شد !", "success", false);
      setTimeout(()=>{
        window.location.href = `${window.location.origin}/panel/users`;
      },800)
    } catch (err) {
      console.log(err);
    }
    $("#updateUser").prop("disabled", false);
    $("#updateUser span").addClass("visually-hidden");
    return false;
  }

  
  const updatePassword = async (user) => {
    $("#updatePassword").prop("disabled", true);
    $("#updatePassword span").removeClass("visually-hidden");
    try {
      const { data } = await api.post("/panel/user/changePassword", user);
      console.log(data);
      Toast("گذرواژه با موفقیت تغییر یافت!", "success", false);
    } catch (err) {
      console.log(err);
    }
    $("#updatePassword").prop("disabled", false);
    $("#updatePassword span").addClass("visually-hidden");
    return false;
  }

  