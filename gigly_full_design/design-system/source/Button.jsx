import { IconBootstrapOutlineLogosArrow18 } from './IconBootstrapOutlineLogosArrow18.jsx';

// figma node: 3149:3432 Button (9 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property=" + __venc(p.property) + '|' + "state=" + __venc(p.state);

export function Button(_p = {}) {
  const props = { ..._p, icon: _p.icon ?? false, property: _p.property ?? "primary", state: _p.state ?? "default", txt: _p.txt ?? true, text: _p.text ?? "К проекту" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "var(--color-2)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 16,
        lineHeight: "100%",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "var(--color-2)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      opacity: 0.5,
      borderRadius: 8,
      backgroundColor: "var(--color-2)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
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
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 16,
        lineHeight: "100%",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-primary)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      opacity: 0.5,
      borderRadius: 8,
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
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-disabled)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 32,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 8px 4px 8px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 16,
        lineHeight: "100%",
        color: "var(--brand-default)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 />}</div>
      )}
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 32,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 8px 4px 8px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--brand-hover)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 />}</div>
      )}
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 32,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 8px 4px 8px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      {props.txt && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-disabled)",
        flexShrink: 0,
      }}>{props.text}</span>
      )}
      {props.icon && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconType ?? <IconBootstrapOutlineLogosArrow18 />}</div>
      )}
    </div>
  );
  const __impls = {
    // figma: Property=Primary, State=Default
    "property=primary|state=default": __body0,
    // figma: Property=Primary, State=Hover
    "property=primary|state=hover": __body1,
    // figma: Property=Primary, State=Disabled
    "property=primary|state=disabled": __body2,
    // figma: Property=Secondary, State=Default
    "property=secondary|state=default": __body3,
    // figma: Property=Secondary, State=Hover
    "property=secondary|state=hover": __body4,
    // figma: Property=Secondary, State=Disabled
    "property=secondary|state=disabled": __body5,
    // figma: Property=Tetriary, State=Default
    "property=tetriary|state=default": __body6,
    // figma: Property=Tetriary, State=Hover
    "property=tetriary|state=hover": __body7,
    // figma: Property=Tetriary, State=Disabled
    "property=tetriary|state=disabled": __body8,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Button;
