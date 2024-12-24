
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "./logo"
import { items } from "@/lib/sidebar"

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent className="py-7 bg-white">
				<SidebarGroup>
					<SidebarGroupLabel className="mb-10">
						<Logo className="w-24" />
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild className="p-3 mb-2">
										<a href={item.url} className="p-3">
											<item.icon className="size-6" />
											<span className="font-bold">{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
