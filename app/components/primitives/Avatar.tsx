import { AVATAR_SIZE, cx, type AvatarSize } from "./tokens";

interface AvatarProps {
  src?: string;
  alt?: string;
  /** Fallback initials shown when there is no image. */
  initials?: string;
  size?: AvatarSize;
  /** Online indicator (a status/completed dot). */
  online?: boolean;
  className?: string;
}

/**
 * Avatar primitive (DESIGN_SYSTEM_SPEC §3.1) — circular, size sm (24, size/avatar-sm) / lg
 * (32, size/avatar-lg), radius/circular (§5). Optional online indicator. Token-pure.
 */
export function Avatar({ src, alt = "", initials, size = "sm", online = false, className }: AvatarProps) {
  return (
    <span className={cx("relative inline-flex shrink-0", AVATAR_SIZE[size], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full rounded-circular object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-circular bg-surface-level-3 text-caption font-caption text-strong">
          {initials}
        </span>
      )}
      {online && (
        <span
          className="absolute bottom-0 right-0 h-2 w-2 rounded-circular bg-status-completed ring-2 ring-surface-level-0"
          aria-label="В сети"
        />
      )}
    </span>
  );
}
