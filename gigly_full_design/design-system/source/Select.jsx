import { IconBootstrapOutlineLogosChevron16 } from './IconBootstrapOutlineLogosChevron16.jsx';

// figma node: 3195:4537 select (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state);

export function Select(_p = {}) {
  const props = { ..._p, label: _p.label ?? false, state: _p.state ?? "default", labelTxt: _p.labelTxt ?? "Label" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 1296,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-start",
      position: "relative",
      ...props.style,
    }}>
      {props.label && (
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "2px 12px 2px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>{props.labelTxt}</span>
      </div>
      )}
      <div style={{
        position: "relative",
        height: 40,
        borderRadius: 4,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 14,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "16px",
          color: "rgba(159,160,164,0.7)",
          flexGrow: 1,
        }}>{props.text1 ?? "Русский"}</span>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.icon1 ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 1296,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-start",
      position: "relative",
      ...props.style,
    }}>
      {props.label && (
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "2px 12px 2px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>{props.labelTxt}</span>
      </div>
      )}
      <div style={{
        position: "relative",
        height: 40,
        borderRadius: 4,
        boxShadow: "inset 0 0 0 1px var(--color-2)",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
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
        }}>{props.text1 ?? "Русский"}</span>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.icon1 ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      </div>
    </div>
  );
  const __impls = {
    // figma: State=Default
    "state=default": __body0,
    // figma: State=chosen
    "state=chosen": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Select;
