const updateQuestion = async (file, uploader, name) => {
  try {
    const { data } = await api.post(
      `/panel/questions/update?field=${name}`,
      file
    );
    console.log(data);
    Toast("پرسشنامه با موفقیت بروز شد!", "success", false);
  } catch (err) {
    console.log(err);
  }

  $(`.file-name`).val("");
  $(`#${uploader}`).prop("disabled", false);
  $(`#${uploader} span`).addClass("visually-hidden");
  return false;
};
const updateAnswer = async (file) => {
  try {
    const { data } = await api.post(`/panel/answer/update`, file);
    console.log(data);
    Toast("پاسخنامه با موفقیت بارگذاری شد!", "success", false);
  } catch (err) {
    console.log(err);
  }

  $(`.answerText`).val("");
  $(`#upAnswerFile`).prop("disabled", false);
  $(`#upAnswerFile span`).addClass("visually-hidden");
  return false;
};
const setSeen = async (id,el) => {
  try {
    const { data } = await api.post(`/panel/answer/setSeen`, { id });
    $(el).find("td:nth-child(3)").html(`
    <span class="badge badge-info">
    دیده شده
    </span>
    `);
    Toast("با موفقیت انجام شد!", "success", false);
  } catch (err) {
    console.log(err);
  }

  $(`.answerText`).val("");
  $(`#upAnswerFile`).prop("disabled", false);
  $(`#upAnswerFile span`).addClass("visually-hidden");
  return false;
};
