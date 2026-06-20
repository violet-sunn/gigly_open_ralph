import { Bio } from './Bio.jsx';
import { Button } from './Button.jsx';

// figma node: 3398:7497 Gig/На рассмотрении/full
export function GigFull4(_p = {}) {
  const props = { ..._p, category: _p.category ?? false, timeline: _p.timeline ?? true, loadline: _p.loadline ?? "", description: _p.description ?? true, prop: _p.prop ?? true, loadline2: _p.loadline2 ?? "", loadline3: _p.loadline3 ?? "" };
  return (
    <div className={props.className} style={{
      width: 558.5,
      borderRadius: 12,
      background: "radial-gradient(558.500px 217px at 50.00% 0.00%, rgba(8,145,178,0.4) 0.00%, rgba(8,145,178,0.08) 46.63%, rgba(8,145,178,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05)), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
      boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "16px 16px 16px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-md) * 1px)",
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
            info={false}
            sizeFor={"gig"}
            uSER={"company"}
          />
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
            fontSize: 18,
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
            fontSize: 14,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
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
          }}>{props.text4 ?? "25.08.2025"}</span>
        </div>
        )}
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "100%",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "100%",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "100%",
            color: "rgb(115,115,115)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "100%",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
}
export default GigFull4;
