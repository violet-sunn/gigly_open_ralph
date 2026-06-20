import { IconBootstrapOutlineLogosFile21 } from './IconBootstrapOutlineLogosFile21.jsx';

// figma node: 3600:5262 file
export function File(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
          position: "relative",
          width: 24,
          height: 24,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosFile21 style={{ transform: "scale(1.500, 1.500)", transformOrigin: "0 0" }} />}</div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 11,
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          textDecoration: "underline",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "ТЗ.doc"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          letterSpacing: "-0.010em",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "15 MB"}</span>
      </div>
    </div>
  );
}
export default File;
