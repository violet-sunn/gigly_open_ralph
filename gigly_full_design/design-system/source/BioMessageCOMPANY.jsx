import { Icon } from './Icon.jsx';
import { IconBootstrapOutlineLogosPatch } from './IconBootstrapOutlineLogosPatch.jsx';

// figma node: 2931:2366 bio/message/COMPANY
export function BioMessageCOMPANY(_p = {}) {
  const props = { ..._p, prop: _p.prop ?? true, verificationMark: _p.verificationMark ?? true, profile: _p.profile ?? true, stars: _p.stars ?? "", info: _p.info ?? true, text: _p.text ?? "был(-а) недавно", text2: _p.text2 ?? true };
  return (
    <div className={props.className} style={{
      width: 370,
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 26,
          borderRadius: 666,
          backgroundColor: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "absolute",
            left: 7,
            top: 7,
            width: 12,
            height: 12,
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            textAlign: "center",
            lineHeight: "16px",
            textBox: "trim-both cap alphabetic",
            color: "rgb(0,0,0)",
          }}>V</span>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 556,
          fontSize: 12,
          lineHeight: "100%",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>Vercel</span>
        {props.verificationMark && (
        <IconBootstrapOutlineLogosPatch style={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            color: "rgb(255,255,255)",
          }} />
        )}
      </div>
      {props.prop && (
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        flexShrink: 0,
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{
              position: "relative",
              width: 12,
              height: 12,
              flexShrink: 0,
            }}>
            <Icon
              style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
              property1={"bootstrap"}
              property2={"filled"}
              property3={"star"}
            />
          </div>
          <div style={{
              position: "relative",
              width: 12,
              height: 12,
              flexShrink: 0,
            }}>
            <Icon
              style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
              property1={"bootstrap"}
              property2={"filled"}
              property3={"star"}
            />
          </div>
          <div style={{
              position: "relative",
              width: 12,
              height: 12,
              flexShrink: 0,
            }}>
            <Icon
              style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
              property1={"bootstrap"}
              property2={"filled"}
              property3={"star"}
            />
          </div>
          <div style={{
              position: "relative",
              width: 12,
              height: 12,
              flexShrink: 0,
            }}>
            <Icon
              style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
              property1={"bootstrap"}
              property2={"filled"}
              property3={"star"}
            />
          </div>
          <div style={{
              position: "relative",
              width: 12,
              height: 12,
              flexShrink: 0,
            }}>
            <Icon
              style={{ transform: "scale(0.750, 0.750)", transformOrigin: "0 0" }}
              property1={"bootstrap"}
              property2={"filled"}
              property3={"star"}
            />
          </div>
        </div>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 300,
          fontSize: 10,
          lineHeight: "10px",
          letterSpacing: "-0.020em",
          color: "rgb(255,255,255)",
          flexShrink: 0,
        }}>45</span>
      </div>
      )}
    </div>
  );
}
export default BioMessageCOMPANY;
