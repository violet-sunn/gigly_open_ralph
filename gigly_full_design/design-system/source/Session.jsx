import { IconBootstrapOutlineLogosX2 } from './IconBootstrapOutlineLogosX2.jsx';
import { Status2 } from './Status2.jsx';

// figma node: 3149:2645 session (3 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state);

export function Session(_p = {}) {
  const props = { ..._p, state: _p.state ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 1244,
      borderRadius: 4,
      backgroundColor: "rgb(1,3,14)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-start",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Категория уведомлений"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          color: "rgb(159,160,164)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Описание "}</span>
      </div>
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
        }}>{props.icon1 ?? <IconBootstrapOutlineLogosX2 />}</div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 1244,
      borderRadius: 4,
      backgroundColor: "rgb(1,3,14)",
      boxShadow: "inset 0 0 0 1px var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-start",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Категория уведомлений"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          color: "rgb(159,160,164)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Описание "}</span>
      </div>
      <Status2 style={{ position: "relative", flexShrink: 0 }} />
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 1244,
      borderRadius: 4,
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
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Удалить аккаунт"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          color: "rgb(159,160,164)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.text2 ?? "Удаление аккаунта необратимо. Все данные будут стёрты."}</span>
      </div>
      <div style={{
        position: "relative",
        minHeight: 40,
        maxWidth: null,
        maxHeight: 40,
        borderRadius: 8,
        backgroundColor: "rgba(255,56,60,0.2)",
        boxShadow: "inset 0 0 0 1px var(--border-strong)",
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
        flexShrink: 0,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 556,
          fontSize: 16,
          lineHeight: "100%",
          flexShrink: 0,
        }}>Удалить аккаунт навсегда</span>
        <div style={{
          position: "relative",
          width: 20,
          height: 20,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 20,
            height: 20,
            color: "var(--text-primary)",
          }}>
            <path d={"M 18.75 2.5 C 18.75 2.168 18.618 1.851 18.384 1.616 C 18.149 1.382 17.832 1.25 17.5 1.25 L 2.5 1.25 C 2.168 1.25 1.851 1.382 1.616 1.616 C 1.382 1.851 1.25 2.168 1.25 2.5 L 1.25 17.5 C 1.25 17.832 1.382 18.149 1.616 18.384 C 1.851 18.618 2.168 18.75 2.5 18.75 L 17.5 18.75 C 17.832 18.75 18.149 18.618 18.384 18.384 C 18.618 18.149 18.75 17.832 18.75 17.5 L 18.75 2.5 Z M 0 2.5 C 0 1.837 0.263 1.201 0.732 0.732 C 1.201 0.263 1.837 0 2.5 0 L 17.5 0 C 18.163 0 18.799 0.263 19.268 0.732 C 19.737 1.201 20 1.837 20 2.5 L 20 17.5 C 20 18.163 19.737 18.799 19.268 19.268 C 18.799 19.737 18.163 20 17.5 20 L 2.5 20 C 1.837 20 1.201 19.737 0.732 19.268 C 0.263 18.799 0 18.163 0 17.5 L 0 2.5 Z M 7.318 6.432 C 7.2 6.315 7.041 6.249 6.875 6.249 C 6.709 6.249 6.55 6.315 6.432 6.432 C 6.315 6.55 6.249 6.709 6.249 6.875 C 6.249 7.041 6.315 7.2 6.432 7.318 L 11.554 12.438 L 8.094 12.438 C 7.928 12.438 7.769 12.503 7.652 12.621 C 7.535 12.738 7.469 12.897 7.469 13.063 C 7.469 13.228 7.535 13.387 7.652 13.504 C 7.769 13.622 7.928 13.688 8.094 13.688 L 13.063 13.688 C 13.228 13.688 13.387 13.622 13.504 13.504 C 13.622 13.387 13.688 13.228 13.688 13.063 L 13.688 8.094 C 13.688 7.928 13.622 7.769 13.504 7.652 C 13.387 7.535 13.228 7.469 13.063 7.469 C 12.897 7.469 12.738 7.535 12.621 7.652 C 12.503 7.769 12.438 7.928 12.438 8.094 L 12.438 11.554 L 7.318 6.432 Z"} fill="currentColor" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: state=Default
    "state=default": __body0,
    // figma: state=active
    "state=active": __body1,
    // figma: state=delete
    "state=delete": __body2,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Session;
