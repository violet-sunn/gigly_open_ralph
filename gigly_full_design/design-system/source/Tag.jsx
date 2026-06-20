// figma node: 2802:3300 tag (5 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "color=" + __venc(p.color) + '|' + "size=" + __venc(p.size);

export function Tag(_p = {}) {
  const props = { ..._p, color: _p.color ?? "blue", size: _p.size ?? "s" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgba(0,136,255,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "0.010em",
        color: "var(--color-primary-hover)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "React"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgba(244,95,177,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "0.010em",
        color: "rgb(244,95,177)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "React"}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgba(12,198,113,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "0.010em",
        color: "rgb(12,198,113)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "React"}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgba(5,201,230,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "0.010em",
        color: "rgb(5,201,230)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "React"}</span>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgba(242,124,13,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "0.010em",
        color: "rgb(242,124,13)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "React"}</span>
    </div>
  );
  const __impls = {
    // figma: Color=Blue, Size=S
    "color=blue|size=s": __body0,
    // figma: Color=rose, Size=S
    "color=rose|size=s": __body1,
    // figma: Color=green, Size=S
    "color=green|size=s": __body2,
    // figma: Color=teal, Size=S
    "color=teal|size=s": __body3,
    // figma: Color=orange, Size=S
    "color=orange|size=s": __body4,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Tag;
