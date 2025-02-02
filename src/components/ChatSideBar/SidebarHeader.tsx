import { LogOut, MessageSquarePlus } from "lucide-react";

export interface SidebarHeaderProps {
  onLogout: () => void;
  onNewChat: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onLogout,
  onNewChat,
}) => {
  console.log("SidebarHeader render");
  return (
    <div className="whatsapp-sidebar-header">
      <div className="whatsapp-user-info">
        <span className="font-bold">Чаты</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewChat}
          className="whatsapp-new-chat-btn"
          title="Новый чат"
        >
          <MessageSquarePlus className="w-6 h-6" />
        </button>
        <button
          onClick={onLogout}
          className="whatsapp-logout-btn"
          title="Выйти"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
