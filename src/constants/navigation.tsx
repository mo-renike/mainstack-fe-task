import {
  MdOutlineInsertChartOutlined,
  MdOutlinePeopleAlt,
  MdOutlineWidgets,
} from "react-icons/md";
import { GoHome } from "react-icons/go";
import { FaMoneyBills } from "react-icons/fa6";
type NavItem = {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Home", icon: <GoHome size={18} /> },
  { label: "Analytics", icon: <MdOutlineInsertChartOutlined size={18} /> },
  {
    label: "Revenue",
    icon: <FaMoneyBills size={18} />,
    isActive: true,
  },
  { label: "CRM", icon: <MdOutlinePeopleAlt size={18} /> },
  { label: "Apps", icon: <MdOutlineWidgets size={18} /> },
];
