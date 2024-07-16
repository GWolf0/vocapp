import React from 'react'

interface AppBarPropsDef{leading?:React.ReactNode,title:React.ReactNode,trailing?:React.ReactNode}
function AppBar({leading,title,trailing}:AppBarPropsDef){


    return (
        <header className='h-12 w-full flex items-center justify-between px-2 border-b border-dark'>
            <div className='flex items-center'>{leading}{leading!=null&&<span className='mr-4'></span>}{title}</div>
            <div>{trailing}</div>
        </header>
    )
}

export default AppBar;