import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { NavBar } from "@/components/navbar"
import { CustomTrigger } from "@/components/sidebar-trigger"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
   <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 items-center px-5 pt-5 bg-[#F6F8FA]">
          <CustomTrigger />
          <NavBar />
        </header>
        <main className="flex-1 bg-[#F6F8FA]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
	)
}

