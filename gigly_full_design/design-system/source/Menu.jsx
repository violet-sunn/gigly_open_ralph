import { IconBootstrapOutlineLogosJournals } from './IconBootstrapOutlineLogosJournals.jsx';
import { Menupage } from './Menupage.jsx';

// figma node: 2802:3444 Menu (14 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "shorten=" + __venc(p.shorten) + '|' + "activeTab=" + __venc(p.activeTab);

export function Menu(_p = {}) {
  const props = { ..._p, shorten: _p.shorten ?? false, activeTab: _p.activeTab ?? "0" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <IconBootstrapOutlineLogosJournals style={{
                position: "relative",
                width: 16,
                height: 16,
                flexShrink: 0,
                color: "rgb(255,255,255)",
              }} />
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          text1={"5"}
          shorten={false}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>7</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 16,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 13,
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          text1={"5"}
          shorten={false}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>7</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 16,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 13,
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          text1={"5"}
          shorten={false}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>7</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 16,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          page={"Мои гиги"}
          shorten={false}
          state={"active"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>7</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
      </div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 16,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          text1={"5"}
          shorten={false}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 13,
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
      </div>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 16,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          text1={"5"}
          shorten={false}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>7</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 13,
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
      </div>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 16,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Дашборд</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Поиск</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          text1={"5"}
          shorten={false}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.931} viewBox="0 0 16 14.931" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 1,
                width: 16,
                height: 14.931,
                color: "var(--text-primary)",
              }}>
                <path d={"M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Чаты</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>7</span>
        </div>
      </div>
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={16} height={14.719} viewBox="0 0 16 14.719" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 0.281,
                width: 16,
                height: 14.719,
                color: "var(--text-primary)",
              }}>
                <path d={"M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 18,
              lineHeight: "100%",
              letterSpacing: "0.010em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>Финансы</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>0</span>
        </div>
        <div style={{
          position: "relative",
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
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
                position: "absolute",
                left: 1,
                top: 0,
                width: 14,
                height: 16,
                color: "var(--text-primary)",
              }}>
                <path d={"M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: 13,
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}>Споры</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "var(--text-primary)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "var(--text-primary)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "var(--text-primary)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "var(--text-primary)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"active"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "var(--text-primary)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "var(--text-primary)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body12 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "var(--text-primary)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "var(--text-primary)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __body13 = () => (
    <div className={props.className} style={{
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Menupage
          style={{
            position: "relative",
            height: 32,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          shorten={true}
          state={"default"}
        />
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>6</span>
        </div>
        <div style={{
          position: "relative",
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
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>
            <svg width={14} height={16} viewBox="0 0 14 16" fill="none" style={{
              position: "absolute",
              left: 1,
              top: 0,
              width: 14,
              height: 16,
              color: "var(--text-primary)",
            }}>
              <path d={"M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={3} height={8} viewBox="0 0 3 8" fill="none" style={{
              position: "absolute",
              left: 0,
              top: 5,
              width: 3,
              height: 8,
              color: "var(--text-primary)",
            }}>
              <path d={"M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "17px",
            color: "var(--brand-default)",
            flexShrink: 0,
          }}>6</span>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: shorten=no, Active tab=0
    "shorten=false|activeTab=0": __body0,
    // figma: shorten=no, Active tab=1
    "shorten=false|activeTab=1": __body1,
    // figma: shorten=no, Active tab=2
    "shorten=false|activeTab=2": __body2,
    // figma: shorten=no, Active tab=3
    "shorten=false|activeTab=3": __body3,
    // figma: shorten=no, Active tab=4
    "shorten=false|activeTab=4": __body4,
    // figma: shorten=no, Active tab=5
    "shorten=false|activeTab=5": __body5,
    // figma: shorten=no, Active tab=6
    "shorten=false|activeTab=6": __body6,
    // figma: shorten=yes, Active tab=0
    "shorten=true|activeTab=0": __body7,
    // figma: shorten=yes, Active tab=1
    "shorten=true|activeTab=1": __body8,
    // figma: shorten=yes, Active tab=2
    "shorten=true|activeTab=2": __body9,
    // figma: shorten=yes, Active tab=3
    "shorten=true|activeTab=3": __body10,
    // figma: shorten=yes, Active tab=4
    "shorten=true|activeTab=4": __body11,
    // figma: shorten=yes, Active tab=5
    "shorten=true|activeTab=5": __body12,
    // figma: shorten=yes, Active tab=6
    "shorten=true|activeTab=6": __body13,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Menu;
