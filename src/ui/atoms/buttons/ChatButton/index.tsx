"use client";

import "./styles.css";
import ArrowIcon from "@/atoms/icons/ArrowIcon";
import useChatPanel from "@/state/slices/chatPanel/hooks";

interface ChatIconProps {
  isOpen: boolean;
}

const ChatIcon = ({ isOpen }: ChatIconProps) => (
  <>{isOpen ? "Close Chat" : "Consulting"}</>
);

let preloaded = false;
const preloadChatOverlay = () => {
  if (!preloaded) {
    preloaded = true;
    import("@/organisms/Chat/ChatOverlay");
  }
};

interface ChatButtonProps {
  showArrow?: boolean;
  arrowSize?: "default" | "large";
}

const ChatButton = ({
  showArrow = false,
  arrowSize = "default",
}: ChatButtonProps) => {
  const { isOpen, toggleChatPanel, setChatContext, clearChatContext } =
    useChatPanel();

  const ariaLabel = isOpen ? "Close chat panel" : "Open chat panel";

  const handleToggle = () => {
    if (isOpen) {
      clearChatContext();
    } else {
      setChatContext({ source: "footer" });
    }

    toggleChatPanel();
  };

  const arrowSizeClass =
    showArrow && arrowSize === "large" ? "chat__button--arrow-large" : "";

  return (
    <button
      className={`chat__button focus-ring ${
        isOpen ? "chat__button--active" : ""
      } ${arrowSizeClass}`}
      id="chatButtonId"
      onClick={handleToggle}
      onMouseEnter={preloadChatOverlay}
      onFocus={preloadChatOverlay}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="chatPanelFloating"
    >
      <span className="chat__button-label">
        <ChatIcon isOpen={isOpen} />
      </span>
      {showArrow ? (
        <ArrowIcon className="chat__button-icon" aria-hidden="true" />
      ) : null}
    </button>
  );
};

export default ChatButton;
