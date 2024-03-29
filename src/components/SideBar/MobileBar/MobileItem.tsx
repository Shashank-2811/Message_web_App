import React, { FC } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

interface MobileItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}
const MobileItem: FC<MobileItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <li className="list-none flex-1" onClick={handleClick}>
      <NavLink
        // onClick={handleClick}
        to={href}
        className={clsx(
          `
          group 
          flex 
          gap-x-3 
          text-sm 
          leading-6 
          font-semibold 
          w-full 
          justify-center 
          p-4 
          hover:text-black 
          hover:bg-gray-100
          `,
          !active && `text-gray-500 `,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="sr-only">{label}</span>
      </NavLink>
    </li>
  );
};

export default MobileItem;
