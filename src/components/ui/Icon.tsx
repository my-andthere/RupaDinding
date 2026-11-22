import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5h2.2l2.1 11.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 1.9-1.5L21 7H6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12.04 2.5a9.4 9.4 0 0 0-8 13.9L2.5 21.5l5.2-1.5a9.4 9.4 0 1 0 4.34-17.5Z" />
      <path d="M8.9 8.1c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 3.2 2.7c.3.1.5 0 .6-.1l.5-.6c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.4.4v.6c0 .3-.2.6-.4.8-.3.3-.9.6-1.6.6a7.8 7.8 0 0 1-6-3.4 8 8 0 0 1-1.7-3.9c0-.8.3-1.5.5-1.7Z" />
    </>
  ),
  phone: <path d="M4.5 3.5h3l1.6 4-2 1.4a12 12 0 0 0 6 6l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 2.5 5.7a2 2 0 0 1 2-2.2Z" />,
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  map: (
    <>
      <path d="M9 3.5 3.5 5.8v14.7L9 18.2l6 2.3 5.5-2.3V3.5L15 5.8Z" />
      <path d="M9 3.5v14.7M15 5.8v14.7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.2 2" />
    </>
  ),
  arrowRight: <path d="M4 12h15m-5.5-5.5L19.5 12l-6 5.5" />,
  arrowLeft: <path d="M20 12H5m5.5-5.5L4.5 12l6 5.5" />,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  shield: <path d="M12 3 4.5 6v6c0 4.5 3 7.8 7.5 9 4.5-1.2 7.5-4.5 7.5-9V6Z" />,
  sparkle: <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" />,
  calculator: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
      <path d="M7.5 6.5h9M8 11h2m4 0h2M8 15h2m4 0h2" />
    </>
  ),
  texture: (
    <>
      <path d="M4 5.5h16v13H4z" />
      <path d="M4 9.5h16M4 13.5h16M9 5.5v13M14 5.5v13" />
    </>
  ),
  area: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 10.5h17M10.5 3.5v17" />
    </>
  ),
  complexity: (
    <>
      <path d="M4 20V8.5L12 4l8 4.5V20" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  surface: (
    <>
      <path d="M3 16.5 9 10l4 4 3-3 5 5.5" />
      <path d="M3 20h18" />
    </>
  ),
  material: (
    <>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8Z" />
      <path d="M4 8l8 4.5L20 8M12 12.5V20" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  interior: (
    <>
      <path d="M3 20V9.5L12 4l9 5.5V20" />
      <path d="M8 20v-6h8v6" />
    </>
  ),
  exterior: (
    <>
      <path d="M3 20h18" />
      <path d="M5 20V10l7-5 7 5v10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  ceiling: (
    <>
      <path d="M3 6h18" />
      <path d="M6 6v4M12 6v4M18 6v4" />
      <path d="M4 20h16" />
    </>
  ),
  special: (
    <>
      <path d="m12 3 2.2 5.3L19.5 10l-5.3 2.2L12 17.5l-2.2-5.3L4.5 10l5.3-1.7Z" />
      <path d="M18 16.5 19 19l2.5 1-2.5 1-1 2.5-1-2.5L14.5 20l2.5-1Z" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l10-10-4-4L4 16Z" />
      <path d="m14 6 4 4" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 3.5 7v10L12 21l8.5-4V7Z" />
      <path d="m3.5 7 8.5 4 8.5-4M12 11v10" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 11.5V4.5h7l9.5 9.5-7 7Z" />
      <circle cx="7.5" cy="8.5" r="1.3" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19.5c0-3 2.7-5 6-5s6 2 6 5" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.8c2.1.7 3.5 2.4 3.5 4.7" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 8a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V8a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 10.5v3a1.5 1.5 0 0 0 1.5 1.5H6l8 4.5V6L6 10.5H4.5A1.5 1.5 0 0 0 3 12Z" />
      <path d="M18 9a4 4 0 0 1 0 6" />
    </>
  ),
  fileText: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="9.5" r="1.6" />
      <path d="m4 17 4.5-4.5 3.5 3.5 3-3L20 17" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M9 20V9" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M15 8.5 18.5 12 15 15.5M18 12H9" />
    </>
  ),
  trend: <path d="m3 16 5.5-5.5 3.5 3.5L21 5m0 0h-5m5 0v5" />,
  receipt: (
    <>
      <path d="M5 3.5h14v18l-2.3-1.6-2.4 1.6-2.3-1.6-2.3 1.6L7.3 20 5 21.5Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  bell: (
    <>
      <path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15Z" />
      <path d="M10 21h4" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" />
      <path d="M14 4c.6 2.4 2 3.8 4.5 4.2" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5Z" />
    </>
  ),
  facebook: (
    <>
      <path d="M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2.5H7.5V15H10v6h3.5v-6h2.5l.5-3.5H13.5V9.5A1 1 0 0 1 14.5 8.5Z" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 19c-.4-1.4 0-3 .3-4.3l.9-3.6" />
      <path d="M8.6 10.6c-.4-2 1-3.6 3.1-3.6 1.9 0 3.4 1.3 3.4 3.2 0 2.3-1.3 4-3 4-.9 0-1.6-.7-1.4-1.6" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V17M8 7.6v.1M12 17v-3.6c0-1.4.9-2.4 2.2-2.4s2.3 1 2.3 2.4V17" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.5v17M6 7l6-3.5L18 7" />
      <path d="M3 12h6l-3 6ZM15 12h6l-3 6Z" />
    </>
  ),
};

export type IconName = keyof typeof icons | string;

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const content = icons[name] ?? icons.sparkle;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
