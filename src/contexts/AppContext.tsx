import React, { createContext, useEffect, useState } from "react";
import Quiz, { LangsTypes, ScreenType } from "../Objects/quiz";
import ger_vocab_data from "../assets/ger_vocab_data";
import jap_vocab_data from "../assets/jap_vocab_data";

interface AppContextDef{
    lang:LangsTypes,
    setLang:React.Dispatch<React.SetStateAction<LangsTypes>>,
    screen:ScreenType,
    setScreen:React.Dispatch<React.SetStateAction<ScreenType>>,
}

const appDefaultContextValue:AppContextDef={
    lang:"ger",
    setLang:()=>"ger",
    screen:ScreenType.home,
    setScreen:()=>ScreenType.home,
}
const appContext:React.Context<AppContextDef>=createContext(appDefaultContextValue);

function AppContextProvider({children}:{children:React.ReactNode}){
    const [initialized,setInitialized]=useState<boolean>(false);
    const [lang,setLang]=useState<LangsTypes>(Quiz.getSavedLang());
    const [screen,setScreen]=useState<ScreenType>(ScreenType.home);

    useEffect(()=>{
        Quiz.init({ger:ger_vocab_data,jap:jap_vocab_data});
        setInitialized(true);
    },[]);

    return (
        <appContext.Provider value={{screen:screen,setScreen:setScreen, lang,setLang}}>
            {initialized?children:<p>Loading..</p>}
        </appContext.Provider>
    )

} 

export {appContext, AppContextProvider};
