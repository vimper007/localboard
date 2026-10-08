import { MoonStar, Sun } from 'lucide-react'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import useThemeToggle from '@/hooks/useThemeToggle'

const ThemeToggle = () => {
    const{ isDark, setIsDark} =useThemeToggle()

    return (
        <div className='flex items-center space-x-2 w-full justify-end'>
            <Label htmlFor="airplane-mode" className="gap-1"><Sun size={20} />Light</Label>
            <Switch id="airplane-mode" onCheckedChange={(value)=>setIsDark(value)} checked={isDark}/>
            <Label htmlFor="airplane-mode" className="gap-1"><MoonStar size={20} />Dark</Label>
        </div>
    )
}

export default ThemeToggle