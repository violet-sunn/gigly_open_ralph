import { IconBootstrapOutlineLogosQuestion6 } from './IconBootstrapOutlineLogosQuestion6.jsx';

// figma node: 3857:5793 massage (3 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "shorten=" + __venc(p.shorten) + '|' + "state=" + __venc(p.state);

export function Massage(_p = {}) {
  const props = { ..._p, shorten: _p.shorten ?? false, state: _p.state ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 235,
      borderRadius: 12,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      padding: "24px 24px 24px 24px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-lg) * 1px)",
      paddingTop: "calc(var(--spacing-lg) * 1px)",
      paddingRight: "calc(var(--spacing-lg) * 1px)",
      paddingBottom: "calc(var(--spacing-lg) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--spacing-sm) * 1px)",
          alignItems: "center",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
              position: "relative",
              width: 20,
              height: 20,
              flexShrink: 0,
              color: "var(--brand-default)",
            }}>{props.icon1 ?? <IconBootstrapOutlineLogosQuestion6 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 656,
            fontSize: 18,
            lineHeight: "20px",
            color: "var(--text-primary)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "Поддержка"}</span>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 12,
          lineHeight: "12px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.text2 ?? "Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться."}</span>
      </div>
      <div style={{
        position: "relative",
        height: 35,
        borderRadius: 4,
        backgroundColor: "var(--surface-tetriary)",
        borderTop: "1px solid var(--brand-default)",
        borderRight: "2px solid var(--brand-default)",
        borderBottom: "1px solid var(--brand-default)",
        borderLeft: "1px solid var(--brand-default)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "8px 12px 8px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-sm2) * 1px)",
        paddingTop: "calc(var(--spacing-sm) * 1px)",
        paddingRight: "calc(var(--spacing-sm2) * 1px)",
        paddingBottom: "calc(var(--spacing-sm) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 16,
          height: 16,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <svg width={16.001} height={15.998} viewBox="0 0 16.001 15.998" fill="none" style={{
            position: "absolute",
            left: -0.001,
            top: 0.002,
            width: 16.001,
            height: 15.998,
            color: "var(--text-primary)",
          }}>
            <path d={"M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 14,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "100%",
          color: "var(--text-secondary)",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>Что случилось?</span>
        <div style={{
          position: "relative",
          width: 16,
          height: 16,
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <svg width={15.705} height={15.703} viewBox="0 0 15.705 15.703" fill="none" style={{
            position: "absolute",
            left: 0.295,
            top: 0.001,
            width: 15.705,
            height: 15.703,
            color: "rgb(255,255,255)",
          }}>
            <path d={"M 15.559 0.145 C 15.628 0.215 15.676 0.303 15.695 0.399 C 15.715 0.495 15.706 0.594 15.669 0.685 L 9.85 15.232 C 9.799 15.36 9.713 15.472 9.603 15.554 C 9.492 15.637 9.361 15.687 9.224 15.7 C 9.086 15.713 8.948 15.688 8.824 15.627 C 8.7 15.566 8.595 15.473 8.521 15.356 L 5.343 10.361 L 0.348 7.183 C 0.232 7.109 0.138 7.004 0.077 6.88 C 0.016 6.756 -0.01 6.618 0.003 6.48 C 0.016 6.343 0.067 6.211 0.149 6.101 C 0.232 5.99 0.344 5.904 0.472 5.853 L 15.019 0.036 C 15.11 0 15.21 -0.009 15.306 0.01 C 15.402 0.03 15.49 0.077 15.559 0.146 L 15.559 0.145 Z M 6.341 10.069 L 9.102 14.407 L 13.835 2.575 L 6.341 10.069 Z M 13.128 1.868 L 1.296 6.601 L 5.635 9.361 L 13.129 1.868 L 13.128 1.868 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 78,
      height: 78,
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      padding: "24px 24px 24px 24px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-lg) * 1px)",
      paddingTop: "calc(var(--spacing-lg) * 1px)",
      paddingRight: "calc(var(--spacing-lg) * 1px)",
      paddingBottom: "calc(var(--spacing-lg) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--spacing-sm) * 1px)",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
              position: "relative",
              width: 24,
              height: 24,
              flexShrink: 0,
              color: "var(--brand-default)",
            }}>{props.icon1 ?? <IconBootstrapOutlineLogosQuestion6 style={{ transform: "scale(1.500, 1.500)", transformOrigin: "0 0" }} />}</div>
        </div>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      borderRadius: 12,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        width: 78,
        height: 78,
        borderRadius: 8,
        backgroundColor: "var(--surface-secondary)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "24px 24px 24px 24px",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-lg) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-lg) * 1px)",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
              position: "relative",
              width: 24,
              height: 24,
              flexShrink: 0,
              color: "var(--brand-default)",
            }}>{props.icon1 ?? <IconBootstrapOutlineLogosQuestion6 style={{ transform: "scale(1.500, 1.500)", transformOrigin: "0 0" }} />}</div>
        </div>
      </div>
      <div style={{
        position: "relative",
        width: 180,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "var(--surface-elevated)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        padding: "8px 16px 8px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-md) * 1px)",
        paddingTop: "calc(var(--spacing-sm) * 1px)",
        paddingRight: "calc(var(--spacing-md) * 1px)",
        paddingBottom: "calc(var(--spacing-sm) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 18,
          lineHeight: "23px",
          color: "var(--text-primary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Поддержка"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 13,
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>{props.text2 ?? "Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться."}</span>
      </div>
    </div>
  );
  const __impls = {
    // figma: shorten=no, State=Default
    "shorten=false|state=default": __body0,
    // figma: shorten=yes, State=Default
    "shorten=true|state=default": __body1,
    // figma: shorten=yes, State=Hover
    "shorten=true|state=hover": __body2,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Massage;
