import { DropdownItem } from './DropdownItem.jsx';

// figma node: 3934:6211 dropdown (1 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1);

export function Dropdown(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 126,
      height: 96,
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      padding: "8px 0px 8px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <DropdownItem
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        state={"default"}
        selected={false}
      />
      <DropdownItem
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        state={"default"}
        selected={false}
      />
    </div>
  );
  const __impls = {
    // figma: Property 1=Default
    "property1=default": __body0,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Dropdown;
