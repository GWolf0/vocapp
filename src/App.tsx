import { useContext, useEffect, useState } from 'react'
import Quiz, { ScreenType } from './Objects/quiz';
import HomeScreen from './Screens/HomeScreen';
import QuizPlayerScreen from './Screens/QuizPlayerScreen';
import QuizResultScreen from './Screens/QuizResultScreen';
import VocabScreen from './Screens/VocabScreen';
import ger_vocab_data from './assets/ger_vocab_data';
import jap_vocab_data from './assets/jap_vocab_data';
import { appContext } from './contexts/AppContext';

function App(){
  const {screen,setScreen}=useContext(appContext);

  useEffect(()=>{
    
  },[]);

  function renderScreen():React.ReactNode{
    return screen===ScreenType.home?(<HomeScreen />):screen===ScreenType.quiz?(<QuizPlayerScreen />):screen===ScreenType.vocab?(<VocabScreen topicIdx={Quiz.selectedTopicForVocab} />):<QuizResultScreen />;
  }

  return (
    <div className="w-screen h-screen bg-black">
      {renderScreen()}
    </div>
  )
}

export default App;
