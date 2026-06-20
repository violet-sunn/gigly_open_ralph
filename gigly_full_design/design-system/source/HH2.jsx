// figma node: 2952:2823 H/H2/ЗАДАЧА
export function HH2(_p = {}) {
  const props = { ..._p, counter: _p.counter ?? true, icon: _p.icon ?? false };
  return (
    <div className={props.className} style={{
      width: 653,
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
        fontWeight: 400,
        fontSize: 18,
        lineHeight: "100%",
        color: "var(--color-2-2)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Задача"}</span>
    </div>
  );
}
export default HH2;
