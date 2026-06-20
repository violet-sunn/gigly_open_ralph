import { Dropdown } from './Dropdown.jsx';
import { IconBootstrapOutlineLogosChevron16 } from './IconBootstrapOutlineLogosChevron16.jsx';
import { IconBootstrapOutlineLogosFilter2 } from './IconBootstrapOutlineLogosFilter2.jsx';

// figma node: 2826:2529 Filter (7 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + '|' + "expand=" + __venc(p.expand) + '|' + "selected=" + __venc(p.selected);

export function Filter(_p = {}) {
  const props = { ..._p, state: _p.state ?? "default", text: _p.text ?? true, expand: _p.expand ?? false, iconR: _p.iconR ?? true, iconL: _p.iconL ?? true, selected: _p.selected ?? false };
  const __body0 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.iconL && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconLType ?? <IconBootstrapOutlineLogosFilter2 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.text && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 12,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "20px",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>{props.text1 ?? "Фильтр"}</span>
      )}
      {props.iconR && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconRType ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.iconL && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconLType ?? <IconBootstrapOutlineLogosFilter2 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.text && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 12,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "14px",
        color: "var(--text-secondary)",
        flexShrink: 0,
      }}>{props.text1 ?? "Фильтр"}</span>
      )}
      {props.iconR && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconRType ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
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
        borderRadius: 8,
        backgroundColor: "var(--surface-tetriary)",
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
        {props.iconL && (
        <div style={{
            position: "relative",
            width: 20,
            height: 20,
            flexShrink: 0,
            color: "var(--text-primary)",
          }}>{props.iconLType ?? <IconBootstrapOutlineLogosFilter2 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
        )}
        {props.text && (
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 13,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--text-primary)",
          flexShrink: 0,
        }}>{props.text1 ?? "Фильтр"}</span>
        )}
        {props.iconR && (
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            transform: "matrix(1,0,0,-1,0,0)",
            flexShrink: 0,
            color: "var(--brand-default)",
          }}>{props.iconRType ?? <IconBootstrapOutlineLogosChevron16 />}</div>
        )}
      </div>
      <Dropdown
        style={{
          position: "relative",
          height: 96,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        property1={"default"}
      />
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.iconL && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "var(--brand-default)",
        }}>{props.iconLType ?? <IconBootstrapOutlineLogosFilter2 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.text && (
      <span style={{
        position: "relative",
        fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
        fontWeight: 556,
        fontSize: 12,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "14px",
        color: "var(--brand-default)",
        flexShrink: 0,
      }}>{props.text1 ?? "Фильтр"}</span>
      )}
      {props.iconR && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconRType ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      )}
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.iconL && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "var(--brand-default)",
        }}>{props.iconLType ?? <IconBootstrapOutlineLogosFilter2 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.text && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--brand-default)",
        flexShrink: 0,
      }}>{props.text1 ?? "Фильтр"}</span>
      )}
      {props.iconR && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "rgb(255,255,255)",
        }}>{props.iconRType ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      )}
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
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
        minHeight: 40,
        overflow: "hidden",
        borderRadius: 8,
        backgroundColor: "var(--surface-tetriary)",
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
            color: "var(--brand-default)",
          }}>
            <path d={"M 10 18.75 C 7.679 18.75 5.454 17.828 3.813 16.187 C 2.172 14.546 1.25 12.321 1.25 10 C 1.25 7.679 2.172 5.454 3.813 3.813 C 5.454 2.172 7.679 1.25 10 1.25 C 12.321 1.25 14.546 2.172 16.187 3.813 C 17.828 5.454 18.75 7.679 18.75 10 C 18.75 12.321 17.828 14.546 16.187 16.187 C 14.546 17.828 12.321 18.75 10 18.75 Z M 10 20 C 12.652 20 15.196 18.946 17.071 17.071 C 18.946 15.196 20 12.652 20 10 C 20 7.348 18.946 4.804 17.071 2.929 C 15.196 1.054 12.652 0 10 0 C 7.348 0 4.804 1.054 2.929 2.929 C 1.054 4.804 0 7.348 0 10 C 0 12.652 1.054 15.196 2.929 17.071 C 4.804 18.946 7.348 20 10 20 L 10 20 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
          <svg width={12.500} height={8.750} viewBox="0 0 12.500 8.750" fill="none" style={{
            position: "absolute",
            left: 3.75,
            top: 6.25,
            width: 12.5,
            height: 8.75,
            color: "var(--brand-default)",
          }}>
            <path d={"M 5 8.125 C 5 7.959 5.066 7.8 5.183 7.683 C 5.3 7.566 5.459 7.5 5.625 7.5 L 6.875 7.5 C 7.041 7.5 7.2 7.566 7.317 7.683 C 7.434 7.8 7.5 7.959 7.5 8.125 C 7.5 8.291 7.434 8.45 7.317 8.567 C 7.2 8.684 7.041 8.75 6.875 8.75 L 5.625 8.75 C 5.459 8.75 5.3 8.684 5.183 8.567 C 5.066 8.45 5 8.291 5 8.125 Z M 2.5 4.375 C 2.5 4.209 2.566 4.05 2.683 3.933 C 2.8 3.816 2.959 3.75 3.125 3.75 L 9.375 3.75 C 9.541 3.75 9.7 3.816 9.817 3.933 C 9.934 4.05 10 4.209 10 4.375 C 10 4.541 9.934 4.7 9.817 4.817 C 9.7 4.934 9.541 5 9.375 5 L 3.125 5 C 2.959 5 2.8 4.934 2.683 4.817 C 2.566 4.7 2.5 4.541 2.5 4.375 Z M 0 0.625 C 0 0.459 0.066 0.3 0.183 0.183 C 0.3 0.066 0.459 0 0.625 0 L 11.875 0 C 12.041 0 12.2 0.066 12.317 0.183 C 12.434 0.3 12.5 0.459 12.5 0.625 C 12.5 0.791 12.434 0.95 12.317 1.067 C 12.2 1.184 12.041 1.25 11.875 1.25 L 0.625 1.25 C 0.459 1.25 0.3 1.184 0.183 1.067 C 0.066 0.95 0 0.791 0 0.625 Z"} fill="currentColor" fillRule="nonzero" />
          </svg>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 556,
          fontSize: 13,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "15px",
          letterSpacing: "0.300px",
          color: "var(--brand-default)",
          flexShrink: 0,
        }}>{props.text1 ?? "Фильтр"}</span>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            transform: "matrix(1,0,0,-1,0,0)",
            flexShrink: 0,
            color: "var(--brand-default)",
          }}>{props.icon2 ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      </div>
      <div style={{
        position: "relative",
        height: 96,
        borderRadius: 8,
        backgroundColor: "var(--surface-elevated)",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        padding: "8px 0px 8px 0px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        gap: "calc(var(--spacing-0) * 1px)",
        paddingTop: "calc(var(--spacing-sm) * 1px)",
        paddingBottom: "calc(var(--spacing-sm) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          minHeight: 40,
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "0px 16px 0px 16px",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-md) * 1px)",
          paddingRight: "calc(var(--spacing-md) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 556,
            fontSize: 13,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "15px",
            letterSpacing: "0.300px",
            color: "var(--text-primary)",
            flexGrow: 1,
          }}>Фильтр</span>
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
              color: "var(--color-2)",
            }}>
              <path d={"M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
            <div style={{
              position: "absolute",
              left: 4,
              top: 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "var(--color-2)",
            }} />
          </div>
        </div>
        <div style={{
          position: "relative",
          minHeight: 40,
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "0px 16px 0px 16px",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-md) * 1px)",
          paddingRight: "calc(var(--spacing-md) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 556,
            fontSize: 13,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "15px",
            letterSpacing: "0.300px",
            color: "var(--text-primary)",
            flexGrow: 1,
          }}>Фильтр</span>
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
              color: "rgb(255,255,255)",
            }}>
              <path d={"M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z"} fill="currentColor" fillRule="nonzero" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      minHeight: 40,
      opacity: 0.5,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
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
      position: "relative",
      ...props.style,
    }}>
      {props.iconL && (
      <div style={{
          position: "relative",
          width: 20,
          height: 20,
          flexShrink: 0,
          color: "var(--text-disabled)",
        }}>{props.iconLType ?? <IconBootstrapOutlineLogosFilter2 style={{ transform: "scale(1.250, 1.250)", transformOrigin: "0 0" }} />}</div>
      )}
      {props.text && (
      <span style={{
        position: "relative",
        fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        fontWeight: 556,
        fontSize: 13,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "15px",
        letterSpacing: "0.300px",
        color: "var(--text-disabled)",
        flexShrink: 0,
      }}>{props.text1 ?? "Фильтр"}</span>
      )}
      {props.iconR && (
      <div style={{
          position: "relative",
          width: 16,
          height: 16,
          flexShrink: 0,
          color: "var(--text-disabled)",
        }}>{props.iconRType ?? <IconBootstrapOutlineLogosChevron16 />}</div>
      )}
    </div>
  );
  const __impls = {
    // figma: State=Default, Expand=no, Selected=no
    "state=default|expand=false|selected=false": __body0,
    // figma: State=Hover, Expand=no, Selected=no
    "state=hover|expand=false|selected=false": __body1,
    // figma: State=Default, Expand=yes, Selected=no
    "state=default|expand=true|selected=false": __body2,
    // figma: State=Default, Expand=no, Selected=yes
    "state=default|expand=false|selected=true": __body3,
    // figma: State=Hover, Expand=no, Selected=yes
    "state=hover|expand=false|selected=true": __body4,
    // figma: State=Default, Expand=yes, Selected=yes
    "state=default|expand=true|selected=true": __body5,
    // figma: State=Disabled, Expand=no, Selected=no
    "state=disabled|expand=false|selected=false": __body6,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Filter;
