import React from 'react'

const Container = ({height, width, children} : { height:string, width: string,children: React.ReactNode}) => {
  return (
    // <div className='w-80 h-96 rounded-md bg-[#d6e2f916]  border-[#d9defc33] shadow-lg  backdrop-blur-sm  backdrop-brightness-105 z-30 bg-opacity-30 p-5 border '>
      <div className={`${height} ${width} rounded-md bg-[#d6e2f916] border border-[#d9defc33] shadow-lg  backdrop-blur-sm backdrop-brightness-105 z-30 bg-opacity-30 p-5 relative`}>
      {children}
      
    </div>
  )
}

export default Container
