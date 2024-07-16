import React, { useContext, useEffect, useMemo, useState } from 'react'
// import { QuizContextDef, quizContext } from '../Contexts/QuizContext';
import AppBar from '../Comps/AppBar';
import Quiz, { QuizItem, ScreenType } from '../Objects/quiz';
import { appContext } from '../contexts/AppContext';

interface QuizPlayerScreenPropsDef{

}
function QuizPlayerScreen({}:QuizPlayerScreenPropsDef){
    const {screen,setScreen}=useContext(appContext);

    const [curItem,setCurItem]=useState<QuizItem>(Quiz.curItem);
    const [userAns,setUserAns]=useState(-1);
    const [correctAns,setCorrectAns]=useState(-1);
    const [wrongAns,setWrongAns]=useState(-1);

    const qst=useMemo(()=>Quiz.getQst(),[Quiz.curItem]);
    const subQst=useMemo(()=>Quiz.getOptionalQst(),[Quiz.curItem]);
    const choices=useMemo(()=>Quiz.choices,[Quiz.curItem]);
    const answer=useMemo(()=>Quiz.getCorrectAnswer(),[Quiz.curItem]);
    // const correctAnsIdx=useMemo(()=>Quiz.choices.indexOf(answer),[Quiz.curItem]);

    useEffect(()=>{

    },[]);

    useEffect(()=>{
        if(!hasAnswered())return;
        const userAnsStr=Quiz.choices[userAns];
        const isCorrect:boolean=Quiz.checkAnswer(userAnsStr);//console.log("isCorrect",isCorrect,"userAnsStr",userAnsStr,"ans",Quiz.getCorrectAnswer())
        if(!isCorrect)setWrongAns(userAns);
        setCorrectAns(Quiz.choices.indexOf(answer));
        setTimeout(()=>{
            Quiz.onAnswer(userAnsStr);
            if(Quiz.isDone){
                Quiz.setScreen(ScreenType.res);
                // ctx.updateUI();
                setScreen(Quiz.curScreen);
            }else{
                setCurItem(Quiz.curItem);
                setUserAns(-1);
                setCorrectAns(-1);
                setWrongAns(-1);
            }
        },3000);
    },[userAns]);
    function onAnsBtn(idx:number){
        if(hasAnswered())return;
        setUserAns(idx);
    }
    function hasAnswered():boolean{return userAns>-1;}

    function onBackBtn(){
        if(confirm("Back To Home Screen?")){
            Quiz.setScreen(ScreenType.home);
            // ctx.updateUI();
            setScreen(Quiz.curScreen);
        }
    }

    function renderBackBtn():React.ReactNode{
        return <button className='px-2 h-8 text-lighter hover:opacity-70 rounded border border-dark' onClick={onBackBtn}>&lt; Home</button>
    }
    function renderTitle():React.ReactNode{
        return <p className='text-lighter font-bolder'>{`${(Quiz.currentIdx+1)} / ${Quiz.maxItemsCount}`}</p>
    }
    return (
        <div className='h-screen mx-auto flex flex-col bg-darkest' style={{aspectRatio:"0.5"}}>
            <AppBar leading={renderBackBtn()} title={renderTitle()} />
            <div className='p-2 flex flex-col grow gap-2'>
                <div className='flex flex-col grow items-center justify-center'><p className='text-5xl font-bold text-center'>{qst}</p><br/>{subQst!=""&&<p className='text-2xl'>({subQst})</p>}</div>
                <div className='grow'>
                    {choices.map((c,i)=><button key={i} className={`${i===correctAns?'bg-info':i===wrongAns?'bg-error':'bg-dark'} block w-full p-2 text-lighter rounded my-2 hover:opacity-70`} onClick={()=>onAnsBtn(i)}>{c}</button>)}
                </div>
            </div>
        </div>
    )
}

export default QuizPlayerScreen;