let keyupNumbers = (el) => {
    $(el).val((index, val) => {
        val = val.replace(/[^\d]+/g, '');
        if (val == '') return '';
        return val;
    })
}

