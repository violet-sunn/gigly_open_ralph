import { Icon2 } from './Icon2.jsx';

// figma node: 3138:3148 check field
export function CheckField(_p = {}) {
  const props = { ..._p, list1Txt: _p.list1Txt ?? "list 1 txt", list2: _p.list2 ?? true, list2Txt: _p.list2Txt ?? "list 2 txt" };
  return (
    <div className={props.className} style={{
      width: 1296,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        height: 40,
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.icon1 ?? <Icon2 property1={"bootstrap"} property2={"outline & logos"} property3={"circle"} />}</div>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexGrow: 1,
        }}>{props.list1Txt}</span>
      </div>
      {props.list2 && (
      <div style={{
        position: "relative",
        height: 40,
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        gap: 12,
        padding: "6px 12px 6px 12px",
        alignItems: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
          }}>{props.icon2 ?? <Icon2 property1={"bootstrap"} property2={"outline & logos"} property3={"check-circle"} />}</div>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 500,
          fontSize: 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexGrow: 1,
        }}>{props.list2Txt}</span>
      </div>
      )}
    </div>
  );
}
export default CheckField;
