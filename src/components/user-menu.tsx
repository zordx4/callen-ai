// Top-right user avatar dropdown.

"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, User as UserIcon, CreditCard, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { currentUser as fallbackUser } from "@/lib/mock-data";

export function UserMenu() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const userFromStore = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  if (!hydrated) {
    return <Skeleton className="size-9 rounded-full" />;
  }
  const user = userFromStore ?? fallbackUser;
  const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  function handleLogout() {
    logout();
    toast.success("Signed out");
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="size-9 rounded-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring/40 hover:opacity-90 transition-opacity"
        aria-label="User menu"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-neutral-950 text-white text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-2.5 pb-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate font-normal">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <UserIcon className="size-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <Settings className="size-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <CreditCard className="size-4" /> Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer">
          <HelpCircle className="size-4" /> Help & docs
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer" variant="destructive">
          <LogOut className="size-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
