import { IconBootstrapOutlineLogosX2 } from './IconBootstrapOutlineLogosX2.jsx';

// figma node: 3112:2712 Notification
export function Notification(_p = {}) {
  const props = _p;
  return (
    <div className={props.className} style={{
      width: 636,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px 12px 16px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 8,
          alignItems: "flex-start",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "100%",
            color: "rgb(255,255,255)",
            flexGrow: 1,
          }}>{props.text1 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            textAlign: "right",
            lineHeight: "100%",
            color: "rgba(159,160,164,0.7)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "09:41"}</span>
          <div style={{
              position: "relative",
              width: 16,
              height: 16,
              flexShrink: 0,
            }}>{props.icon1 ?? <IconBootstrapOutlineLogosX2 />}</div>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          color: "rgba(159,160,164,0.6)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.text3 ?? "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? "}</span>
      </div>
    </div>
  );
}
export default Notification;
