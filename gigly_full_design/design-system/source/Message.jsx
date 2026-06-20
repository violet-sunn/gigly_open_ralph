import { Bio } from './Bio.jsx';
import { BioMessageCOMPANY } from './BioMessageCOMPANY.jsx';
import { Status } from './Status.jsx';

// figma node: 2866:2507 Message (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "view=" + __venc(p.view);

export function Message(_p = {}) {
  const props = { ..._p, counter: _p.counter ?? true, view: _p.view ?? "dashboard" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 275,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--gig-bg)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px 12px 12px 12px",
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
        <BioMessageCOMPANY
          style={{ position: "relative", flexGrow: 1, width: "auto" }}
          verificationMark={false}
          info={false}
          prop={false}
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
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
          lineHeight: "100%",
          color: "rgb(159,160,164)",
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
            color: "rgb(255,255,255)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text3 ?? "Кристина"}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            textAlign: "right",
            lineHeight: "100%",
            color: "rgb(159,160,164)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text4 ?? "2 мин"}</span>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 275,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--gig-bg)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px 12px 12px 12px",
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
          style={{ position: "relative", flexGrow: 1, width: "auto" }}
          sizeFor={"gig"}
          uSER={"company"}
        />
        <Status
          style={{ position: "relative", flexShrink: 0 }}
          status={"отклонён"}
        />
        {props.counter && (
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
        )}
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexGrow: 1,
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
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
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text3 ?? "Кристина"}</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            textAlign: "right",
            lineHeight: "100%",
            color: "rgb(159,160,164)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text4 ?? "09:41"}</span>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? </span>
      </div>
    </div>
  );
  const __impls = {
    // figma: view=dashboard
    "view=dashboard": __body0,
    // figma: view=chat
    "view=chat": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Message;
