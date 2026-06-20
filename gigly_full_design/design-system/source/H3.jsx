import { IconBootstrapOutlineLogosFile21 } from './IconBootstrapOutlineLogosFile21.jsx';

// figma node: 2932:7197 H3 (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type);

export function H3(_p = {}) {
  const props = { ..._p, type: _p.type ?? "header 3" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 637,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 600,
        fontSize: 14,
        lineHeight: "100%",
        color: "var(--color-2-2)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "ЗАДАЧА"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 637,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 6,
        height: 6,
        backgroundColor: "var(--color-2-2)",
        flexShrink: 0,
      }} />
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 16,
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}>{props.icon1 ?? <IconBootstrapOutlineLogosFile21 />}</div>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 600,
          fontSize: 11,
          lineHeight: "100%",
          color: "var(--color-2-2)",
          textDecoration: "underline",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "ТЗ.doc"}</span>
      </div>
    </div>
  );
  const __impls = {
    // figma: type=header 3
    "type=header 3": __body0,
    // figma: type=file
    "type=file": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default H3;
