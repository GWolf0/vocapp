import React, { useContext, useEffect, useMemo, useState } from 'react'
import AppBar from '../Comps/AppBar';
import Quiz, { LangsTypes, ScreenType } from '../Objects/quiz';
import { appContext } from '../contexts/AppContext';
import ger_flag from '../assets/ger_flag.svg';
import jap_flag from '../assets/jap_flag.svg';

function HomeScreen(){
    const {screen,setScreen, lang,setLang}=useContext(appContext);

    const [selectedTerm1,setSelectedTerm1]=useState<number>(Quiz.termName1Idx);
    const [selectedOptionalTerm1,setSelectedOptionalTerm1]=useState<number>(Quiz.optionalTerm1Idx);
    const [selectedTerm2,setSelectedTerm2]=useState<number>(Quiz.termName2Idx);
    const [selectedTopics,setSelectedTopics]=useState<number[]>(Quiz.selectedTopicsIdxs);
    const [maxItemsCount,setMaxItemsCount]=useState<number>(Quiz.maxItemsCount);

    const topicsScores:number[]=useMemo(()=>Quiz.getTopicsScores(),[]);
    const globalScore:number=useMemo(()=>Quiz.getGlobalScore(),[]);

    useEffect(()=>{

    },[]);

    function onTerm1Changed(idx_str:string){
        const idx:number=parseInt(idx_str);
        setSelectedTerm1(idx);
    }
    function onOptionalTerm1Changed(idx_str:string){
        const idx:number=parseInt(idx_str);
        setSelectedOptionalTerm1(idx);
    }
    function onTerm2Changed(idx_str:string){
        const idx:number=parseInt(idx_str);
        setSelectedTerm2(idx);
    }
    function onSelectTopic(idx:number){
        if(selectedTopics.includes(idx)){
            setSelectedTopics(prev=>prev.filter((t,i)=>t!==idx));
        }else{
            setSelectedTopics(prev=>[...prev,idx]);
        }
    }

    function onTopicCheck(e:React.MouseEvent,idx:number){
        e.stopPropagation();
        Quiz.selectedTopicForVocab=idx;
        Quiz.setScreen(ScreenType.vocab);
        // ctx.updateUI();
        setScreen(Quiz.curScreen);
    }

    function onStart(){
        if(selectedTerm1===selectedTerm2||selectedTopics.length===0)return alert("Please select a topic(s)!");
        saveSettings();
        Quiz.start();
        // ctx.updateUI();
        setScreen(Quiz.curScreen);
    }
    function saveSettings(){
        Quiz.updateSettings({termName1Idx:selectedTerm1,optionalTerm1Idx:selectedOptionalTerm1,termName2Idx:selectedTerm2,selectedTopicsIdxs:selectedTopics,maxItemsCount:maxItemsCount});
    }

    function onClearSaveData(){
        if(confirm("Clear save data?")){
            Quiz.clearSaveData();
            Quiz.setScreen(ScreenType.home);
            // ctx.updateUI();
            location.reload();
        }
    }

    function renderTitle():React.ReactNode{
        return <p className='text-lighter font-bolder'>Home <span className={`${globalScore<0?'text-error':'text-info'}`}>({globalScore}/10)</span></p>
    }
    function renderTrailing():React.ReactNode{
        return <button className='h-8 px-1 text-lighter hover:opacity-70 rounded border border-dark' title='clear saved data' onClick={onClearSaveData}>CSD</button>
    }

    function onChangeLangBtn(lang:LangsTypes){
        Quiz.onChangeLang(lang);
        setLang(Quiz.lang);
        location.reload();
    }

    return (
        <div className='h-screen mx-auto flex flex-col bg-darkest' style={{aspectRatio:"0.5"}}>
            <AppBar title={renderTitle()} trailing={renderTrailing()} />
            <div className='p-2 flex flex-col grow'>
                <div className='border border-dark mb-4 p-2 flex items-center gap-2'>
                    <button onClick={()=>onChangeLangBtn("ger")} className={`flex flex-row items-center gap-2 p-1.5 rounded border ${lang==='ger'?'border-primary':'border-semitrans'}`}>
                        <div><img src={ger_flag} width={32} /></div><p className='text-xs text-lighter'>GER</p>
                    </button>
                    <button onClick={()=>onChangeLangBtn("jap")} className={`flex flex-row items-center gap-2 p-1.5 rounded border ${lang==='jap'?'border-primary':'border-semitrans'}`}>
                        <div><img src={jap_flag} width={32} /></div><p className='text-xs text-lighter'>JAP</p>
                    </button>
                </div>
                <div className='border border-dark mb-4 p-2'>
                    {/* <p className='font-bolder text-primary mb-4'>Pairs</p> */}
                    <p className='mt-2 text-sm italic text-lighter'>Item 1</p>
                    <select className='mt-2 w-full p-1.5 text-sm bg-dark text-light rounded' value={selectedTerm1} onChange={(e)=>onTerm1Changed(e.target.value)}>
                        {Quiz.instance.termsNames.map((t,i)=><option key={i} className={`p-2`} value={i}>{t}</option>)}
                    </select>
                    {/* <p className='mt-2 text-sm italic'>Item 1 (Optional)</p>
                    <select className='mt-2 w-full p-1.5 text-sm bg-dark text-light rounded' value={selectedOptionalTerm1} onChange={(e)=>onOptionalTerm1Changed(e.target.value)}>
                        {["None",...Quiz.instance.termsNames].map((t,i)=><option key={i} className={`p-2`} value={i-1}>{t}</option>)}
                    </select> */}
                    <p className='mt-2 text-sm italic text-lighter'>TO Item 2</p>
                    <select className='mt-2 w-full p-1.5 text-sm bg-dark text-light rounded' value={selectedTerm2} onChange={(e)=>onTerm2Changed(e.target.value)}>
                        {Quiz.instance.termsNames.map((t,i)=><option key={i} className={`p-2`} value={i}>{t}</option>)}
                    </select>
                    <p className='mt-2 text-sm italic text-lighter'>Items Count</p>
                    <div className='w-full py-2 flex items-center gap-2'>
                        {[20,30,40].map((val,i)=><button className={`${maxItemsCount===val?'border text-primary':'border-0 text-lighter'} grow bg-dark border-primary py-2 rounded hover:opacity-70`} key={i} onClick={()=>setMaxItemsCount(val)}>{val}</button>)}
                    </div>
                </div>
                <div className='grow flex flex-col border border-dark mb-4 p-2'>
                    <p className='font-bolder text-primary mb-2'>Topics ({Quiz.instance.topics.length}) ({Quiz.instance.getTotalWordsCount()} words)</p>
                    <p className='text-light text-sm'>{selectedTopics.map((tIdx,i)=>`${Quiz.instance.topicsNames[tIdx]}`).join(", ")}</p>
                    <ul className='mt-2 w-full grow basis-0 overflow-y-auto'>
                        {Quiz.instance.topicsNames.map((t,i)=>
                            <li key={i} className={`${selectedTopics.includes(i)?'text-primary bg-light':'text-lighter bg-dark'} p-2 my-1 flex items-center justify-between rounded cursor-pointer hover:opacity-70`} onClick={()=>onSelectTopic(i)}>
                                <p className='text-sm'>{t} <span className={`${topicsScores[i]<0?'text-error':'text-info'}`}>({Quiz.instance.getTopicWordsCount(i)} words) | ({topicsScores[i]}/10)</span></p>
                                <button className='border border-darker text-lighter rounded text-sm px-2.5 py-0.5 hover:text-accent hover:border-accent' onClick={(e)=>onTopicCheck(e,i)}>check</button>
                            </li>
                        )}
                    </ul>
                </div>
                <button className='w-full mt-auto py-4 bg-gradient-to-r from-primary to-accent text-lighter rounded font-bold uppercase tracking-widest hover:opacity-70' onClick={onStart}>Start</button>
            </div>
        </div>
    )
}

export default HomeScreen