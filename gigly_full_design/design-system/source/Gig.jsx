import { Bio } from './Bio.jsx';
import { Button } from './Button.jsx';
import { Category } from './Category.jsx';
import { Status } from './Status.jsx';
import { TagBlueXS } from './TagBlueXS.jsx';

// figma node: 2802:3367 Gig (6 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "status=" + __venc(p.status);

export function Gig(_p = {}) {
  const props = { ..._p, timeline: _p.timeline ?? true, postingDate: _p.postingDate ?? true, tags: _p.tags ?? true, description: _p.description ?? true, status: _p.status ?? "открыт", bottomInfo: _p.bottomInfo ?? true, loadline3: _p.loadline3 ?? "" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 542,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.5)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "12px 16px 12px 16px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-md) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-md) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{ position: "relative", flexShrink: 0 }}>{props.icon1 ?? <Status status={"открыт"} />}</div>
        {props.postingDate && (
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "13px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "2 мин"}</span>
        )}
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--gig-bg)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0px 0px 0px 1px rgba(255,255,255,0.08), inset 0px 1px 0px 0px rgba(255,255,255,0.06), 0px 4px 24px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "16px 24px 16px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-md) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-0) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-0) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", flexGrow: 1, width: "auto" }}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm2) * 1px)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "calc(var(--spacing-0) * 1px)",
            paddingTop: "calc(var(--spacing-0) * 1px)",
            paddingRight: "calc(var(--spacing-0) * 1px)",
            paddingBottom: "calc(var(--spacing-0) * 1px)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>
            <div style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon2 ?? <Category color={"rose"} size={"s"} />}</div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "8px 0px 8px 0px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-sm) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-sm) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 656,
              fontSize: 18,
              lineHeight: "23px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
            {props.tags && (
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon3 ?? <TagBlueXS />}</div>
              <TagBlueXS
                style={{ position: "relative", width: 81, flexShrink: 0 }}
                text1={"Next.js 14"}
              />
              <TagBlueXS
                style={{ position: "relative", width: 87, flexShrink: 0 }}
                text1={"TypeScript"}
              />
            </div>
            )}
          </div>
          {props.description && (
          <span style={{
            position: "relative",
            opacity: 0.7,
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 15,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "19px",
            color: "var(--text-secondary)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
          {props.timeline && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            padding: "3px 0px 3px 0px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text4 ?? "25.08.2025"}</span>
            <div style={{
              position: "relative",
              height: 4,
              overflow: "hidden",
              borderRadius: 3000,
              backgroundColor: "rgba(159,160,164,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "flex-start",
              flexGrow: 1,
            }}>
              <div style={{
                position: "relative",
                width: 46,
                borderRadius: 3000,
                backgroundColor: "rgb(159,160,164)",
                flexGrow: 1,
              }} />
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
            }}>25.08.2025</span>
          </div>
          )}
        </div>
      </div>
      {props.bottomInfo && (
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "flex-end",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
      )}
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 542,
      borderRadius: 16,
      background: "radial-gradient(542px 332px at 50.00% 0.00%, rgba(255,255,255,0.4) 0.00%, rgba(255,255,255,0.08) 50.00%, rgba(255,255,255,0) 100.00%), linear-gradient(var(--gig-bg),var(--gig-bg))",
      boxShadow: "inset 0 0 0 1px rgba(245,158,11,0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "12px 12px 12px 12px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-sm2) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-sm2) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Status
          style={{ position: "relative", flexShrink: 0 }}
          status={"на рассмотрении"}
        />
        {props.postingDate && (
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "13px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "2 мин"}</span>
        )}
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--gig-bg)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0px 0px 0px 1px rgba(255,255,255,0.08), inset 0px 1px 0px 0px rgba(255,255,255,0.06), 0px 4px 24px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "16px 24px 16px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-md) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-0) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-0) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", flexGrow: 1, width: "auto" }}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm2) * 1px)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "calc(var(--spacing-0) * 1px)",
            paddingTop: "calc(var(--spacing-0) * 1px)",
            paddingRight: "calc(var(--spacing-0) * 1px)",
            paddingBottom: "calc(var(--spacing-0) * 1px)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>
            <div style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon1 ?? <Category color={"rose"} size={"s"} />}</div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "8px 0px 8px 0px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-sm) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-sm) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 656,
              fontSize: 18,
              lineHeight: "23px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
            {props.tags && (
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon2 ?? <TagBlueXS />}</div>
              <TagBlueXS
                style={{ position: "relative", width: 81, flexShrink: 0 }}
                text1={"Next.js 14"}
              />
              <TagBlueXS
                style={{ position: "relative", width: 87, flexShrink: 0 }}
                text1={"TypeScript"}
              />
            </div>
            )}
          </div>
          {props.description && (
          <span style={{
            position: "relative",
            opacity: 0.7,
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 15,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "19px",
            color: "var(--text-secondary)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
          {props.timeline && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            padding: "3px 0px 3px 0px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text4 ?? "25.08.2025"}</span>
            <div style={{
              position: "relative",
              height: 4,
              overflow: "hidden",
              borderRadius: 3000,
              backgroundColor: "rgba(159,160,164,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "flex-start",
              flexGrow: 1,
            }}>
              <div style={{
                position: "relative",
                width: 46,
                borderRadius: 3000,
                backgroundColor: "rgb(159,160,164)",
                flexGrow: 1,
              }} />
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
            }}>25.08.2025</span>
          </div>
          )}
        </div>
      </div>
      {props.bottomInfo && (
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "flex-end",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
      )}
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 542,
      borderRadius: 16,
      background: "radial-gradient(542px 332px at 50.00% 0.00%, rgba(245,158,11,0.4) 0.00%, rgba(245,158,11,0.08) 50.00%, rgba(245,158,11,0) 100.00%), linear-gradient(var(--gig-bg),var(--gig-bg))",
      boxShadow: "inset 0 0 0 1px rgba(59,130,246,0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "12px 12px 12px 12px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-sm2) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-sm2) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Status
          style={{ position: "relative", flexShrink: 0 }}
          status={"в работе"}
        />
        {props.postingDate && (
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "13px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "2 мин"}</span>
        )}
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--gig-bg)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0px 0px 0px 1px rgba(255,255,255,0.08), inset 0px 1px 0px 0px rgba(255,255,255,0.06), 0px 4px 24px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "16px 24px 16px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-md) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-0) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-0) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", flexGrow: 1, width: "auto" }}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm2) * 1px)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "calc(var(--spacing-0) * 1px)",
            paddingTop: "calc(var(--spacing-0) * 1px)",
            paddingRight: "calc(var(--spacing-0) * 1px)",
            paddingBottom: "calc(var(--spacing-0) * 1px)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>
            <div style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon1 ?? <Category color={"rose"} size={"s"} />}</div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "8px 0px 8px 0px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-sm) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-sm) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 656,
              fontSize: 18,
              lineHeight: "23px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
            {props.tags && (
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon2 ?? <TagBlueXS />}</div>
              <TagBlueXS
                style={{ position: "relative", width: 81, flexShrink: 0 }}
                text1={"Next.js 14"}
              />
              <TagBlueXS
                style={{ position: "relative", width: 87, flexShrink: 0 }}
                text1={"TypeScript"}
              />
            </div>
            )}
          </div>
          {props.description && (
          <span style={{
            position: "relative",
            opacity: 0.7,
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 15,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "19px",
            color: "var(--text-secondary)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
          {props.timeline && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            padding: "3px 0px 3px 0px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text4 ?? "25.08.2025"}</span>
            <div style={{
              position: "relative",
              height: 4,
              overflow: "hidden",
              borderRadius: 3000,
              backgroundColor: "rgba(159,160,164,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "flex-start",
              flexGrow: 1,
            }}>
              <div style={{
                position: "relative",
                width: 46,
                borderRadius: 3000,
                backgroundColor: "rgb(159,160,164)",
                flexGrow: 1,
              }} />
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
            }}>25.08.2025</span>
          </div>
          )}
        </div>
      </div>
      {props.bottomInfo && (
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "flex-end",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
      )}
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 542,
      borderRadius: 16,
      background: "radial-gradient(542px 332px at 50.00% 0.00%, rgba(245,158,11,0.4) 0.00%, rgba(245,158,11,0.08) 50.00%, rgba(245,158,11,0) 100.00%), linear-gradient(var(--gig-bg),var(--gig-bg))",
      boxShadow: "inset 0 0 0 1px rgba(139,92,246,0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "12px 12px 12px 12px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-sm2) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-sm2) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Status
          style={{ position: "relative", flexShrink: 0 }}
          status={"на проверке"}
        />
        {props.postingDate && (
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "13px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "2 мин"}</span>
        )}
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--gig-bg)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0px 0px 0px 1px rgba(255,255,255,0.08), inset 0px 1px 0px 0px rgba(255,255,255,0.06), 0px 4px 24px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "16px 24px 16px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-md) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-0) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-0) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", flexGrow: 1, width: "auto" }}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm2) * 1px)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "calc(var(--spacing-0) * 1px)",
            paddingTop: "calc(var(--spacing-0) * 1px)",
            paddingRight: "calc(var(--spacing-0) * 1px)",
            paddingBottom: "calc(var(--spacing-0) * 1px)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>
            <div style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon1 ?? <Category color={"rose"} size={"s"} />}</div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "8px 0px 8px 0px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-sm) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-sm) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 656,
              fontSize: 18,
              lineHeight: "23px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
            {props.tags && (
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon2 ?? <TagBlueXS />}</div>
              <TagBlueXS
                style={{ position: "relative", width: 81, flexShrink: 0 }}
                text1={"Next.js 14"}
              />
              <TagBlueXS
                style={{ position: "relative", width: 87, flexShrink: 0 }}
                text1={"TypeScript"}
              />
            </div>
            )}
          </div>
          {props.description && (
          <span style={{
            position: "relative",
            opacity: 0.7,
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 15,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "19px",
            color: "var(--text-secondary)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
          {props.timeline && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            padding: "3px 0px 3px 0px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text4 ?? "25.08.2025"}</span>
            <div style={{
              position: "relative",
              height: 4,
              overflow: "hidden",
              borderRadius: 3000,
              backgroundColor: "rgba(159,160,164,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "flex-start",
              flexGrow: 1,
            }}>
              <div style={{
                position: "relative",
                width: 46,
                borderRadius: 3000,
                backgroundColor: "rgb(159,160,164)",
                flexGrow: 1,
              }} />
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
            }}>25.08.2025</span>
          </div>
          )}
        </div>
      </div>
      {props.bottomInfo && (
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "flex-end",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
      )}
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 542,
      borderRadius: 16,
      background: "radial-gradient(542px 332px at 50.00% 0.00%, rgba(139,92,246,0.4) 0.00%, rgba(139,92,246,0.08) 50.00%, rgba(139,92,246,0) 100.00%), linear-gradient(var(--gig-bg),var(--gig-bg))",
      boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "12px 12px 12px 12px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-sm2) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-sm2) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Status
          style={{ position: "relative", flexShrink: 0 }}
          status={"завершён"}
        />
        {props.postingDate && (
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "13px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "2 мин"}</span>
        )}
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--gig-bg)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0px 0px 0px 1px rgba(255,255,255,0.08), inset 0px 1px 0px 0px rgba(255,255,255,0.06), 0px 4px 24px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "16px 24px 16px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-md) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-0) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-0) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", flexGrow: 1, width: "auto" }}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm2) * 1px)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "calc(var(--spacing-0) * 1px)",
            paddingTop: "calc(var(--spacing-0) * 1px)",
            paddingRight: "calc(var(--spacing-0) * 1px)",
            paddingBottom: "calc(var(--spacing-0) * 1px)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>
            <div style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon1 ?? <Category color={"rose"} size={"s"} />}</div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "8px 0px 8px 0px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-sm) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-sm) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 656,
              fontSize: 18,
              lineHeight: "23px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
            {props.tags && (
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon2 ?? <TagBlueXS />}</div>
              <TagBlueXS
                style={{ position: "relative", width: 81, flexShrink: 0 }}
                text1={"Next.js 14"}
              />
              <TagBlueXS
                style={{ position: "relative", width: 87, flexShrink: 0 }}
                text1={"TypeScript"}
              />
            </div>
            )}
          </div>
          {props.description && (
          <span style={{
            position: "relative",
            opacity: 0.7,
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 15,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "19px",
            color: "var(--text-secondary)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
          {props.timeline && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            padding: "3px 0px 3px 0px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text4 ?? "25.08.2025"}</span>
            <div style={{
              position: "relative",
              height: 4,
              overflow: "hidden",
              borderRadius: 3000,
              backgroundColor: "rgba(159,160,164,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "flex-start",
              flexGrow: 1,
            }}>
              <div style={{
                position: "relative",
                width: 46,
                borderRadius: 3000,
                backgroundColor: "rgb(159,160,164)",
                flexGrow: 1,
              }} />
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
            }}>25.08.2025</span>
          </div>
          )}
        </div>
      </div>
      {props.bottomInfo && (
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "flex-end",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
      )}
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 542,
      borderRadius: 16,
      background: "radial-gradient(542px 332px at 50.00% 0.00%, rgba(255,255,255,0.4) 0.00%, rgba(255,255,255,0.08) 50.00%, rgba(255,255,255,0) 100.00%), linear-gradient(var(--gig-bg),var(--gig-bg))",
      boxShadow: "inset 0 0 0 1px rgba(239,68,68,0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        padding: "12px 16px 12px 16px",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-md) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-md) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Status
          style={{ position: "relative", flexShrink: 0 }}
          status={"отклонён"}
        />
        {props.postingDate && (
        <span style={{
          position: "relative",
          fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "13px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>{props.text1 ?? "2 мин"}</span>
        )}
      </div>
      <div style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "var(--gig-bg)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0px 0px 0px 1px rgba(255,255,255,0.08), inset 0px 1px 0px 0px rgba(255,255,255,0.06), 0px 4px 24px 0px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-sm) * 1px)",
        padding: "16px 24px 16px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-md) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-md) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-0) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-0) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <Bio
            style={{ position: "relative", flexGrow: 1, width: "auto" }}
            sizeFor={"gig"}
            uSER={"company"}
          />
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm2) * 1px)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingLeft: "calc(var(--spacing-0) * 1px)",
            paddingTop: "calc(var(--spacing-0) * 1px)",
            paddingRight: "calc(var(--spacing-0) * 1px)",
            paddingBottom: "calc(var(--spacing-0) * 1px)",
            flexGrow: 1,
            alignSelf: "stretch",
          }}>
            <div style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                height: "auto",
              }}>{props.icon1 ?? <Category color={"rose"} size={"s"} />}</div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm) * 1px)",
          padding: "8px 0px 8px 0px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-0) * 1px)",
          paddingTop: "calc(var(--spacing-sm) * 1px)",
          paddingRight: "calc(var(--spacing-0) * 1px)",
          paddingBottom: "calc(var(--spacing-sm) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 656,
              fontSize: 18,
              lineHeight: "23px",
              color: "rgb(255,255,255)",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>{props.text2 ?? "Миграция аналитического дашборда на Next.js 14"}</span>
            {props.tags && (
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{ position: "relative", flexShrink: 0 }}>{props.icon2 ?? <TagBlueXS />}</div>
              <TagBlueXS
                style={{ position: "relative", width: 81, flexShrink: 0 }}
                text1={"Next.js 14"}
              />
              <TagBlueXS
                style={{ position: "relative", width: 87, flexShrink: 0 }}
                text1={"TypeScript"}
              />
            </div>
            )}
          </div>
          {props.description && (
          <span style={{
            position: "relative",
            opacity: 0.7,
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 15,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "19px",
            color: "var(--text-secondary)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>{props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."}</span>
          )}
          {props.timeline && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 12,
            padding: "3px 0px 3px 0px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text4 ?? "25.08.2025"}</span>
            <div style={{
              position: "relative",
              height: 4,
              overflow: "hidden",
              borderRadius: 3000,
              backgroundColor: "rgba(159,160,164,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "flex-start",
              flexGrow: 1,
            }}>
              <div style={{
                position: "relative",
                width: 46,
                borderRadius: 3000,
                backgroundColor: "rgb(159,160,164)",
                flexGrow: 1,
              }} />
            </div>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
            }}>25.08.2025</span>
          </div>
          )}
        </div>
      </div>
      {props.bottomInfo && (
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-md) * 1px)",
        padding: "12px 24px 12px 24px",
        justifyContent: "center",
        alignItems: "flex-end",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-sm2) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-sm2) * 1px)",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Фикс. цена</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>200 400 ₽ </span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "rgb(159,160,164)",
            flexShrink: 0,
          }}>Срок выполнения</span>
          <span style={{
            position: "relative",
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 656,
            fontSize: 15,
            lineHeight: "19px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
          }}>14 дней</span>
        </div>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          property={"primary"}
          state={"default"}
        />
      </div>
      )}
    </div>
  );
  const __impls = {
    // figma: Status=Открыт
    "status=открыт": __body0,
    // figma: Status=На рассмотрении
    "status=на рассмотрении": __body1,
    // figma: Status=В работе
    "status=в работе": __body2,
    // figma: Status=На проверке
    "status=на проверке": __body3,
    // figma: Status=Звершен
    "status=звершен": __body4,
    // figma: Status=Отклонен
    "status=отклонен": __body5,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Gig;
