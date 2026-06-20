// figma node: 3435:5794 Специальность (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "size=" + __venc(p.size);

export function Component(_p = {}) {
  const props = { ..._p, size: _p.size ?? "s" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "-0.010em",
        color: "var(--brand-default)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "[Senior Frontend Engineer]"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 4px 0px 4px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-xs) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-xs) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 600,
        fontSize: 12,
        lineHeight: "100%",
        letterSpacing: "-0.010em",
        color: "var(--brand-default)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "[Senior Frontend Engineer]"}</span>
    </div>
  );
  const __impls = {
    // figma: Size=S
    "size=s": __body0,
    // figma: Size=XS
    "size=xs": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Component;
