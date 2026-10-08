import { ThemeContext } from "@/context/theme-context"
import { useContext } from "react"

const useThemeToggle = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useThemeToggle cannot be used outside the ThemeProvider')
    const { isDark, setIsDark } = context
    return {
        isDark, setIsDark
    }

}

export default useThemeToggle