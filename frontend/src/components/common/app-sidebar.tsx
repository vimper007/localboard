import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bug, Dice1 } from "lucide-react"
import logoLight from '@/assets/logoipsum-custom-logo-light.svg'
import logoDark from '@/assets/logoipsum-custom-logo-dark.svg'
import {Link} from 'react-router'
import useThemeToggle from "@/hooks/useThemeToggle"

const menuItems = [
    {
        name: 'Issues',
        url: '/issues',
        index: 1,
        icon: <Bug />
    },
    {
        name: 'Board',
        url: '/board',
        index: 2,
        icon: <Dice1 />
    },
]
export function AppSidebar() {
    const {isDark} = useThemeToggle()
    return (
        <Sidebar>
            <SidebarHeader className="flex items-center p-2">

                <img src={isDark ? logoLight : logoDark} alt="LocalBoard Logo" className="h-7" />
                <hr />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.index}>
                                    <Link to={item.url}>
                                    <SidebarMenuButton>
                                        {item.icon}
                                        {item.name}
                                    </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}