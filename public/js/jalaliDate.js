let getJalali = (_d) => {
    var date = new Date(_d);
    var d = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
    var m = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var y = date.getFullYear();
    return `${y}/${m}/${d}`;
}
