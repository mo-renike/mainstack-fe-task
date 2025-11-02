import { MdRefresh, MdLayers, MdDescription } from "react-icons/md";

export const FloatingToolbar: React.FC = () => (
  <aside className="pointer-events-none fixed left-6 top-74 hidden flex-col items-center gap-3 rounded-full bg-white py-3 shadow-[0_2px_4px_rgba(45,59,67,0.05),0_2px_6px_rgba(45,59,67,0.06)] lg:flex">
    <ToolbarButton icon={<MdRefresh size={18} />} />
    <ToolbarButton icon={<MdLayers size={18} />} />
    <ToolbarButton icon={<MdDescription size={18} />} />
  </aside>
);

const ToolbarButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full text-[#56616B] transition hover:bg-[#F5F7FA]">
    {icon}
  </div>
);
