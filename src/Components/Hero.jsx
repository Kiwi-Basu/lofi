import { Play , Pause , RotateCcw, ChevronLast , ChevronRight , ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import {TIMER_MODES} from '../Data/Times'

const Hero = () => {
  const [running,setRunning] = useState(false)
  const [selectedMode,setSelectedMode] = useState("short")
  
  
  const getMode = () => {
    const mode = TIMER_MODES.find((item) => item.id === selectedMode)
    return mode ?.minutes ? mode.minutes * 60 : 0
  }
  
  const minutes = String(Math.floor(getMode/ 60)).padStart(2, "0");
  const secs = String(getMode % 60).padStart(2, "0");
  
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      getMode((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);
  
  return (
    <>
      <section id='hero'>
        <div className="relative min-h-screen bg-white flex justify-center items-center flex-col gap-5">
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src="./video1.mp4">

          </video>

          <div className="relative border-2 flex gap-3 p-2 rounded-2xl border-white/30 shadow-md shadow-white/20 backdrop-blur-md">
          {TIMER_MODES.map((mode) => (
            <p
              key={mode.id}
              onClick={() => {
                setSelectedMode(mode.id);

                if (mode.minutes) {
                  getMode(mode.minutes * 60);
                }
              }}
              className={`border px-3 py-2 rounded-2xl shadow  font-mono cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-md
                ${
                  selectedMode === mode.id
                    ? "border-black/30 backdrop-blur-lg text-black"
                    : "text-white border-white/10"
                }`}
            >
              {mode.label}
            </p>
          ))}
          </div>

          {/* Clock */}
          <div className="relative border-5 border-white/30 h-50 w-50 flex flex-col gap-1 items-center justify-center rounded-full">
            <p className="text-6xl text-white text-shadow-md">{minutes}:{secs}</p>
            <p className="text-white flex items-center justify-center gap-1">
              <span>․</span>
              {running ? "Running" : "Paused"}
            </p>
          </div>

          {/* Play pause */}
          <div className="relative flex gap-5 items-center">
            <div
              onClick={() => {
                getMode(5*60)
                setRunning(false)
              }}
             className="h-12 w-12 rounded-full border border-white shadow-sm shadow-white backdrop-blur-md cursor-pointer flex items-center justify-center text-white  transition-all duration-200 hover:backdrop-blur-xl">
              <RotateCcw className='' />
            </div>
            <div onClick={() => {setRunning(!running)}} className="h-20 w-20 rounded-full border border-white shadow-sm shadow-white backdrop-blur-md cursor-pointer flex items-center justify-center text-white  transition-all duration-200 hover:backdrop-blur-xl">
              {running ? <Pause /> : <Play />  }
            </div>
            <div className="h-12 w-12 rounded-full border border-white shadow-sm shadow-white backdrop-blur-md cursor-pointer flex items-center justify-center text-white  transition-all duration-200 hover:backdrop-blur-xl">
              <ChevronLast />
            </div>
          </div>

          {/* theme change */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10">

            {/* Left Arrow */}
            <button className="h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white cursor-pointer hover:backdrop:backdrop-blur-md">
              <ChevronLeft size={10} />
            </button>

            {/* Indicators */}
            <div className="flex gap-2">
              <div className="h-1 w-2 rounded-full bg-white/30"></div>
              <div className="h-1 w-6 rounded-full bg-white"></div> {/* Active */}
              <div className="h-1 w-2 rounded-full bg-white/30"></div>
              <div className="h-1 w-2 rounded-full bg-white/30"></div>
              <div className="h-1 w-2 rounded-full bg-white/30"></div>
            </div>

            {/* Right Arrow */}
            <button className="h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white cursor-pointer hover:backdrop:backdrop-blur-md">
              <ChevronRight size={10} />
            </button>

            <div className='flex items-center text-white '>
              <div className='border h-3 border-white/15'></div>
            </div>
            
            <p className='text-sm text-white/20 font-mono border-2 rounded-2xl px-2 border-white/30'>Change vibe</p>
            

          </div>
            

        </div>
      </section>
    </>
  )
}

export default Hero