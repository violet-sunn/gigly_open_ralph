// figma node: 2962:3883 profile frame (8 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "view=" + __venc(p.view) + '|' + "state=" + __venc(p.state);

export function ProfileFrame(_p = {}) {
  const props = { ..._p, view: _p.view ?? "full", state: _p.state ?? "default" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none" style={{
        position: "relative",
        width: 48,
        height: 48,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
      }}>
        <path d={"M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        alignItems: "flex-start",
        flexGrow: 1,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "14px",
          color: "var(--text-primary)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Тимур Камальтдинов"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 457,
          fontSize: 12,
          lineHeight: "12px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Специалист"}</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none" style={{
        position: "relative",
        width: 48,
        height: 48,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
      }}>
        <path d={"M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        alignItems: "flex-start",
        flexGrow: 1,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "16px",
          letterSpacing: "-0.010em",
          color: "var(--text-primary)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Тимур Камальтдинов"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 12,
          lineHeight: "12px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Специалист"}</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none" style={{
        position: "relative",
        width: 48,
        height: 48,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
      }}>
        <path d={"M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        alignItems: "flex-start",
        flexGrow: 1,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 13,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--text-primary)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Тимур Камальтдинов"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 11,
          lineHeight: "13px",
          letterSpacing: "0.200px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Специалист"}</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "4px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "4px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg width={48} height={48} viewBox="0 0 48 48" fill="none" style={{
        position: "relative",
        width: 48,
        height: 48,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
      }}>
        <path d={"M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        alignItems: "flex-start",
        flexGrow: 1,
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 13,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--text-primary)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "Тимур Камальтдинов"}</span>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 11,
          lineHeight: "11px",
          letterSpacing: "0.200px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text2 ?? "Специалист"}</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg height={46} viewBox="0 0 46 46" fill="none" style={{
        position: "relative",
        height: 46,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <path d={"M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg height={46} viewBox="0 0 46 46" fill="none" style={{
        position: "relative",
        height: 46,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <path d={"M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      boxShadow: "0px 0px 0px 2px rgba(0,136,255,0.4)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg height={46} viewBox="0 0 46 46" fill="none" style={{
        position: "relative",
        height: 46,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <path d={"M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "4px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "4px solid var(--brand-active)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <svg height={46} viewBox="0 0 46 46" fill="none" style={{
        position: "relative",
        height: 46,
        overflow: "hidden",
        borderRadius: 6666,
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <path d={"M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={17.500} height={20.001} viewBox="0 0 17.500 20.001" fill="none" style={{
              position: "absolute",
              left: 1.25,
              top: -0.001,
              width: 17.5,
              height: 20.001,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
          <div style={{
            position: "absolute",
            left: 22,
            top: 2,
            width: 16,
            height: 16,
            borderRadius: 484.3636169433594,
            backgroundColor: "var(--color-2)",
            display: "flex",
            flexDirection: "column",
            gap: 7.272727012634277,
            padding: "2.182px 2.182px 2.182px 2.182px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 400,
              fontSize: 8.727272033691406,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>7</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          width: 40,
          height: 40,
          overflow: "hidden",
          borderRadius: 4,
          display: "flex",
          flexDirection: "row",
          padding: "4px 4px 4px 4px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-xs) * 1px)",
          paddingTop: "calc(var(--spacing-xs) * 1px)",
          paddingRight: "calc(var(--spacing-xs) * 1px)",
          paddingBottom: "calc(var(--spacing-xs) * 1px)",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 20,
            height: 20,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <svg width={8.115} height={8.115} viewBox="0 0 8.115 8.115" fill="none" style={{
              position: "absolute",
              left: 5.942,
              top: 5.943,
              width: 8.115,
              height: 8.115,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <svg width={19.999} height={19.999} viewBox="0 0 19.999 19.999" fill="none" style={{
              position: "absolute",
              left: 0.001,
              top: 0.001,
              width: 19.999,
              height: 19.999,
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: view=Full, State=Default
    "view=full|state=default": __body0,
    // figma: view=Full, State=Hover
    "view=full|state=hover": __body1,
    // figma: view=Full, State=Focus
    "view=full|state=focus": __body2,
    // figma: view=Full, State=Active
    "view=full|state=active": __body3,
    // figma: view=short, State=Default
    "view=short|state=default": __body4,
    // figma: view=short, State=Hover
    "view=short|state=hover": __body5,
    // figma: view=short, State=Focus
    "view=short|state=focus": __body6,
    // figma: view=short, State=Active
    "view=short|state=active": __body7,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default ProfileFrame;
