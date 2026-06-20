import { IconBootstrapOutlineLogosPerson3 } from './IconBootstrapOutlineLogosPerson3.jsx';

// figma node: 3179:3687 roleplay (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state);

export function Roleplay(_p = {}) {
  const props = { ..._p, state: _p.state ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 1296,
      height: 40,
      overflow: "hidden",
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        backgroundColor: "rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.iconType ?? <IconBootstrapOutlineLogosPerson3 />}</div>
      </div>
      <div style={{
        position: "relative",
        backgroundColor: "rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexGrow: 1,
        }}>{props.text1 ?? "Специалист"}</span>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 1296,
      height: 40,
      overflow: "hidden",
      borderRadius: 4,
      background: "linear-gradient(rgba(19,121,243,0.3),rgba(19,121,243,0.3)), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
      boxShadow: "inset 0 0 0 1px var(--color-2)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderTop: "1px solid rgb(255,255,255)",
        borderRight: "1px solid rgb(255,255,255)",
        borderBottom: "1px solid rgb(255,255,255)",
        borderLeft: "1px solid rgb(255,255,255)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.iconType ?? <IconBootstrapOutlineLogosPerson3 />}</div>
      </div>
      <div style={{
        position: "relative",
        backgroundColor: "rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexGrow: 1,
        }}>{props.text1 ?? "Специалист"}</span>
      </div>
    </div>
  );
  const __impls = {
    // figma: State=Default
    "state=default": __body0,
    // figma: State=hover
    "state=hover": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Roleplay;
