import React, { useContext } from 'react'
import AppBar from '../Comps/AppBar'
import Quiz, { ScreenType } from '../Objects/quiz'
import { appContext } from '../contexts/AppContext';
// import { QuizContextDef, quizContext } from '../Contexts/QuizContext';

function QuizResultScreen() {
    const {screen,setScreen}=useContext(appContext);

    function onRetryBtn(){
        Quiz.onRetry();
        // ctx.updateUI();
        setScreen(Quiz.curScreen);
    }

    function onBackBtn(){
        Quiz.setScreen(ScreenType.home);
        // ctx.updateUI();
        setScreen(Quiz.curScreen);
    }

    function renderBackBtn():React.ReactNode{
        return <button className='px-2 h-8 text-lighter hover:opacity-70 rounded border border-dark' onClick={onBackBtn}>&lt; Home</button>
    }
    function renderTitle():React.ReactNode{
        return <p className='text-lighter font-bolder'>Results</p>
    }
    return (
        <div className='h-screen mx-auto flex flex-col bg-darkest' style={{aspectRatio:"0.5"}}>
            <AppBar leading={renderBackBtn()} title={renderTitle()} />
            <div className='p-2 flex flex-col grow'>
                <div className='flex flex-col py-4 gap-4 grow items-center justify-evenly border-b border-dark'>
                    <div className='w-40 h-40 rounded-full border border-dark flex items-center justify-center text-center'>
                        <p className='text-5xl mr-2 text-primary'>{Quiz.getScore()}</p><p className='text-lg text-lighter'>{` / ${Quiz.maxItemsCount}`}</p>
                    </div>
                    <button className='rounded py-2 px-4 border border-dark text-lighter hover:opacity-70' onClick={onRetryBtn}>Retry</button>
                </div>
                <div className='flex flex-col gap-2 py-2 overflow-y-auto' style={{flexGrow:'2',flexBasis:0}}>
                    {Quiz.items.map((item,i)=><div key={i} className={`${Quiz.ansTracker[i]?'bg-info':'bg-error'} text-lighter px-2 py-2 rounded`}><p className='text-left'>{item.terms[Quiz.termName1Idx]}</p><p className='text-right'>{item.terms[Quiz.termName2Idx]}</p></div>)}
                </div>
            </div>
        </div>
    )
}

export default QuizResultScreen