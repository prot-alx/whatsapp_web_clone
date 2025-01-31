interface SidebarHeaderProps {
  onLogout: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onLogout }) => (
  <div className="p-4 border-b border-gray-200">
    <h1 className="text-xl font-semibold">Чаты</h1>
    <button
      onClick={onLogout}
      className="mt-2 text-sm text-red-600 hover:text-red-800"
    >
      Выйти
    </button>
  </div>
);
