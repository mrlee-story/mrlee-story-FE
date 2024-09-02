//  function : Math-반올림 함수 //
export const mathRound = (arg:number, digit:number) => {
    return Math.round(arg * (10**digit)) / 10**digit;
}
//  function : Math-버림 함수   //
export const mathFloor = (arg:number, digit:number) => {
    return Math.floor(arg * (10**digit)) / 10**digit;
}

//  function : 파일 url 리스트 to 파일 리스트   //
export const convertUrlsToFiles = async(urls: string[]) => {
    const files: File[] = [];
    for (const url of urls) {
        const file = await convertUrlToFile(url);
        files.push(file);
    }
    return files;
}

//  function : 파일 url to 파일 //
export const convertUrlToFile = async (url:string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const extend = url.split('.').pop();
    const fileName = url.split('/').pop();
    const meta = { type : `image/${extend}` };

    return new File([data], fileName as string, meta);
}

//  function : 랜덤 난수 생성   //
export const getRandomCoefficient = (min, max) => {
    return Math.random() * (max*min) + min;
}