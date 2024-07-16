import { getRandomSamples, getRndNum, getRndNums, shuffleArray } from "../utils";

interface VocabDataDef{
    name:string,
    termsNames:string[],
    topicsNames:string[],
    topics:Array<{terms:string[]}[]>
};
interface SettingsJsonDataDef{
    termName1Idx:number,
    optionalTerm1Idx:number,
    termName2Idx:number,
    selectedTopicsIdxs:number[],
    maxItemsCount:number
};
type LangsTypes="ger"|"jap";
enum ScreenType{home,quiz,vocab,res};

class QuizItem{
    static UIDs:number=1
    uid:number;terms:string[];tscore:number;fscore:number;
    
    constructor(terms:string[],tscore:number=0,fscore:number=0){
        this.uid=QuizItem.UIDs++;
        this.terms=terms.map(term=>term.trim());
        this.tscore=tscore;
        this.fscore=fscore;
    }
    static fromJson(json:{terms:string[],tscore?:number,fscore?:number}):QuizItem{return new QuizItem(json.terms,json.tscore,json.fscore);}
    static score(item:QuizItem):number{return item.tscore-item.fscore;}
}

class Quiz{
    static instance:Quiz;
    static curScreen:ScreenType=ScreenType.home;
    static selectedTopicForVocab:number=0;
    static lang:LangsTypes;

    name:string
    termsNames:string[]
    topicsNames:string[]
    topics:Array<QuizItem[]>

    static selectedTopicsIdxs:number[]=[]
    static termName1Idx:number;static optionalTerm1Idx:number;static termName2Idx:number
    static itemsPool:QuizItem[];static ansTracker:boolean[]
    static items:QuizItem[];
    static curItem:QuizItem;
    static currentIdx:number=0;static maxItemsCount:number=0
    static choices:string[];
    static initialized=false;static isStarted:boolean=false;static isDone:boolean=false;

    constructor(name:string,termsNames:string[],topicsNames:string[],topics:Array<QuizItem[]>){
        this.name=name;
        this.termsNames=termsNames;
        this.topicsNames=topicsNames;
        this.topics=topics;
    }

    static init(orgVocabData:{ger:VocabDataDef,jap:VocabDataDef}){
        Quiz.lang=Quiz.getSavedLang();
        const data:string|null=window.localStorage.getItem(`data_${Quiz.lang.toString()}`);
        Quiz.instance=data?Quiz.fromJsonString(data):Quiz.fromJsonString(JSON.stringify(Quiz.lang==="ger"?orgVocabData.ger:orgVocabData.jap));
        Quiz.loadSettings();
        Quiz.isStarted=false;
        Quiz.setScreen(ScreenType.home);
        Quiz.initialized=true;//console.log(Quiz.instance.toJson())
    }

    static onChangeLang(lang:LangsTypes){
        Quiz.lang=lang;
        localStorage.setItem("lang",Quiz.lang.toString());
    }
    static getSavedLang():LangsTypes{
        const savedLang:string|null=localStorage.getItem("lang");
        return savedLang?savedLang as LangsTypes:"ger";
    }

    static start(){
        Quiz.itemsPool=[];
        Quiz.items=[];
        const selectedTopics:QuizItem[][]=Quiz.instance.topics.filter((t,i)=>Quiz.selectedTopicsIdxs.includes(i));
        selectedTopics.forEach((t,i)=>t.forEach((item,j)=>Quiz.itemsPool.push(item)));
        Quiz.ansTracker=[];
        Quiz.currentIdx=-1;
        // Quiz.maxItemsCount=Quiz
        Quiz.getNextItem();
        Quiz.isDone=false;
        Quiz.isStarted=true;
        Quiz.setScreen(ScreenType.quiz);
    }
    static setScreen(screen:ScreenType){
        this.curScreen=screen;
    }
    static getNextItem(){
        if(Quiz.currentIdx+1===Quiz.maxItemsCount)return Quiz.onDone();
        Quiz.currentIdx++;
        //set currentItem
        const scores:number[]=Quiz.itemsPool.map((item,i)=>QuizItem.score(item));
        const lowestScore:number=Math.min(...scores);
        const itemsWithLowestScores:QuizItem[]=Quiz.itemsPool.filter((item,i)=>QuizItem.score(item)<=lowestScore+Math.abs(lowestScore)*0.5);
        const f_itemsWithLowestScores:QuizItem[]=getRandomSamples(itemsWithLowestScores,Math.min(4,itemsWithLowestScores.length));
        let rnd:number=getRndNum(0,f_itemsWithLowestScores.length);
        let newItem:QuizItem=f_itemsWithLowestScores[rnd];
        //console.log("lowestScore",lowestScore,"itemsWithLowestScores",itemsWithLowestScores,"f_itemsWithLowestScores",f_itemsWithLowestScores,"flowest",lowestScore+Math.abs(lowestScore)*0.5)
        let itStopper=0;
        while(newItem===Quiz.curItem){
            rnd=getRndNum(0,f_itemsWithLowestScores.length);
            newItem=f_itemsWithLowestScores[rnd];
            itStopper++;
            if(itStopper>30){
                rnd=getRndNum(0,Quiz.itemsPool.length);
                newItem=Quiz.itemsPool[rnd];
                break;
            }
        }
        Quiz.curItem=newItem;
        Quiz.items.push(Quiz.curItem);
        //setup choices
        const curItemIdx:number=Quiz.getItemIdx(Quiz.curItem);//console.log("curitem",Quiz.curItem,curItemIdx);
        Quiz.choices=getRndNums(0,Quiz.itemsPool.length,4,[curItemIdx],true).map((num)=>Quiz.itemsPool[num].terms[Quiz.termName2Idx]);
        // Quiz.choices.push(Quiz.getCorrectAnswer());
        shuffleArray(Quiz.choices,true);
    }
    static getItemIdx(item:QuizItem):number{
        return Quiz.itemsPool.findIndex((_item,i)=>item===_item);
    }
    static onAnswer(ans:string){
        const isCorrect:boolean=Quiz.checkAnswer(ans);
        Quiz.ansTracker.push(isCorrect);
        if(isCorrect)Quiz.curItem.tscore++;
        else Quiz.curItem.fscore++;
        Quiz.curItem.tscore=Math.min(10,Quiz.curItem.tscore);
        Quiz.curItem.fscore=Math.min(10,Quiz.curItem.fscore);
        Quiz.getNextItem();
    }
    static checkAnswer(ans:string):boolean{
        return ans===Quiz.getCorrectAnswer();
    }
    static getCorrectAnswer():string{
        return Quiz.curItem.terms[Quiz.termName2Idx];
    }
    static getQst():string{
        return Quiz.curItem.terms[Quiz.termName1Idx];
    }
    static getOptionalQst():string{
        return Quiz.optionalTerm1Idx>-1?Quiz.curItem.terms[Quiz.optionalTerm1Idx]:"";
    }
    static getOptionalItem(topicIdx:number,itemIdx:number):string{
        return Quiz.optionalTerm1Idx>-1?Quiz.instance.topics[topicIdx][itemIdx].terms[Quiz.optionalTerm1Idx]:"";
    }
    static onDone(){
        Quiz.isDone=true;
        Quiz.isStarted=false;
        Quiz.instance.save();
    }
    static onRetry(){
        Quiz.start();
    }
    static getScore():number{
        return Quiz.ansTracker.filter(ans=>ans).length;
    }

    static fromVocabData(data:string):Array<QuizItem[]>{
        let topics:Array<QuizItem[]>=[]
        const topics_sv:string[]=data.trim().split("***");
        for(let i=0;i<topics_sv.length;i++){
            topics.push([]);
            let lines_sv:string[]=topics_sv[i].split("\n");
            for(let j=0;j<lines_sv.length;j++){
                let terms_sv:string[]=lines_sv[j].split("\t");
                const quizItem:QuizItem=new QuizItem(terms_sv,0,0);
                topics[i].push(quizItem);
            }
        }
        return topics;
    }
    static fromJsonString(strJson:string):Quiz{
        const json:VocabDataDef=JSON.parse(strJson) as VocabDataDef;
        return Quiz.fromJson(json);
    }
    static fromJson(json:VocabDataDef):Quiz{
        return new Quiz(json.name,json.termsNames,json.topicsNames,json.topics.map(t=>t.map(item=>QuizItem.fromJson(item))));
    }

    static getTopicScore(topicIdx:number):number{
        const topic:Array<QuizItem>=Quiz.instance.topics[topicIdx];
        const topicLen=topic.length;
        const scores:number[]=topic.map(item=>QuizItem.score(item)>0?1:0);
        const sum:number=scores.reduce((prev,cur,idx)=>cur+prev,0);
        return parseFloat((sum/topicLen*10).toFixed(1));
    }
    static getTopicsScores():number[]{
        return Quiz.instance.topics.map((t,i)=>Quiz.getTopicScore(i));
    }
    static getGlobalScore():number{
        const scores:number[]=Quiz.instance.topics.map((topic,i)=>Quiz.getTopicScore(i));
        const sum:number=scores.reduce((prev,cur,idx)=>cur+prev,0);
        return parseFloat((sum/Quiz.instance.topics.length).toFixed(1));
    }

    getTopicItems(topicIdx:number):QuizItem[]{
        return this.topics[topicIdx];
    }
    getTotalWordsCount():number{
        const topicsWordsCounts:number[]=this.topics.map((t,i)=>this.getTopicWordsCount(i));
        return topicsWordsCounts.reduce((prev,cur,idx)=>prev+cur,0);
    }
    getTopicWordsCount(topicIdx:number):number{
        return this.topics[topicIdx].length;
    }

    toJson():VocabDataDef{
        return({"name":this.name,"termsNames":this.termsNames,"topicsNames":this.topicsNames,
            "topics":this.topics
        });
    }
    save(){
        const saveData:{}=this.toJson();
        window.localStorage.setItem(`data_${Quiz.lang.toString()}`,JSON.stringify(saveData));
    }

    static updateSettings(settings:SettingsJsonDataDef){
        Quiz.termName1Idx=settings.termName1Idx;
        Quiz.optionalTerm1Idx=settings.optionalTerm1Idx;
        Quiz.termName2Idx=settings.termName2Idx;
        Quiz.selectedTopicsIdxs=settings.selectedTopicsIdxs;
        Quiz.maxItemsCount=settings.maxItemsCount;
        Quiz.saveSettings();
    }
    static saveSettings(){
        window.localStorage.setItem(`settings_${Quiz.lang.toString()}`,JSON.stringify({
            "termName1Idx":Quiz.termName1Idx,
            "optionalTerm1Idx":Quiz.optionalTerm1Idx,
            "termName2Idx":Quiz.termName2Idx,
            "selectedTopicsIdxs":Quiz.selectedTopicsIdxs,
            "maxItemsCount":Quiz.maxItemsCount
        }));
    }
    static loadSettings(){
        const settingsData:string|null=localStorage.getItem(`settings_${Quiz.lang.toString()}`);
        if(settingsData){
            const json:SettingsJsonDataDef=JSON.parse(settingsData) as SettingsJsonDataDef;
            Quiz.termName1Idx=json.termName1Idx;
            Quiz.optionalTerm1Idx=json.optionalTerm1Idx;
            Quiz.termName2Idx=json.termName2Idx;
            Quiz.selectedTopicsIdxs=json.selectedTopicsIdxs;
            Quiz.maxItemsCount=json.maxItemsCount;
        }else{
            Quiz.termName1Idx=0;
            Quiz.optionalTerm1Idx=-1;
            Quiz.termName2Idx=1;
            Quiz.selectedTopicsIdxs=[];
            Quiz.maxItemsCount=20;
        }
    }
    static clearSaveData(){
        localStorage.clear();
    }

}

export type{VocabDataDef,SettingsJsonDataDef,LangsTypes}
export {QuizItem,ScreenType}
export default Quiz;

