"use client";

export const OPEN_CHAT_EVENT = "profile-chat:open";

/** Any button that opens the profile chat panel. The panel (ChatWidget)
 * listens for OPEN_CHAT_EVENT on window. */
export function ChatLauncher({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))}
    >
      {children}
    </button>
  );
}
