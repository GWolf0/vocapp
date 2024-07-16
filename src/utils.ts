export function getRndNum(min:number,max:number):number{
    return Math.floor(Math.random()*(max-min))+min;
}

export function getRndNums(min:number,max:number,count:number,include:number[]=[],unique:boolean=false):number[]{
    let res:number[]=[...include];
    while(res.length<count){
        let newNum:number=getRndNum(min,max);
        if(unique){
            while(res.includes(newNum))newNum=getRndNum(min,max);
        }
        res.push(newNum);
    }
    return res;
}

export function shuffleArray<T>(arr:T[],inplace:boolean=true):T[]{
    const len=arr.length;
    let newInstance:T[]=[];
    let takenIdx:number[]=[];
    for(let i=0;i<len;i++){
        let rnd=getRndNum(0,len);
        if(inplace)[arr[i],arr[rnd]]=[arr[rnd],arr[i]];
        else{
            while(takenIdx.includes(rnd))rnd=getRndNum(0,len);
            newInstance.push(arr[rnd]);
            takenIdx.push(rnd);
        }
    }
    return inplace?arr:newInstance;
}

export function getRandomSamples<T>(arr:T[],count:number):T[]{
    let takenIdxs:number[]=[];
    let res:T[]=[];
    for(let i=0;i<arr.length;i++){
        let rndIdx=getRndNum(0,arr.length);
        while(takenIdxs.includes(rndIdx))rndIdx=getRndNum(0,arr.length);
        takenIdxs.push(rndIdx);
        res.push(arr[rndIdx]);
    }
    return res;
}
