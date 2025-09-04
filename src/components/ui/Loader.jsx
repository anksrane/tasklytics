import React from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loader({
  color="",
  height=""
}) {
  return (
    <div className={`flex items-center justify-center ${height? height : 'h-screen'}`}>
      <AiOutlineLoading3Quarters className={`animate-spin text-4xl ${color? '': 'text-white'}`} />
    </div>
  )
}

export default Loader
