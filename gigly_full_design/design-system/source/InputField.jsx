import { IconBootstrapOutlineLogosSearch } from './IconBootstrapOutlineLogosSearch.jsx';
import { IconBootstrapOutlineLogosX2 } from './IconBootstrapOutlineLogosX2.jsx';

// figma node: 2868:2320 Input Field (1 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state);

export function InputField(_p = {}) {
  const props = { ..._p, iconL: _p.iconL ?? true, state: _p.state ?? "default", iconR: _p.iconR ?? true, text: _p.text ?? "Поиск по названию или описанию..." };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 800,
      height: 40,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "1px solid var(--brand-default)",
      borderRight: "4px solid var(--brand-default)",
      borderBottom: "1px solid var(--brand-default)",
      borderLeft: "1px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 12px 8px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.iconL && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "var(--text-primary)",
        }}>{props.iconLType ?? <IconBootstrapOutlineLogosSearch />}</div>
      )}
      <span style={{
        position: "relative",
        fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 457,
        fontSize: 14,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "100%",
        color: "var(--text-secondary)",
        flexGrow: 1,
      }}>{props.text}</span>
      {props.iconR && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconRType ?? <IconBootstrapOutlineLogosX2 />}</div>
      )}
    </div>
  );
  const __impls = {
    // figma: State=default
    "state=default": __body0,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default InputField;
