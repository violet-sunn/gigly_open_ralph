/**
 * ui-primitives barrel — the primitive vocabulary (DESIGN_SYSTEM_SPEC §3.1).
 * 16 typed, variant-driven, token-pure primitives composed by domain-blocks (#7) and screens (Phase 2).
 */
export { Button } from "./Button";
export { Input } from "./Input";
export { PasswordInput } from "./PasswordInput";
export { SearchInput } from "./SearchInput";
export { Select, type SelectOption } from "./Select";
export { Radio } from "./Radio";
export { Filter } from "./Filter";
export { Tabs, type TabItem } from "./Tabs";
export { Toggle } from "./Toggle";
export { Tag } from "./Tag";
export { CategoryTag } from "./CategoryTag";
export { StatusBadge } from "./StatusBadge";
export { Avatar } from "./Avatar";
export { Rating } from "./Rating";
export { ViewToggle } from "./ViewToggle";
export { ProgressBar } from "./ProgressBar";
export { Icon } from "./Icon";

export {
  ICON,
  type ButtonVariant,
  type ControlSize,
  type InputState,
  type Status,
  type Category,
  type AvatarSize,
  type View,
  type IconName,
} from "./tokens";
