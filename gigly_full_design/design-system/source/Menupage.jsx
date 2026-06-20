import { IconBootstrapOutlineLogosJournals } from './IconBootstrapOutlineLogosJournals.jsx';

// figma node: 2801:2907 menupage (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "shorten=" + __venc(p.shorten) + '|' + "state=" + __venc(p.state);

export function Menupage(_p = {}) {
  const props = { ..._p, shorten: _p.shorten ?? true, page: _p.page ?? "Проекты", state: _p.state ?? "default", icon: _p.icon ?? true, counter: _p.counter ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 304,
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "center",
        flexShrink: 0,
      }}>
        {props.icon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "rgb(255,255,255)",
          }}>{props.iconType ?? <IconBootstrapOutlineLogosJournals />}</div>
        )}
        <span style={{
          position: "relative",
          fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 18,
          lineHeight: "100%",
          letterSpacing: "0.010em",
          color: "var(--text-secondary)",
          flexShrink: 0,
        }}>{props.page}</span>
      </div>
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "17px",
        color: "var(--text-secondary)",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "6"}</span>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 304,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "center",
        flexShrink: 0,
      }}>
        {props.icon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "var(--text-primary)",
          }}>{props.iconType ?? <IconBootstrapOutlineLogosJournals />}</div>
        )}
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 13,
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--text-primary)",
          flexShrink: 0,
        }}>{props.page}</span>
      </div>
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "17px",
        color: "var(--brand-default)",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "6"}</span>
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 304,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "center",
        flexShrink: 0,
      }}>
        {props.icon && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "var(--text-primary)",
          }}>{props.iconType ?? <IconBootstrapOutlineLogosJournals />}</div>
        )}
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 13,
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--text-primary)",
          flexShrink: 0,
        }}>{props.page}</span>
      </div>
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "17px",
        color: "var(--brand-default)",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "6"}</span>
      )}
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 78,
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.icon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosJournals />}</div>
      )}
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "17px",
        color: "var(--text-secondary)",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "6"}</span>
      )}
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 78,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.icon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "var(--text-primary)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosJournals />}</div>
      )}
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "17px",
        color: "var(--brand-default)",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "6"}</span>
      )}
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 78,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.icon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "var(--text-primary)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosJournals />}</div>
      )}
      {props.counter && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: "17px",
        color: "var(--brand-default)",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>{props.text1 ?? "6"}</span>
      )}
    </div>
  );
  const __impls = {
    // figma: shorten=no, State=Default
    "shorten=false|state=default": __body0,
    // figma: shorten=no, State=Hover
    "shorten=false|state=hover": __body1,
    // figma: shorten=no, State=Active
    "shorten=false|state=active": __body2,
    // figma: shorten=yes, State=Default
    "shorten=true|state=default": __body3,
    // figma: shorten=yes, State=Hover
    "shorten=true|state=hover": __body4,
    // figma: shorten=yes, State=Active
    "shorten=true|state=active": __body5,
  };
  return (__impls[__vkey(props)] ?? __body3)();
}
export default Menupage;
