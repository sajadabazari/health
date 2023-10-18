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
const regHCenter = async (hcenter, centersTable) => {
  try {
    const { data } = await api.post("/panel/hcenters/regHCenter", hcenter);
    centersTable.row
      .add([
        data.province.name,
        data.city.name,
        data.hcenter.name,
        `
        <div class="btn-group align-top record-v">
        
        <a
          class="btn btn-sm btn-warning badge"
          data-id="${data.hcenter._id.toString()}"
          href="/panel/hcenter/villages/${data.hcenter._id.toString()}"
          type="button"
          >روستا ها
        </a>
        <a
        class="btn btn-sm btn-primary badge modal-effect editHCenter"
        data-target="#input-modal"
        data-bs-effect="effect-rotate-bottom"
        data-bs-toggle="modal"
        href="#input-modal"
        data-id="${data.hcenter._id.toString()}"
        type="button"
        >ویرایش</a
      >
      <a
        class="btn btn-sm btn-danger badge modal-effect deleteModal"
        data-bs-effect="effect-super-scaled"
        data-id="${data.hcenter._id.toString()}"
        data-bs-toggle="modal"
        href="#modaldemo8"
        type="button"
        ><i class="fa fa-trash"></i
      ></a>
      </div>
        `,
      ])
      .draw(false);
    $("#hCenterName").val("");
    Toast("مرکز سلامت با موفقیت ثبت شد!", "success", false);
  } catch (err) {
    console.log(err);
  }
  return false;
};
const regVillage = async (village, villagesTable) => {
  try {
    const { data } = await api.post("/panel/hcenter/regVillage", village);
    var rowNode = villagesTable.row
      .add([
        data.hcenter.province.name,
        data.hcenter.city.name,
        data.hcenter.name,
        data.village.name,
        `
        <div class="btn-group align-top record-v">
        <a
        class="btn btn-sm btn-primary badge modal-effect editHCenter"
        data-target="#input-modal"
        data-bs-effect="effect-rotate-bottom"
        data-bs-toggle="modal"
        href="#input-modal"
        data-id="${data.village._id.toString()}"
        type="button"
        >ویرایش</a
      >
      <a
        class="btn btn-sm btn-danger badge modal-effect deleteModal"
        data-bs-effect="effect-super-scaled"
        data-id="${data.village._id.toString()}"
        data-bs-toggle="modal"
        href="#modaldemo8"
        type="button"
        ><i class="fa fa-trash"></i
      ></a>
      </div>
        `,
      ])
      .draw(false);
    $("#villageName").val("");
    Toast("روستا با موفقیت ثبت شد!", "success", false);
  } catch (err) {
    console.log(err);
  }
  return false;
};

const deleteVillage = async (id, villagesTable, el) => {
  try {
    const { data } = await api.delete("/panel/hcenter/village/delete", {
      data: { id },
    });
    console.log(data);

 //   $("#modaldemo8").modal("hide");
/*     $("body").removeClass("modal-open");
    $(".modal-backdrop").remove(); */
    Toast("با موفقیت حذف شد!", "success");

    villagesTable.row(el).remove().draw(false);
  } catch (err) {
    console.log(err);
  }
  $("#deleteH").prop("disabled", false);
  $("#deleteH span").addClass("visually-hidden");
  return false;
};
const deleteHCenter = async (id, hCenterName, el) => {
  try {
    const { data } = await api.delete("/panel/hcenter/delete", {
      data: { id },
    });
    console.log(data);

 //   $("#modaldemo8").modal("hide");
/*     $("body").removeClass("modal-open");
    $(".modal-backdrop").remove(); */
    Toast("با موفقیت حذف شد!", "success");

    hCenterName.row(el).remove().draw(false);
  } catch (err) {
    console.log(err);
  }
  $("#deleteH").prop("disabled", false);
  $("#deleteH span").addClass("visually-hidden");
  return false;
};
const editVillage = async (village,el) => {
  try {
     const {data} = await api.put("/panel/hcenter/village/edit",village);
     console.log(data);

     $(el).find('td:nth-child(4)').text(`${village.name}`);
     Toast("تغییرات با موفقیت انجام شد!","success");
 } catch (err) {
     console.log(err);
 }
 $('#updateBtn').prop("disabled",false);
 $('#updateBtn span').addClass('visually-hidden');
 return false;
};
const editHCenter = async (hcenter,el) => {
  try {
     const {data} = await api.put("/panel/hcenter/edit",hcenter);
     console.log(data);

     $(el).find('td:nth-child(3)').text(`${hcenter.name}`);
     Toast("تغییرات با موفقیت انجام شد!","success");
 } catch (err) {
     console.log(err);
 }
 $('#updateBtn').prop("disabled",false);
 $('#updateBtn span').addClass('visually-hidden');
 return false;
};
