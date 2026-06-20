import { ButtonIcon } from './ButtonIcon.jsx';
import { InputField } from './InputField.jsx';
import { SearchFilters } from './SearchFilters.jsx';
import { Switcher2 } from './Switcher2.jsx';

// figma node: 3024:2775 HEADER (3 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "type=" + __venc(p.type) + '|' + "collapsed=" + __venc(p.collapsed);

export function HEADER(_p = {}) {
  const props = { ..._p, search: _p.search ?? true, type: _p.type ?? "header 1", button: _p.button ?? true, collapsed: _p.collapsed ?? false, switcher: _p.switcher ?? false, counter: _p.counter ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 1213,
      backgroundColor: "rgba(255,255,255,0.01)",
      backdropFilter: "blur(20px)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-lg) * 1px)",
      padding: "32px 32px 32px 32px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-xl) * 1px)",
      paddingTop: "calc(var(--spacing-xl) * 1px)",
      paddingRight: "calc(var(--spacing-xl) * 1px)",
      paddingBottom: "calc(var(--spacing-xl) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        borderRadius: 4,
        borderTop: "2px solid var(--color-2)",
        borderRight: "2px solid var(--color-2)",
        borderBottom: "2px solid var(--color-2)",
        borderLeft: "4px solid var(--color-2)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "0px 16px 0px 16px",
        justifyContent: "flex-end",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 600,
          fontSize: 32,
          lineHeight: "37px",
          letterSpacing: "-0.500px",
          color: "rgb(255,255,255)",
          flexGrow: 1,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "ДАШБОРД"}</span>
        {props.button && (
        <div style={{
            position: "relative",
            width: 40,
            height: 40,
            flexShrink: 0,
          }}>{props.icon1 ?? <ButtonIcon state={"default"} bG={true} />}</div>
        )}
      </div>
      {props.search && (
      <SearchFilters style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }} />
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 1386,
      backgroundColor: "rgba(255,255,255,0.01)",
      backdropFilter: "blur(100px)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-lg) * 1px)",
      padding: "32px 32px 32px 32px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-xl) * 1px)",
      paddingTop: "calc(var(--spacing-xl) * 1px)",
      paddingRight: "calc(var(--spacing-xl) * 1px)",
      paddingBottom: "calc(var(--spacing-xl) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        borderRadius: 4,
        borderTop: "2px solid var(--color-2)",
        borderRight: "2px solid var(--color-2)",
        borderBottom: "2px solid var(--color-2)",
        borderLeft: "4px solid var(--color-2)",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "0px 16px 0px 16px",
        justifyContent: "flex-end",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 600,
          fontSize: 32,
          lineHeight: "37px",
          letterSpacing: "-0.500px",
          color: "rgb(255,255,255)",
          flexGrow: 1,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "ДАШБОРД"}</span>
        {props.button && (
        <div style={{
            position: "relative",
            width: 40,
            height: 40,
            flexShrink: 0,
          }}>{props.icon1 ?? <ButtonIcon state={"default"} bG={true} />}</div>
        )}
      </div>
      {props.search && (
      <SearchFilters style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }} />
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 1213,
      backgroundColor: "rgba(255,255,255,0.01)",
      backdropFilter: "blur(100px)",
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
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        alignItems: "center",
        paddingLeft: "calc(var(--spacing-0) * 1px)",
        paddingTop: "calc(var(--spacing-0) * 1px)",
        paddingRight: "calc(var(--spacing-0) * 1px)",
        paddingBottom: "calc(var(--spacing-0) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 500,
            fontSize: 24,
            lineHeight: "29px",
            letterSpacing: "-0.300px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "Сообщения"}</span>
          {props.counter && (
          <div style={{
            position: "relative",
            minWidth: 22,
            maxWidth: null,
            maxHeight: 32,
            borderRadius: 4,
            backgroundColor: "var(--brand-default)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "4px 4px 4px 4px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            paddingLeft: "calc(var(--spacing-xs) * 1px)",
            paddingTop: "calc(var(--spacing-xs) * 1px)",
            paddingRight: "calc(var(--spacing-xs) * 1px)",
            paddingBottom: "calc(var(--spacing-xs) * 1px)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 14,
              textAlign: "center",
              lineHeight: "17px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text2 ?? "6"}</span>
          </div>
          )}
        </div>
        {props.button && (
        <div style={{
            position: "relative",
            width: 40,
            height: 40,
            flexShrink: 0,
          }}>{props.icon1 ?? <ButtonIcon state={"default"} bG={true} />}</div>
        )}
      </div>
      {props.switcher && (
      <Switcher2
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        activeTab={"0"}
      />
      )}
      {props.search && (
      <InputField
        style={{
          position: "relative",
          height: 40,
          flexShrink: 0,
          alignSelf: "stretch",
          width: "auto",
        }}
        state={"default"}
      />
      )}
    </div>
  );
  const __impls = {
    // figma: type=Header 1, Collapsed=yes
    "type=header 1|collapsed=true": __body0,
    // figma: type=type3, Collapsed=no
    "type=type3|collapsed=false": __body1,
    // figma: type=Header 2, Collapsed=no
    "type=header 2|collapsed=false": __body2,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default HEADER;
