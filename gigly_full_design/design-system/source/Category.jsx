// figma node: 2868:3724 Category (5 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "color=" + __venc(p.color) + '|' + "size=" + __venc(p.size);

export function Category(_p = {}) {
  const props = { ..._p, color: _p.color ?? "blue", size: _p.size ?? "s" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(76,172,255)",
      borderRight: "2px solid rgb(76,172,255)",
      borderBottom: "2px solid rgb(76,172,255)",
      borderLeft: "2px solid rgb(76,172,255)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        color: "rgb(76,172,255)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Маркетинг"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(244,95,177)",
      borderRight: "2px solid rgb(244,95,177)",
      borderBottom: "2px solid rgb(244,95,177)",
      borderLeft: "2px solid rgb(244,95,177)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        color: "rgb(244,95,177)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Дизайн"}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(12,198,113)",
      borderRight: "2px solid rgb(12,198,113)",
      borderBottom: "2px solid rgb(12,198,113)",
      borderLeft: "2px solid rgb(12,198,113)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        color: "rgb(12,198,113)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Программирование"}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(5,201,230)",
      borderRight: "2px solid rgb(5,201,230)",
      borderBottom: "2px solid rgb(5,201,230)",
      borderLeft: "2px solid rgb(5,201,230)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        color: "rgb(5,201,230)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Разработка"}</span>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(242,124,13)",
      borderRight: "2px solid rgb(242,124,13)",
      borderBottom: "2px solid rgb(242,124,13)",
      borderLeft: "2px solid rgb(242,124,13)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "100%",
        color: "rgb(242,124,13)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Кодинг"}</span>
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
export default Category;
