export const formalDate = (value) => {
    if (Number(value) < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

export const second2Date = (timesecond, noTime) => {
    let date = new Date(timesecond);
    let year = date.getFullYear();
    let month = formalDate(date.getMonth() + 1);
    let day = formalDate(date.getDate());

    let hour = formalDate(date.getHours());
    let minute = formalDate(date.getMinutes());
    let second = formalDate(date.getSeconds());

    if (!noTime) {
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    } else {
        return `${year}-${month}-${day}`;
    }
    
}

export const yearMonth2Str = (str) => {
    let time = new Date(str);
    let year = time.getFullYear();
    let month = formalDate(time.getMonth() + 1);
    
    return `${year}-${month}`;
}

export const formPara = (form, key, value) => {
    let input = document.createElement('input');
    input.name = key;
    input.value = value;
    form.appendChild(input);
} 