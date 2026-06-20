// figma node: 2813:2228 status (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "status=" + __venc(p.status);

export function Status(_p = {}) {
  const props = { ..._p, status: _p.status ?? "открыт" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--status-new-text)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "16px",
        color: "var(--status-new-text)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Открыт"}</span>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--status-review-text)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "16px",
        color: "var(--status-review-text)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "На рассмотрении"}</span>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--status-in-progress-text)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "16px",
        color: "var(--status-in-progress-text)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "В работе"}</span>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--status-testing-text)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--status-testing-text)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "На проверке"}</span>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--status-completed-text)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "16px",
        color: "var(--status-completed-text)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Завершён"}</span>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: "var(--status-rejected-text)",
        flexShrink: 0,
      }} />
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 14,
        lineHeight: "16px",
        color: "var(--status-rejected-text)",
        flexShrink: 0,
        alignSelf: "stretch",
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "Отклонён"}</span>
    </div>
  );
  const __impls = {
    // figma: Status=Открыт
    "status=открыт": __body0,
    // figma: Status=На рассмотрении
    "status=на рассмотрении": __body1,
    // figma: Status=В работе
    "status=в работе": __body2,
    // figma: Status=На проверке
    "status=на проверке": __body3,
    // figma: Status=Завершён
    "status=завершён": __body4,
    // figma: Status=Отклонён
    "status=отклонён": __body5,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Status;
