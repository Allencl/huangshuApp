/**
 * 获取当前时间 格式 HHMMss
 */
export  function getNowTime() { 
    let d = new Date();  
    let month =d.getMonth() + 1;
    if(month<10){
        month ="0"+ month;
    }   
    let date = (d.getHours()) + "" +(month) +(d.getSeconds());
    return date;
}
/**
 * 获取当前时间 格式 yyyyMMdd
 */
export  function getNowDate() {
    let d = new Date(); 
    let month =d.getMonth() + 1;
    if(month<10){
        month ="0"+ month;
    }
    let date = (d.getFullYear()) +""+(month) +(d.getDate());
    return date;
}

/**
 * 获取当前时间 格式 yyyyMMdd
 */
export  function getDate(date) {
    let d ;
    if(date){
        d= new Date(date); 
    }else{
        d= new Date(); 
    }
    let month =d.getMonth() + 1;
    if(month<10){
        month ="0"+ month;
    }
    return (d.getFullYear()) +""+(month) +(d.getDate());
}