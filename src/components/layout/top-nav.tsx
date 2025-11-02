import React from "react";
import { IconButton, CustomButton } from "../ui/custom-button";
import { MdMenu } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { BsChatLeftText } from "react-icons/bs";
import { useUserQuery } from "../../services/queries";
import { navItems } from "../../constants/navigation";
import Logo from "../icons/logo";
import { getInitials } from "../../utils/helpers";

const TopNav: React.FC = () => {
  const { data: userData } = useUserQuery();
  const initials = getInitials(userData?.first_name, userData?.last_name);
  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "N/A";

  return (
    <nav className="fixed left-1/2 top-4 z-50 flex w-[min(97%,1408px)] -translate-x-1/2 items-center justify-between rounded-full border border-[#ffffff] bg-white px-6 py-[14px] shadow-[0_2px_4px_rgba(45,59,67,0.05),0_2px_6px_rgba(45,59,67,0.06)]">
      <Logo />
      <div className="flex items-center">
        {navItems.map(({ label, icon, isActive }) => (
          <CustomButton
            href="#"
            key={label}
            variant="navLink"
            isActive={isActive}
          >
            <span className="text-[16px]">{icon}</span>

            {label}
          </CustomButton>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <IconButton>
          <FaRegBell size={18} />
        </IconButton>
        <IconButton>
          <BsChatLeftText size={18} />
        </IconButton>
        <div className="flex items-center gap-3 rounded-full bg-[#D9D9D9] p-1.5">
          <div
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[14px] font-semibold text-white"
            title={fullName}
            aria-label={fullName}
            style={{
              background:
                "linear-gradient(138.98deg, #5C6670 2.33%, #131316 96.28%)",
            }}
          >
            {initials}
          </div>
          <IconButton>
            <MdMenu size={18} />
          </IconButton>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
