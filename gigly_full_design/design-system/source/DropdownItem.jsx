// figma node: 3907:6156 dropdown/item (5 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "state=" + __venc(p.state) + '|' + "selected=" + __venc(p.selected);

export function DropdownItem(_p = {}) {
  const props = { ..._p, state: _p.state ?? "default", selected: _p.selected ?? false };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 106,
      minHeight: 40,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 16px 0px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      position: "relative",
      ...props.style,
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
      }}>{props.text1 ?? "Фильтр"}</span>
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
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 106,
      minHeight: 40,
      backgroundColor: "var(--surface-tetriary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 16px 0px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      position: "relative",
      ...props.style,
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
      }}>{props.text1 ?? "Фильтр"}</span>
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
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 106,
      minHeight: 40,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 16px 0px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      position: "relative",
      ...props.style,
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
      }}>{props.text1 ?? "Фильтр"}</span>
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
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 106,
      minHeight: 40,
      backgroundColor: "var(--surface-tetriary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 16px 0px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      position: "relative",
      ...props.style,
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
      }}>{props.text1 ?? "Фильтр"}</span>
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
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 106,
      minHeight: 40,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 16px 0px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      position: "relative",
      ...props.style,
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
        color: "var(--text-disabled)",
        flexGrow: 1,
      }}>{props.text1 ?? "Фильтр"}</span>
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
  );
  const __impls = {
    // figma: State=Default, Selected=no
    "state=default|selected=false": __body0,
    // figma: State=Hover, Selected=no
    "state=hover|selected=false": __body1,
    // figma: State=Default, Selected=yes
    "state=default|selected=true": __body2,
    // figma: State=Hover, Selected=yes
    "state=hover|selected=true": __body3,
    // figma: State=Disabled, Selected=no
    "state=disabled|selected=false": __body4,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default DropdownItem;
