import { Play , Pause , RotateCcw, ChevronLast , ChevronRight , ChevronLeft , Maximize2 ,Minimize2 } from 'lucide-react'
import { useEffect , useState , useRef } from 'react'
import {timerModes} from '../Data/Times'
import {theme} from '../Data/Theme'

const Hero = () => {
  const [running,setRunning] = useState(false)
  const [selectMode,setSelectMode] = useState("short")
  const [seconds,setSeconds] = useState(5*60)
  const [nextTheme,setNextTheme] = useState(3)
  const [fullScreen,setFullScreen] = useState(false)
  
  const minutes = String(Math.floor(seconds/ 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  
  const sectionref = useRef(null)
  const audioref = useRef(null)
  const alarmref = useRef(null)
 
  const getMode = (mode) => {
    setSelectMode(mode.id)
    setSeconds(mode.minutes*60)
    setRunning(false)
  }

  const currentMode  = timerModes.find(
    (mode) => mode.id === selectMode
  )
  const totalSeconds = currentMode.minutes*60
  const progress = seconds /totalSeconds
  const radius = 95
  const circumference = 2 * Math.PI * radius
  const strokeDash = circumference - progress * circumference

  const toggleScreen = () => {
    if (!document.fullscreenElement) {
      sectionref.current?.requestFullscreen()
      setFullScreen(true)
    } else {
        document.exitFullscreen()
        setFullScreen(false)
    }
  }

  useEffect(()=>{
    if(!running) return;
    const interval = setInterval(() =>{
      setSeconds((prev) => {
        if (prev <= 1) {
          setRunning(false)
          if (alarmref.current) {
            alarmref.current.currentTime = 0
            alarmref.current.play()

            setTimeout(()=> {
              alarmref.current.pause()
              alarmref.current.currentTime = 0;
            },5000)
          }
          return 0
        }
        return prev - 1
      })
    },1000)
    return () => clearInterval(interval)
  },[running])

  useEffect(() => {
    if(!audioref.current) return;
    if(running) {
      audioref.current.play()
    } else {
        audioref.current.pause()
    }
  } , [running])
  
  
  return (
    <>
      <section id='hero'>
        <div ref = {sectionref} className="relative min-h-screen gradient flex justify-center items-center flex-col gap-10">
          <video 
            autoPlay
            loop
            preload='auto'
            muted
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
            src= {theme[nextTheme].link}
          />

          <div className="relative border-2 flex gap-3 p-2 rounded-2xl border-white/30 shadow-md shadow-white/20 backdrop-blur-md">
          {timerModes.map((mode) => (
            <p
              key={mode.id}
              onClick={() => {
                getMode(mode)
              }}
              className={`border px-3 py-2 rounded-2xl shadow  font-mono cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-md
                ${
                  selectMode === mode.id
                    ? "border-black/30 backdrop-blur-lg text-black"
                    : "text-white border-white/10"
                }`}
            >
              {mode.label}
            </p>
          ))}
          </div>

          {/* Clock */}
          <div className="relative h-56 w-56 flex items-center justify-center">
            <svg
              className="absolute inset-0 -rotate-90"
              width="224"
              height="224"
            >
              {/* Background */}
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />

              {/* Progress */}
              <circle
                cx="112"
                cy="112"
                r={radius}
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                style={{
                  transition: "stroke-dashoffset 1s linear",
                }}
              />
            </svg>

            <div className="flex flex-col items-center">
              <p className="text-6xl text-white">
                {minutes}:{secs}
              </p>

              <p className="text-white flex items-center gap-1">
                {running ? "Running" : "Paused"}
              </p>
            </div>
          </div>

          {/* Play pause */}
          <div className="relative flex gap-5 items-center">
            <div
              onClick={() => {
                const currentMode = timerModes.find((item)=>
                item.id === selectMode)
                getMode(currentMode)
              }}
             className="h-12 w-12 rounded-full border border-white shadow-sm shadow-white backdrop-blur-md cursor-pointer flex items-center justify-center text-white  transition-all duration-200 hover:backdrop-blur-xl ">
              <RotateCcw/>
            </div>
            <div onClick={() => {setRunning(!running)}} className="h-20 w-20 rounded-full border border-white shadow-sm shadow-white backdrop-blur-md cursor-pointer flex items-center justify-center text-white  transition-all duration-200 hover:backdrop-blur-xl hover:scale-105">
              {running ? <Pause /> : <Play />  }
            </div>
            <div 
              onClick={() => {
                const currentIndex = timerModes.findIndex(
                  (mode) => mode.id === selectMode
                )
                const nextIndex = (currentIndex + 1) % timerModes.length
                getMode(timerModes[nextIndex])
              }}
              className="h-12 w-12 rounded-full border border-white shadow-sm shadow-white backdrop-blur-md cursor-pointer flex items-center justify-center text-white  transition-all duration-200 hover:backdrop-blur-xl">
              <ChevronLast />
            </div>
          </div>

          {/* theme change */}
          <div className='relative flex items-center gap-2'>
            <div className="flex items-center gap-3 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10">

              {/* Left Arrow */}
              <button 
                onClick={()=> {
                  setNextTheme((prev)=> (prev - 1 + theme.length) % theme.length )
                }}
                className="h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white cursor-pointer hover:backdrop:backdrop-blur-md">
                <ChevronLeft size={10} />
              </button>

              {/* Indicators */}
              <div className="flex gap-2">
                {theme.map((_,i) => {
                  return (
                    <div key={i}
                      className = {`h-1 rounded-full transition-all duration-300 ${
                        i == nextTheme ? "w-6 bg-white/40" : "w-2 bg-white"
                      }`}>
                    </div>
                  )
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={()=> {
                  setNextTheme((prev) => (prev + 1) % theme.length )
                }} 
                className="h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white cursor-pointer hover:backdrop:backdrop-blur-md">
                <ChevronRight size={10} />
              </button>

              <div className='flex items-center text-white '>
                <div className='border h-3 border-white/15'></div>
              </div>
              
              <p className='text-sm text-white/20 font-mono border-2 rounded-2xl px-2 border-white/30'>Change vibe</p>

            </div>
            <div onClick={toggleScreen} className='border rounded-2xl p-2 border-white/30 text-white cursor-pointer backdrop-blur-2xl hover:backdrop-blur-md transition-all duration-300'>
              {fullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} /> } 
            </div>

          </div>
          
            <audio 
              ref={audioref}
              src="./music1.mp3"
              loop
            />
            <audio 
              ref={alarmref}
              src="./alaram.mp3"
            />
        </div>
      </section>
    </>
  )
}

export default Hero