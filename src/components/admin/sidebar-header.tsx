import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export function AdminSideHeader({
  sidebarHeader,
}: {
  sidebarHeader: {
    title: string;
    logo: React.ElementType;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <sidebarHeader.logo className="size-4" />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold uppercase font-serif">
              {sidebarHeader.title}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
