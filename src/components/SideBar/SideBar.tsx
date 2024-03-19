import { ReactNode } from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../@/components/ui/command";
import DesktopSidebar from "./DektopBar/DesktopSidebar";
import MobileFooter from "./MobileBar/MobileFooter";

const SideBar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gray-300 lg:pl-16 absolute lg:w-[400px] w-full">
      <MobileFooter />
      <Command className="flex h-screen">
        <div className="flex justify-around">
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem className="text-base flex flex-col items-start">
                <DesktopSidebar />
                {children}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </Command>
    </div>
  );
};

export default SideBar;
