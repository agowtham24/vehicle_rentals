import { Handshake, Bike, LogOut, ListCheck } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function AppSidebar() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role") as string;

  const items =
    role === "TENANT"
      ? [
          {
            title: "Assigned Vehicles",
            url: "/app/rentals",
            icon: ListCheck,
          },
        ]
      : [
          {
            title: "Manage Bussiness Accounts",
            url: "/app/bussiness",
            icon: Handshake,
          },
          {
            title: "vehicles",
            url: "/app/vehicles",
            icon: Bike,
          },
        ];
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <p className="text-xl pl-6 pb-6 pt-5 font-medium group flex">
              OPTI
              <span className="block text-primary group-hover:opacity-45">
                M
              </span>
              OTION
            </p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-evenly">
          <ModeToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/login");
                  }}
                >
                  <LogOut size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export default AppSidebar;
