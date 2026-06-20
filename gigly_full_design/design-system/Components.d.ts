// Components.d.ts — the complete catalog of the 62 component(s) in
// Components.bundle.js. READ THIS FILE BEFORE USING THE BUNDLE: component
// names are derived from Figma layer names (sanitized to PascalCase,
// deduplicated) and may differ from what the design calls them — the
// "figma layer" comment above each interface maps them back.
// After the bundle <script> loads, every component is a window global
// (e.g. window.AttentionCard) and usable directly in JSX.
import * as React from 'react';

// figma layer: "attention card" (node 3367:3916)
export interface AttentionCardProps {
  className?: string;
  style?: React.CSSProperties;
  property?: "смена статуса" | "новое сообщение" | "приближается дедлайн" | "заявка принята" | "заявка отклонена" | "получена оплата" | "нет ответа" | "нет заявок" | "ждёт проверки";
  uSER?: "specialist" | "company";
  /** Text content; defaults to "👀". */
  text1?: string;
  /** Text content; defaults to "Новый статус". */
  text2?: string;
  /** Text content; defaults to "1 нед.". */
  text3?: string;
  /** Text content; defaults to "Остался 1 день". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Bag" (node 2728:540)
export interface BagProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "bio" (node 2931:2365)
export interface BioProps {
  className?: string;
  style?: React.CSSProperties;
  prop?: boolean;
  verificationMark?: boolean;
  sizeFor?: "gig" | "acc bio";
  profile?: boolean;
  stars?: string;
  info?: boolean;
  uSER?: "company" | "specialist";
  text?: string;
  text2?: boolean;
}

// figma layer: "bio/message/COMPANY" (node 2931:2366)
export interface BioMessageCOMPANYProps {
  className?: string;
  style?: React.CSSProperties;
  prop?: boolean;
  verificationMark?: boolean;
  profile?: boolean;
  stars?: string;
  info?: boolean;
  text?: string;
  text2?: boolean;
}

// figma layer: "Button" (node 3149:3432)
export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: boolean;
  property?: "primary" | "secondary" | "tetriary";
  iconType?: React.ReactNode;
  state?: "default" | "hover" | "disabled";
  txt?: boolean;
  text?: string;
}

// figma layer: "Button Default" (node 2619:280)
export interface ButtonDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "hover" | "active";
  type?: "default" | "icon" | "icon end";
  /** Text content; defaults to "ОТПРАВИТЬ ОТКЛИК". */
  text1?: string;
}

// figma layer: "button_icon" (node 3828:11151)
export interface ButtonIconProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  state?: "default" | "hover" | "active";
  bG?: boolean;
  counter?: boolean;
  /** Text content; defaults to "5". */
  text1?: string;
}

// figma layer: "Category" (node 2868:3724)
export interface CategoryProps {
  className?: string;
  style?: React.CSSProperties;
  color?: "blue" | "rose" | "green" | "teal" | "orange";
  size?: "s";
  /** Text content; defaults to "Маркетинг". */
  text1?: string;
}

// figma layer: "Category/Blue/XS" (node 2868:3725)
export interface CategoryBlueXSProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Маркетинг". */
  text1?: string;
}

// figma layer: "check field" (node 3138:3148)
export interface CheckFieldProps {
  className?: string;
  style?: React.CSSProperties;
  list1Txt?: string;
  list2?: boolean;
  list2Txt?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}

// figma layer: "Специальность" (node 3435:5794)
export interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "s" | "xs";
  /** Text content; defaults to "[Senior Frontend Engineer]". */
  text1?: string;
}

// figma layer: "Component 4" (node 2346:6)
export interface Component4Props {
  className?: string;
  style?: React.CSSProperties;
  text?: string;
  variant?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14";
  hover?: boolean;
}

// figma layer: "Component 5" (node 2346:69)
export interface Component5Props {
  className?: string;
  style?: React.CSSProperties;
  text?: string;
  variant?: "1";
  hover?: boolean;
}

// figma layer: "counter" (node 3179:3997)
export interface CounterProps {
  className?: string;
  style?: React.CSSProperties;
  points?: string;
}

// figma layer: "dropdown" (node 3934:6211)
export interface DropdownProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "default";
}

// figma layer: "dropdown/item" (node 3907:6156)
export interface DropdownItemProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "hover" | "disabled";
  selected?: boolean;
  /** Text content; defaults to "Фильтр". */
  text1?: string;
}

// figma layer: "file" (node 3600:5262)
export interface FileProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  /** Text content; defaults to "ТЗ.doc". */
  text1?: string;
  /** Text content; defaults to "15 MB". */
  text2?: string;
}

// figma layer: "Filter" (node 2826:2529)
export interface FilterProps {
  className?: string;
  style?: React.CSSProperties;
  iconLType?: React.ReactNode;
  state?: "default" | "hover" | "disabled";
  text?: boolean;
  iconRType?: React.ReactNode;
  expand?: boolean;
  iconR?: boolean;
  iconL?: boolean;
  selected?: boolean;
  /** Text content; defaults to "Фильтр". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}

// figma layer: "Gig" (node 2802:3367)
export interface GigProps {
  className?: string;
  style?: React.CSSProperties;
  timeline?: boolean;
  postingDate?: boolean;
  tags?: boolean;
  description?: boolean;
  status?: "открыт" | "на рассмотрении" | "в работе" | "на проверке" | "звершен" | "отклонен";
  bottomInfo?: boolean;
  loadline3?: string;
  /** Text content; defaults to "2 мин". */
  text1?: string;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text2?: string;
  /** Text content; defaults to "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.". */
  text3?: string;
  /** Text content; defaults to "25.08.2025". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
}

// figma layer: "Gig/На рассмотрении/full" (node 3398:7497)
export interface GigFull4Props {
  className?: string;
  style?: React.CSSProperties;
  category?: boolean;
  timeline?: boolean;
  loadline?: string;
  tag2?: React.ReactNode;
  tag?: React.ReactNode;
  tag3?: React.ReactNode;
  description?: boolean;
  prop?: boolean;
  loadline2?: string;
  loadline3?: string;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text1?: string;
  /** Text content; defaults to "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.". */
  text2?: string;
  /** Text content; defaults to "25.08.2025". */
  text3?: string;
  /** Text content; defaults to "25.08.2025". */
  text4?: string;
}

// figma layer: "Gig/SPECIALIST/в работе/attention block" (node 3392:5067)
export interface GigSPECIALISTAttentionBlockProps {
  className?: string;
  style?: React.CSSProperties;
  status?: boolean;
  category?: boolean;
  timeline?: boolean;
  loadline?: string;
  tag2?: React.ReactNode;
  tag?: React.ReactNode;
  tag3?: React.ReactNode;
  description?: boolean;
  prop?: boolean;
  loadline2?: string;
  loadline3?: string;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text1?: string;
  /** Text content; defaults to "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.". */
  text2?: string;
  /** Text content; defaults to "25.08.2025". */
  text3?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "H3" (node 2932:7197)
export interface H3Props {
  className?: string;
  style?: React.CSSProperties;
  type?: "header 3" | "file";
  /** Text content; defaults to "ЗАДАЧА". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "HEADER" (node 3024:2775)
export interface HEADERProps {
  className?: string;
  style?: React.CSSProperties;
  search?: boolean;
  type?: "header 1" | "header 2" | "type3";
  button?: boolean;
  collapsed?: boolean;
  switcher?: boolean;
  counter?: boolean;
  /** Text content; defaults to "ДАШБОРД". */
  text1?: string;
  /** Text content; defaults to "6". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "H/H1/BLOCK" (node 2862:3696)
export interface HH1BLOCKProps {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  icon?: boolean;
  iconType?: React.ReactNode;
  /** Text content; defaults to "Активные проекты". */
  text1?: string;
  /** Text content; defaults to "5". */
  text2?: string;
}

// figma layer: "H/H2/ЗАДАЧА" (node 2952:2823)
export interface HH2Props {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  icon?: boolean;
  iconType?: React.ReactNode;
  /** Text content; defaults to "Задача". */
  text1?: string;
}

// figma layer: "icon" (node 3100:3400)
export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "bootstrap";
  property2?: "outline & logos" | "filled";
  property3?: "star" | "star-half";
}

// figma layer: "icon" (node 3138:3082)
export interface Icon2Props {
  className?: string;
  style?: React.CSSProperties;
  property1?: "bootstrap";
  property2?: "outline & logos";
  property3?: "check-circle" | "circle";
}

// figma layer: "icon / bootstrap / outline & logos / arrow-down-right-square" (node 2778:907)
export interface IconBootstrapOutlineLogosArrow18Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / chevron-down" (node 2778:1593)
export interface IconBootstrapOutlineLogosChevron16Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / file-earmark-font" (node 2778:2096)
export interface IconBootstrapOutlineLogosFile21Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / filter-circle" (node 2778:2330)
export interface IconBootstrapOutlineLogosFilter2Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / journals" (node 2778:2629)
export interface IconBootstrapOutlineLogosJournalsProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / patch-check" (node 2778:2888)
export interface IconBootstrapOutlineLogosPatchProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / pencil" (node 2778:2931)
export interface IconBootstrapOutlineLogosPencilProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / person-bounding-box" (node 2778:2949)
export interface IconBootstrapOutlineLogosPerson3Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / question-square" (node 2778:3103)
export interface IconBootstrapOutlineLogosQuestion6Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / search" (node 2778:3201)
export interface IconBootstrapOutlineLogosSearchProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / shield-lock" (node 2778:3242)
export interface IconBootstrapOutlineLogosShield4Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon / bootstrap / outline & logos / x-circle" (node 2778:3828)
export interface IconBootstrapOutlineLogosX2Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Input Field" (node 2868:2320)
export interface InputFieldProps {
  className?: string;
  style?: React.CSSProperties;
  iconL?: boolean;
  iconLType?: React.ReactNode;
  state?: "default";
  iconR?: boolean;
  iconRType?: React.ReactNode;
  text?: string;
}

// figma layer: "logomark" (node 3179:3573)
export interface LogomarkProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "l" | "s" | "m" | "xs";
}

// figma layer: "massage" (node 3857:5793)
export interface MassageProps {
  className?: string;
  style?: React.CSSProperties;
  shorten?: boolean;
  state?: "default" | "hover";
  /** Text content; defaults to "Поддержка". */
  text1?: string;
  /** Text content; defaults to "Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться.". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Menu" (node 2802:3444)
export interface MenuProps {
  className?: string;
  style?: React.CSSProperties;
  shorten?: boolean;
  activeTab?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}

// figma layer: "menupage" (node 2801:2907)
export interface MenupageProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  shorten?: boolean;
  page?: string;
  state?: "default" | "hover" | "active";
  icon?: boolean;
  counter?: boolean;
  /** Text content; defaults to "6". */
  text1?: string;
}

// figma layer: "Message" (node 2866:2507)
export interface MessageProps {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  view?: "dashboard" | "chat";
  /** Text content; defaults to "5". */
  text1?: string;
  /** Text content; defaults to "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ". */
  text2?: string;
  /** Text content; defaults to "Кристина". */
  text3?: string;
  /** Text content; defaults to "2 мин". */
  text4?: string;
}

// figma layer: "Message/attention block" (node 3398:7361)
export interface MessageAttentionBlockProps {
  className?: string;
  style?: React.CSSProperties;
  counter?: boolean;
  /** Text content; defaults to "5". */
  text1?: string;
  /** Text content; defaults to "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ". */
  text2?: string;
  /** Text content; defaults to "Кристина". */
  text3?: string;
}

// figma layer: "Notification" (node 3112:2712)
export interface NotificationProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Миграция аналитического дашборда на Next.js 14". */
  text1?: string;
  /** Text content; defaults to "09:41". */
  text2?: string;
  /** Text content; defaults to "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ". */
  text3?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "profile frame" (node 2962:3883)
export interface ProfileFrameProps {
  className?: string;
  style?: React.CSSProperties;
  view?: "full" | "short";
  state?: "default" | "hover" | "focus" | "active";
  /** Text content; defaults to "Тимур Камальтдинов". */
  text1?: string;
  /** Text content; defaults to "Специалист". */
  text2?: string;
}

// figma layer: "roleplay" (node 3179:3687)
export interface RoleplayProps {
  className?: string;
  style?: React.CSSProperties;
  iconType?: React.ReactNode;
  state?: "default" | "hover";
  /** Text content; defaults to "Специалист". */
  text1?: string;
}

// figma layer: "search + filters" (node 2999:4376)
export interface SearchFiltersProps {
  className?: string;
  style?: React.CSSProperties;
  filters?: boolean;
}

// figma layer: "section" (node 2728:1263)
export interface SectionProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "content" | "variant2";
  /** Text content; defaults to "Мои заказы". */
  text1?: string;
  /** Text content; defaults to "Добавить". */
  text2?: string;
  /** Text content; defaults to "«Создание веб-страницы с использованием HTML и CSS»". */
  text3?: string;
  /** Text content; defaults to "150 000₽". */
  text4?: string;
}

// figma layer: "select" (node 3195:4537)
export interface SelectProps {
  className?: string;
  style?: React.CSSProperties;
  label?: boolean;
  state?: "default" | "chosen";
  labelTxt?: string;
  /** Text content; defaults to "Русский". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "session" (node 3149:2645)
export interface SessionProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "active" | "delete";
  /** Text content; defaults to "Категория уведомлений". */
  text1?: string;
  /** Text content; defaults to "Описание ". */
  text2?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Side bar" (node 2802:4051)
export interface SideBarProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "full" | "short";
  noti?: boolean;
}

// figma layer: "status" (node 2813:2228)
export interface StatusProps {
  className?: string;
  style?: React.CSSProperties;
  status?: "открыт" | "на рассмотрении" | "в работе" | "на проверке" | "завершён" | "отклонён";
  /** Text content; defaults to "Открыт". */
  text1?: string;
}

// figma layer: "status" (node 3149:2657)
export interface Status2Props {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Текущий". */
  text1?: string;
}

// figma layer: "status/SPECIALIST/В работе/XS" (node 3392:5123)
export interface StatusSPECIALISTXSProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "В работе". */
  text1?: string;
}

// figma layer: "switch bar" (node 3972:5628)
export interface SwitchBarProps {
  className?: string;
  style?: React.CSSProperties;
  tabText?: string;
  state?: "default" | "hover";
  counter?: boolean;
  active?: boolean;
  count?: string;
}

// figma layer: "switcher" (node 3807:6008)
export interface SwitcherProps {
  className?: string;
  style?: React.CSSProperties;
  activeTab?: "l" | "r";
}

// figma layer: "switcher" (node 3972:5655)
export interface Switcher2Props {
  className?: string;
  style?: React.CSSProperties;
  activeTab?: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}

// figma layer: "tag" (node 2802:3300)
export interface TagProps {
  className?: string;
  style?: React.CSSProperties;
  color?: "blue" | "rose" | "green" | "teal" | "orange";
  size?: "s";
  /** Text content; defaults to "React". */
  text1?: string;
}

// figma layer: "tag/Blue/XS" (node 2802:3299)
export interface TagBlueXSProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "React". */
  text1?: string;
}

declare const AttentionCard: React.FC<AttentionCardProps>;
declare const Bag: React.FC<BagProps>;
declare const Bio: React.FC<BioProps>;
declare const BioMessageCOMPANY: React.FC<BioMessageCOMPANYProps>;
declare const Button: React.FC<ButtonProps>;
declare const ButtonDefault: React.FC<ButtonDefaultProps>;
declare const ButtonIcon: React.FC<ButtonIconProps>;
declare const Category: React.FC<CategoryProps>;
declare const CategoryBlueXS: React.FC<CategoryBlueXSProps>;
declare const CheckField: React.FC<CheckFieldProps>;
declare const Component: React.FC<ComponentProps>;
declare const Component4: React.FC<Component4Props>;
declare const Component5: React.FC<Component5Props>;
declare const Counter: React.FC<CounterProps>;
declare const Dropdown: React.FC<DropdownProps>;
declare const DropdownItem: React.FC<DropdownItemProps>;
declare const File: React.FC<FileProps>;
declare const Filter: React.FC<FilterProps>;
declare const Gig: React.FC<GigProps>;
declare const GigFull4: React.FC<GigFull4Props>;
declare const GigSPECIALISTAttentionBlock: React.FC<GigSPECIALISTAttentionBlockProps>;
declare const H3: React.FC<H3Props>;
declare const HEADER: React.FC<HEADERProps>;
declare const HH1BLOCK: React.FC<HH1BLOCKProps>;
declare const HH2: React.FC<HH2Props>;
declare const Icon: React.FC<IconProps>;
declare const Icon2: React.FC<Icon2Props>;
declare const IconBootstrapOutlineLogosArrow18: React.FC<IconBootstrapOutlineLogosArrow18Props>;
declare const IconBootstrapOutlineLogosChevron16: React.FC<IconBootstrapOutlineLogosChevron16Props>;
declare const IconBootstrapOutlineLogosFile21: React.FC<IconBootstrapOutlineLogosFile21Props>;
declare const IconBootstrapOutlineLogosFilter2: React.FC<IconBootstrapOutlineLogosFilter2Props>;
declare const IconBootstrapOutlineLogosJournals: React.FC<IconBootstrapOutlineLogosJournalsProps>;
declare const IconBootstrapOutlineLogosPatch: React.FC<IconBootstrapOutlineLogosPatchProps>;
declare const IconBootstrapOutlineLogosPencil: React.FC<IconBootstrapOutlineLogosPencilProps>;
declare const IconBootstrapOutlineLogosPerson3: React.FC<IconBootstrapOutlineLogosPerson3Props>;
declare const IconBootstrapOutlineLogosQuestion6: React.FC<IconBootstrapOutlineLogosQuestion6Props>;
declare const IconBootstrapOutlineLogosSearch: React.FC<IconBootstrapOutlineLogosSearchProps>;
declare const IconBootstrapOutlineLogosShield4: React.FC<IconBootstrapOutlineLogosShield4Props>;
declare const IconBootstrapOutlineLogosX2: React.FC<IconBootstrapOutlineLogosX2Props>;
declare const InputField: React.FC<InputFieldProps>;
declare const Logomark: React.FC<LogomarkProps>;
declare const Massage: React.FC<MassageProps>;
declare const Menu: React.FC<MenuProps>;
declare const Menupage: React.FC<MenupageProps>;
declare const Message: React.FC<MessageProps>;
declare const MessageAttentionBlock: React.FC<MessageAttentionBlockProps>;
declare const Notification: React.FC<NotificationProps>;
declare const ProfileFrame: React.FC<ProfileFrameProps>;
declare const Roleplay: React.FC<RoleplayProps>;
declare const SearchFilters: React.FC<SearchFiltersProps>;
declare const Section: React.FC<SectionProps>;
declare const Select: React.FC<SelectProps>;
declare const Session: React.FC<SessionProps>;
declare const SideBar: React.FC<SideBarProps>;
declare const Status: React.FC<StatusProps>;
declare const Status2: React.FC<Status2Props>;
declare const StatusSPECIALISTXS: React.FC<StatusSPECIALISTXSProps>;
declare const SwitchBar: React.FC<SwitchBarProps>;
declare const Switcher: React.FC<SwitcherProps>;
declare const Switcher2: React.FC<Switcher2Props>;
declare const Tag: React.FC<TagProps>;
declare const TagBlueXS: React.FC<TagBlueXSProps>;
declare global {
  interface Window {
    AttentionCard: React.FC<AttentionCardProps>;
    Bag: React.FC<BagProps>;
    Bio: React.FC<BioProps>;
    BioMessageCOMPANY: React.FC<BioMessageCOMPANYProps>;
    Button: React.FC<ButtonProps>;
    ButtonDefault: React.FC<ButtonDefaultProps>;
    ButtonIcon: React.FC<ButtonIconProps>;
    Category: React.FC<CategoryProps>;
    CategoryBlueXS: React.FC<CategoryBlueXSProps>;
    CheckField: React.FC<CheckFieldProps>;
    Component: React.FC<ComponentProps>;
    Component4: React.FC<Component4Props>;
    Component5: React.FC<Component5Props>;
    Counter: React.FC<CounterProps>;
    Dropdown: React.FC<DropdownProps>;
    DropdownItem: React.FC<DropdownItemProps>;
    File: React.FC<FileProps>;
    Filter: React.FC<FilterProps>;
    Gig: React.FC<GigProps>;
    GigFull4: React.FC<GigFull4Props>;
    GigSPECIALISTAttentionBlock: React.FC<GigSPECIALISTAttentionBlockProps>;
    H3: React.FC<H3Props>;
    HEADER: React.FC<HEADERProps>;
    HH1BLOCK: React.FC<HH1BLOCKProps>;
    HH2: React.FC<HH2Props>;
    Icon: React.FC<IconProps>;
    Icon2: React.FC<Icon2Props>;
    IconBootstrapOutlineLogosArrow18: React.FC<IconBootstrapOutlineLogosArrow18Props>;
    IconBootstrapOutlineLogosChevron16: React.FC<IconBootstrapOutlineLogosChevron16Props>;
    IconBootstrapOutlineLogosFile21: React.FC<IconBootstrapOutlineLogosFile21Props>;
    IconBootstrapOutlineLogosFilter2: React.FC<IconBootstrapOutlineLogosFilter2Props>;
    IconBootstrapOutlineLogosJournals: React.FC<IconBootstrapOutlineLogosJournalsProps>;
    IconBootstrapOutlineLogosPatch: React.FC<IconBootstrapOutlineLogosPatchProps>;
    IconBootstrapOutlineLogosPencil: React.FC<IconBootstrapOutlineLogosPencilProps>;
    IconBootstrapOutlineLogosPerson3: React.FC<IconBootstrapOutlineLogosPerson3Props>;
    IconBootstrapOutlineLogosQuestion6: React.FC<IconBootstrapOutlineLogosQuestion6Props>;
    IconBootstrapOutlineLogosSearch: React.FC<IconBootstrapOutlineLogosSearchProps>;
    IconBootstrapOutlineLogosShield4: React.FC<IconBootstrapOutlineLogosShield4Props>;
    IconBootstrapOutlineLogosX2: React.FC<IconBootstrapOutlineLogosX2Props>;
    InputField: React.FC<InputFieldProps>;
    Logomark: React.FC<LogomarkProps>;
    Massage: React.FC<MassageProps>;
    Menu: React.FC<MenuProps>;
    Menupage: React.FC<MenupageProps>;
    Message: React.FC<MessageProps>;
    MessageAttentionBlock: React.FC<MessageAttentionBlockProps>;
    Notification: React.FC<NotificationProps>;
    ProfileFrame: React.FC<ProfileFrameProps>;
    Roleplay: React.FC<RoleplayProps>;
    SearchFilters: React.FC<SearchFiltersProps>;
    Section: React.FC<SectionProps>;
    Select: React.FC<SelectProps>;
    Session: React.FC<SessionProps>;
    SideBar: React.FC<SideBarProps>;
    Status: React.FC<StatusProps>;
    Status2: React.FC<Status2Props>;
    StatusSPECIALISTXS: React.FC<StatusSPECIALISTXSProps>;
    SwitchBar: React.FC<SwitchBarProps>;
    Switcher: React.FC<SwitcherProps>;
    Switcher2: React.FC<Switcher2Props>;
    Tag: React.FC<TagProps>;
    TagBlueXS: React.FC<TagBlueXSProps>;
  }
}
