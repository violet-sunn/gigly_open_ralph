import { IconBootstrapOutlineLogosShield4 } from './IconBootstrapOutlineLogosShield4.jsx';

// figma node: 2862:3696 H/H1/BLOCK
export function HH1BLOCK(_p = {}) {
  const props = { ..._p, counter: _p.counter ?? true, icon: _p.icon ?? false };
  return (
    <div className={props.className} style={{
      width: 300,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 500,
          fontSize: 22,
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Активные проекты"}</span>
        {props.counter && (
        <div style={{
          position: "relative",
          width: 22,
          backgroundColor: "var(--brand-default)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "3px 3px 3px 3px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 16,
            textAlign: "center",
            lineHeight: "100%",
            color: "var(--color-2-2)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "5"}</span>
        </div>
        )}
      </div>
      {props.icon && (
      <div style={{
          position: "relative",
          width: 22,
          height: 22,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosShield4 style={{ transform: "scale(1.375, 1.375)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
}
export default HH1BLOCK;
