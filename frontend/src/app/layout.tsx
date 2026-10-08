import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/common/app-sidebar"
import ThemeToggle from "@/components/common/theme-toggle"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <main className="w-full px-7 py-4">
                <ThemeToggle/>
                {children}
            </main>
        </SidebarProvider>
    )
}