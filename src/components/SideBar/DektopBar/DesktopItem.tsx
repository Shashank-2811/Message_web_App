import { FC } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}
const DesktopItem: FC<DesktopItemProps> = ({
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
    <li onClick={handleClick}>
      <NavLink
        to={href}
        className={clsx(
          `
          group 
          flex 
          gap-x-3 
          rounded-md 
          p-3 
          text-sm 
          leading-6 
          font-semibold 
          hover:text-black 
          hover:bg-gray-100
          `,
          !active &&
            `
            text-gray-500 
        `,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </NavLink>
    </li>
  );
};

export default DesktopItem;
