// figma node: 3392:5123 status/SPECIALIST/В работе/XS
export function StatusSPECIALISTXS(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      backgroundColor: "rgba(0,136,255,0.1)",
      borderTop: "1px solid rgb(0,136,255)",
      borderRight: "2px solid rgb(0,136,255)",
      borderBottom: "1px solid rgb(0,136,255)",
      borderLeft: "2px solid rgb(0,136,255)",
      display: "flex",
      flexDirection: "row",
      padding: "0px 6px 0px 6px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 600,
        fontSize: 12,
        lineHeight: "16px",
        color: "rgb(0,136,255)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "В работе"}</span>
    </div>
  );
}
export default StatusSPECIALISTXS;
