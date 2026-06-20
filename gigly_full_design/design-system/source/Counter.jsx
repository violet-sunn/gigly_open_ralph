// figma node: 3179:3997 counter
export function Counter(_p = {}) {
  const props = { ..._p, points: _p.points ?? "" };
  return (
    <div className={props.className} style={{
      width: 360,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 4,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 8,
          borderRadius: 2,
          backgroundColor: "var(--color-2)",
          flexShrink: 0,
          alignSelf: "stretch",
        }} />
        <div style={{
          position: "relative",
          width: 6,
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.3)",
          flexShrink: 0,
          alignSelf: "stretch",
        }} />
        <div style={{
          position: "relative",
          width: 6,
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.3)",
          flexShrink: 0,
          alignSelf: "stretch",
        }} />
      </div>
    </div>
  );
}
export default Counter;
