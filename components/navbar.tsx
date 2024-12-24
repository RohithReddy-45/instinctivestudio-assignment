import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, HelpCircle, LogOut, MessageSquareMore, Search, Settings2, UserRoundPen } from 'lucide-react'
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from './ui/dropdown-menu';
import { signOutAction } from "@/app/actions/auth-actions";
import { createClient } from "@/utils/supabase/server";

interface NavBarProps {
  className?: string
}

export async function NavBar({ className }: NavBarProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userFallBack = user?.email?.split("@")[0];
  const initials = userFallBack ? userFallBack.split(" ").map(n => n[0]).join("").slice(0, 2) : "";

  return (
    <div className={cn("flex flex-1 h-16 justify-between items-center pr-4", className)}>
      <div className="relative flex-1 max-w-2xl mr-3">
        <Search className="absolute left-2 top-1/2 size-4 rounded-lg -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8 w-full border-none"
          placeholder="Search your course"
          type="search"
        />
      </div>
      <div className="flex items-center space-x-3">
        <MessageIcon className="sm:hidden" />
        <div className="sm:flex space-x-3 hidden">
          <button type="button" className="relative p-2 hover:bg-accent rounded-full">
            <HelpCircle size={24} className="text-muted-foreground" />
          </button>
          <MessageIcon />
          <button type="button" className="p-2 hover:bg-accent rounded-full">
            <Settings2 size={24} className="text-muted-foreground" />
          </button>
          <button type="button" className="relative p-2 hover:bg-accent rounded-full">
            <Bell size={24} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type='button' className="flex items-center space-x-2">
              <Avatar className="size-9 rounded-lg">
                <AvatarFallback className="p-3 bg-neutral-300 rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex text-md font-semibold">
                {user?.email?.split("@")[0]}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-40">
            <DropdownMenuItem>
              <UserRoundPen size={18} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden">
              <Settings2 size={18} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden">
              <HelpCircle size={18} className="mr-2" />
              Help
            </DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden">
              <Bell size={18} className="mr-2" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={signOutAction}>
                <button type="submit" className="flex items-center">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
};

function MessageIcon({ className }: { className?: string }) {
  return (
    <button type="button" className={cn("relative p-2 hover:bg-accent rounded-full", className)}>
      <MessageSquareMore size={24} className="text-muted-foreground" />
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
    </button>
  )
};
