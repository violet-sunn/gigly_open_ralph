// figma node: 3149:2657 status
export function Status2(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 666,
      backgroundColor: "rgba(0,136,255,0.1)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-xs) * 1px)",
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
      <div style={{
        position: "relative",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "rgb(0,136,255)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "16px",
        color: "rgb(0,136,255)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Текущий"}</span>
    </div>
  );
}
export default Status2;
