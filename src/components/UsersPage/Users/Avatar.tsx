import { FC } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
}
interface AvatarsProps {
  user?: User; 
}

const Avatars: FC<AvatarsProps> = ({ user }) => {

  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={user?.image ? user?.image: "placeholder.jpg"} />
        <AvatarFallback>PF</AvatarFallback>
      </Avatar>
      {/* {isActive ? (  */}
      <span
        className="
            absolute
            block
            rounded-full
            bg-green-500
            ring-2
            ring-white
            top-0
            right-0
            h-2
            w-2
            md:h-3
            md:w-3
          "
      />
      {/* ) : null} */}
    </div>
  );
};

export default Avatars;
