import { Bio } from './Bio.jsx';
import { CategoryBlueXS } from './CategoryBlueXS.jsx';
import { StatusSPECIALISTXS } from './StatusSPECIALISTXS.jsx';

// figma node: 3392:5067 Gig/SPECIALIST/в работе/attention block
export function GigSPECIALISTAttentionBlock(_p = {}) {
  const props = { ..._p, status: _p.status ?? true, category: _p.category ?? false, timeline: _p.timeline ?? true, loadline: _p.loadline ?? "", description: _p.description ?? true, prop: _p.prop ?? true, loadline2: _p.loadline2 ?? "", loadline3: _p.loadline3 ?? "" };
  return (
    <div className={props.className} style={{
      width: 280,
      borderRadius: 8,
      background: "radial-gradient(280px 166px at 50.00% 0.00%, rgba(19,121,243,0.4) 0.00%, rgba(19,121,243,0.08) 46.63%, rgba(19,121,243,0) 100.00%), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
      boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "12px 12px 12px 12px",
      justifyContent: "center",
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
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", width: 294, flexShrink: 0 }}
            verificationMark={true}
            info={false}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            justifyContent: "flex-end",
            alignItems: "center",
            flexShrink: 0,
          }}>
            {props.category && (
            <CategoryBlueXS style={{ position: "relative", flexShrink: 0 }} />
            )}
            {props.status && (
            <div style={{ position: "relative", flexShrink: 0 }}>{props.icon1 ?? <StatusSPECIALISTXS />}</div>
            )}
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
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "100%",
            color: "rgb(255,255,255)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text1 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
          {props.description && (
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            lineHeight: "16px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text2 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
        </div>
        {props.timeline && (
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "3px 0px 3px 0px",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            height: 4,
            overflow: "hidden",
            borderRadius: 3000,
            backgroundColor: "rgba(159,160,164,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            justifyContent: "center",
            alignItems: "flex-start",
            flexGrow: 1,
          }}>
            <div style={{
              position: "relative",
              width: 46,
              borderRadius: 3000,
              backgroundColor: "rgb(159,160,164)",
              flexGrow: 1,
            }} />
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "100%",
            color: "rgb(159,160,164)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text3 ?? "25.08.2025"}</span>
        </div>
        )}
      </div>
    </div>
  );
}
export default GigSPECIALISTAttentionBlock;
