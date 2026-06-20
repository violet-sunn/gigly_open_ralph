// figma node: 2868:3725 Category/Blue/XS
export function CategoryBlueXS(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 666,
      borderTop: "1px solid rgb(76,172,255)",
      borderRight: "1px solid rgb(76,172,255)",
      borderBottom: "1px solid rgb(76,172,255)",
      borderLeft: "1px solid rgb(76,172,255)",
      display: "flex",
      flexDirection: "row",
      padding: "3px 6px 3px 6px",
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
        fontSize: 11,
        lineHeight: "100%",
        color: "rgb(76,172,255)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Маркетинг"}</span>
    </div>
  );
}
export default CategoryBlueXS;
