// figma node: 2802:3299 tag/Blue/XS
export function TagBlueXS(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: "fit-content",
      backgroundColor: "rgba(0,136,255,0.15)",
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
        fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 11,
        lineHeight: "100%",
        letterSpacing: "0.010em",
        color: "var(--color-primary-hover)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "React"}</span>
    </div>
  );
}
export default TagBlueXS;
