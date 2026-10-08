import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./theme-context";

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(true)
    useEffect(() => {
        if(isDark){
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
      return () => {
      }
    }, [isDark])
    
    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    )
}