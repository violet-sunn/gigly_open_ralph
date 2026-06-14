import type { ReactNode } from "react";
import { ICON, cx } from "./tokens";
import { Icon } from "./Icon";
import { Avatar } from "./Avatar";

interface RatingProps {
  /** Star rating, 0–5. */
  value: number;
  count?: number;
  verified?: boolean;
  online?: boolean;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarInitials?: string;
  /** Experience-tag label (the folded-in ExperienceTag, e.g. "Senior Frontend Engineer"). */
  experience?: ReactNode;
  className?: string;
}

const STAR_COUNT = 5;

/**
 * Rating primitive (DESIGN_SYSTEM_SPEC §3.1) — avatar + verified + ★×5 + count + experience tag,
 * with an online variant. Uses the exported star/verified assets (F4); ExperienceTag is folded in
 * (labelled pill, radius/pill). Empty stars dim via opacity/disabled. Token-pure.
 */
export function Rating({
  value,
  count,
  verified = false,
  online = false,
  avatarSrc,
  avatarAlt,
  avatarInitials,
  experience,
  className,
}: RatingProps) {
  const filled = Math.round(Math.max(0, Math.min(STAR_COUNT, value)));
  return (
    <div className={cx("inline-flex items-center gap-2", className)}>
      <Avatar src={avatarSrc} alt={avatarAlt} initials={avatarInitials} size="sm" online={online} />
      {verified && <Icon src={ICON.verified} alt="Подтверждён" />}
      <span className="inline-flex items-center gap-1" aria-label={`Рейтинг ${filled} из ${STAR_COUNT}`}>
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <Icon key={i} src={ICON.star} className={cx("h-4 w-4", i >= filled && "opacity-disabled")} />
        ))}
      </span>
      {count != null && <span className="text-caption font-caption text-muted">({count})</span>}
      {experience != null && (
        <span className="inline-flex items-center rounded-pill border border-border px-3 py-1 text-label font-label text-strong">
          {experience}
        </span>
      )}
    </div>
  );
}
