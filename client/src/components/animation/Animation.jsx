import { useRef,useMemo } from "react"
import { motion,useScroll,useSpring,useInView } from "framer-motion"

export const FadeUp = ({children,delay=0.2,className=""}) => {

    return(
        <>
            <motion.div
                className={`${className}`}
                initial={{opacity:0,y:40}}
                whileInView={{ opacity: 1,y: 0}}
                viewport={{ once: false,amount: 0.25 }}
                transition={{
                    duration: 1.5,
                    delay: delay,
                    ease: [0.16, 1 , 0.3, 1]
                }}
            >
                {children}
            </motion.div>
        </>
    )
}

export const ScrollBar = ({containerRef}) => {

    const { scrollYProgress } = useScroll({container: containerRef});
    const scaleX = useSpring(scrollYProgress, {stiffness: 100,damping: 30});

    return(
        <>
            <motion.div
                style={{scaleX,transformOrigin: "left"}}
                className="fixed left-0 top-0 z-50 h-1 w-full bg-blue-500"
            />
        </>
    )
}

export const PulseNode = ({ color = "#10b981", speed = 2.4, area, className2,rad=796 }) => {
  return (
    // Parent container acts as the exact coordinate anchor center point
    <div className={`absolute w-0 h-0 ${area || ""} ${className2}`}>
      
      {/* 3 expanding rings */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ 
            borderColor: color,
            top: 0,
            left: 0,
            // x and y handle smooth, sub-pixel centering without rendering glitch
            x: "-50%", 
            y: "-50%" 
          }}
          initial={{ width: 10, height: 10, opacity: 2 }}
          animate={{ width: rad, height: rad, opacity: 0 }}
          transition={{ duration: speed, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};


export const Pulse = ({className2}) => {
    return(
        <>
            <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`w-3 h-3 rounded-full ${className2}`}
            />
        </>
    )
}


export function WordFadeUp({
  text = "",
  delay = 0,
  stagger = 0.09,
  once = true,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });
 
  const words = text.split(" ");
 
  return (
    <div
      ref={ref}
      aria-label={text}
      className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.55,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}