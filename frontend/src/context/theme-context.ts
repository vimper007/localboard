import { createContext } from "react";

type ThemeContextType = {
    isDark: boolean;
    setIsDark: (val: boolean) => void
}
export const ThemeContext = createContext<null | ThemeContextType>(null);