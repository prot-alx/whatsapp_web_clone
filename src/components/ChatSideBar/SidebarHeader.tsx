import { LogOut, MessageSquarePlus } from "lucide-react";

export interface SidebarHeaderProps {
  onLogout: () => void;
  onNewChat: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onLogout,
  onNewChat,
}) => {
  return (
    <div className="whatsapp-sidebar-header">
      <div className="whatsapp-user-info">
        <div className="whatsapp-sidebar-avatar">
          <span className="text-lg font-medium">A</span>
        </div>
        <span className="font-medium">WhatsApp</span>
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
