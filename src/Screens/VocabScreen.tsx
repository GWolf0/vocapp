import React, { useContext, useMemo } from 'react'
import AppBar from '../Comps/AppBar'
import Quiz, { QuizItem, ScreenType } from '../Objects/quiz'
import { appContext } from '../contexts/AppContext';
// import { QuizContextDef, quizContext } from '../Contexts/QuizContext';

interface VocabScreenPropsDef{topicIdx:number}
function VocabScreen({topicIdx}:VocabScreenPropsDef){
    const {screen,setScreen}=useContext(appContext);

    const topicName:string=useMemo(()=>Quiz.instance.topicsNames[topicIdx],[topicIdx]);
    const topic:Array<QuizItem>=useMemo(()=>Quiz.instance.topics[topicIdx],[topicIdx]);

    function onBackBtn(){
        Quiz.setScreen(ScreenType.home);
        // ctx.updateUI();
        setScreen(Quiz.curScreen);
    }

    function renderBackBtn():React.ReactNode{
        return <button className='px-2 h-8 text-lighter hover:opacity-70 rounded border border-dark' onClick={onBackBtn}>&lt; Home</button>
    }
    function renderTitle():React.ReactNode{
        return <p className='text-lighter font-bolder'>{`${topicName} (${topic.length})`}</p>
    }
    return (
        <div className='h-screen mx-auto flex flex-col bg-darkest' style={{aspectRatio:"0.5"}}>
            <AppBar leading={renderBackBtn()} title={renderTitle()} />
            <div className='p-2 flex flex-col grow'>
                <div className='flex flex-col gap-2 py-2 grow overflow-y-auto' style={{flexBasis:0}}>
                    {topic.map((item,i)=><div key={i} className={`flex items-center bg-dark text-lighter px-2 py-4 rounded`}><p className='text-xl'>{(i+1)+"- "+item.terms[Quiz.termName1Idx]} <br/><span>{Quiz.getOptionalItem(topicIdx,i)}</span></p><p className='ml-auto'>{item.terms[Quiz.termName2Idx]}</p><p className={`${QuizItem.score(item)<0?'text-error':'text-info'}`}>{` (${QuizItem.score(item)})`}</p></div>)}
                </div>
            </div>
        </div>
    )
}

export default VocabScreen