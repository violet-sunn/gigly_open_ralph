// figma node: 3972:5628 switch bar (3 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + '|' + "active=" + __venc(p.active);

export function SwitchBar(_p = {}) {
  const props = { ..._p, tabText: _p.tabText ?? "Tab text", state: _p.state ?? "default", counter: _p.counter ?? false, active: _p.active ?? false, count: _p.count ?? "1" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 110,
      height: 32,
      minHeight: 32,
      maxWidth: null,
      maxHeight: 32,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 24,
        lineHeight: "29px",
        letterSpacing: "-0.300px",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>{props.tabText}</span>
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>{props.count}</span>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 110,
      height: 32,
      minHeight: 32,
      maxWidth: null,
      maxHeight: 32,
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>{props.tabText}</span>
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>{props.count}</span>
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 110,
      height: 32,
      minHeight: 32,
      maxWidth: null,
      maxHeight: 32,
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "rgb(255,255,255)",
        flexShrink: 0,
      }}>{props.tabText}</span>
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "rgb(255,255,255)",
        flexShrink: 0,
      }}>{props.count}</span>
      )}
    </div>
  );
  const __impls = {
    // figma: State=Default, Active=no
    "state=default|active=false": __body0,
    // figma: State=Hover, Active=no
    "state=hover|active=false": __body1,
    // figma: State=Default, Active=yes
    "state=default|active=true": __body2,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default SwitchBar;
