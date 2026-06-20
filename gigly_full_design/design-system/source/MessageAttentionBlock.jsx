import { Bio } from './Bio.jsx';

// figma node: 3398:7361 Message/attention block
export function MessageAttentionBlock(_p = {}) {
  const props = { ..._p, counter: _p.counter ?? true };
  return (
    <div className={props.className} style={{
      width: 275,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Bio
          style={{
            position: "relative",
            height: 20,
            flexGrow: 1,
            width: "auto",
          }}
          sizeFor={"gig"}
          uSER={"company"}
        />
        <div style={{
          position: "relative",
          width: 22,
          height: 22,
          borderRadius: 666,
          backgroundColor: "var(--color-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "3px 3px 3px 3px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            textAlign: "center",
            lineHeight: "100%",
            color: "rgb(255,255,255)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "5"}</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.text2 ?? "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? "}</span>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "100%",
            color: "rgb(159,160,164)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text3 ?? "Кристина"}</span>
        </div>
      </div>
    </div>
  );
}
export default MessageAttentionBlock;
