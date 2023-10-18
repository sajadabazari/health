const moment = require('jalali-moment');

exports.getJalali = (_d) => {
    var date = new Date(_d);
    var d = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
    var m = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
    var y = date.getFullYear();
    return `${y}/${m}/${d}`;
}
exports.mToJalali = (e)=>{
    return moment(e).locale('fa').format('YYYY/MM/DD');
}
exports.mToJalali2 = (e)=>{
    return moment(e).locale('fa').format('YYYY-MM-DD');
}
exports.mToJalaliTFormat = (e)=>{
    return moment(e).locale('fa').format('HH:mm YYYY/MM/DD');
}
exports.jalaliToM = (e)=>{
    return moment.from(e.trim(), 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD')
}