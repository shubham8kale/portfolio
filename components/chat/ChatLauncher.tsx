"use client";

export const OPEN_CHAT_EVENT = "profile-chat:open";
/** The hero's chat button; the floating launcher hides while it is on screen. */
export const HERO_CHAT_CTA_ID = "hero-chat-cta";

/** Any button that opens the profile chat panel. The panel (ChatWidget)
 * listens for OPEN_CHAT_EVENT on window. */
export function ChatLauncher({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <button
      type="button"
      id={id}
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))}
    >
      {children}
    </button>
  );
}
