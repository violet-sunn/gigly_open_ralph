import { Bio } from './Bio.jsx';
import { Button } from './Button.jsx';
import { GigFull4 } from './GigFull4.jsx';
import { GigSPECIALISTAttentionBlock } from './GigSPECIALISTAttentionBlock.jsx';
import { IconBootstrapOutlineLogosPencil } from './IconBootstrapOutlineLogosPencil.jsx';
import { MessageAttentionBlock } from './MessageAttentionBlock.jsx';
import { StatusSPECIALISTXS } from './StatusSPECIALISTXS.jsx';

// figma node: 3367:3916 attention card (12 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property=" + __venc(p.property) + '|' + "uSER=" + __venc(p.uSER);

export function AttentionCard(_p = {}) {
  const props = { ..._p, property: _p.property ?? "смена статуса", uSER: _p.uSER ?? "specialist" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(124,58,237,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(124,58,237)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(124,58,237)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "👀"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Новый статус"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigSPECIALISTAttentionBlock
          style={{
            position: "relative",
            height: 132,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          description={true}
          timeline={false}
        />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"К проекту"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(37,99,235,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(37,99,235)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(37,99,235)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "💬"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Новые сообщения"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <MessageAttentionBlock style={{
            position: "relative",
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }} />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 93, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Ответить"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(234,88,12,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(234,88,12)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(234,88,12)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "⏳"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Скоро дедлайн"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigSPECIALISTAttentionBlock style={{
            position: "relative",
            height: 126,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }} />
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text4 ?? "Остался 1 день"}</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{ position: "relative", width: 71, flexShrink: 0 }}>{props.icon1 ?? <Button icon={false} iconType={<IconBootstrapOutlineLogosPencil />} text={"Сдать"} property={"primary"} state={"default"} />}</div>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(22,163,74,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(22,163,74)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(22,163,74)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "🤝"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Заявка принята"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigSPECIALISTAttentionBlock
          style={{
            position: "relative",
            height: 146,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          category={true}
        />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 111, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Приступить"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body4 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(156,163,175,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(156,163,175)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(156,163,175)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "⛔"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Заявка отклонена"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          borderRadius: 12,
          background: "radial-gradient(252px 137px at 50.00% 0.00%, rgba(234,88,12,0.4) 0.00%, rgba(234,88,12,0.08) 46.63%, rgba(234,88,12,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05)), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
          boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm2) * 1px)",
          padding: "16px 12px 16px 12px",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-md) * 1px)",
          paddingTop: "calc(var(--spacing-md) * 1px)",
          paddingRight: "calc(var(--spacing-md) * 1px)",
          paddingBottom: "calc(var(--spacing-md) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <Bio
                style={{ position: "relative", width: 294, flexShrink: 0 }}
                info={false}
                sizeFor={"gig"}
                uSER={"company"}
              />
            </div>
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
                fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "100%",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>Миграция аналитического дашборда на Next.js 14</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 134, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Найти проекты"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body5 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(8,145,178,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(8,145,178)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(8,145,178)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "💰"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Получена оплата"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigFull4 style={{
            position: "relative",
            height: 185,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }} />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 137, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Оставить отзыв"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body6 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(239,68,68,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(239,68,68)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(239,68,68)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "👀"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Нет ответа"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          height: 156,
          borderRadius: 8,
          background: "radial-gradient(252px 156px at 50.00% 0.00%, rgba(19,121,243,0.4) 0.00%, rgba(19,121,243,0.08) 46.63%, rgba(19,121,243,0) 100.00%), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
          boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "12px 12px 12px 12px",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            height: 142,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <Bio
                style={{ position: "relative", width: 294, flexShrink: 0 }}
                verificationMark={true}
                info={false}
                sizeFor={"gig"}
                uSER={"company"}
              />
              <div style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                gap: 12,
                justifyContent: "flex-end",
                alignItems: "center",
                flexShrink: 0,
              }}>
                <StatusSPECIALISTXS style={{ position: "relative", flexShrink: 0 }} />
              </div>
            </div>
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
                fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "100%",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>Миграция аналитического дашборда на Next.js 14</span>
              <span style={{
                position: "relative",
                fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                lineHeight: "16px",
                color: "rgb(159,160,164)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 124, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"К проекту"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body7 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(59,130,246,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(59,130,246)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(59,130,246)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "💬"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Новые сообщения"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <MessageAttentionBlock style={{
            position: "relative",
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }} />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 116, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Ответить"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body8 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(245,158,11,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(245,158,11)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(245,158,11)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "⏳"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Нет заявок"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigSPECIALISTAttentionBlock style={{
            position: "relative",
            height: 150,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }} />
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "16px",
          color: "rgb(255,255,255)",
          flexShrink: 0,
          alignSelf: "stretch",
          whiteSpace: "nowrap",
        }}>{props.text4 ?? "Остался 1 день"}</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 90, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Сдать"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body9 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(139,92,246,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(139,92,246)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(139,92,246)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "🤝"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Ждёт проверки"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigSPECIALISTAttentionBlock
          style={{
            position: "relative",
            height: 170,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }}
          category={true}
        />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 132, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Приступить"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body10 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(16,185,129,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(16,185,129)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(16,185,129)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "💰"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "К оплате"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <GigFull4 style={{
            position: "relative",
            height: 209,
            flexShrink: 0,
            alignSelf: "stretch",
            width: "auto",
          }} />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 166, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Оставить отзыв"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __body11 = () => (
    <div className={props.className} style={{
      width: 280,
      height: 262,
      overflow: "hidden",
      borderRadius: 12,
      background: "radial-gradient(474.776px 1231.694px at -0.00% 100.00%, rgba(156,163,175,0.21) 0.00%, rgba(255,255,255,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05))",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), inset 4px 0px 0px 0px rgb(156,163,175)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          width: 34,
          borderRadius: 12,
          backgroundColor: "rgb(156,163,175)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "6px 6px 6px 6px",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <span style={{
            position: "relative",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 22,
            lineHeight: "100%",
            color: "rgb(0,0,0)",
            flexShrink: 0,
            alignSelf: "stretch",
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "⛔"}</span>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "12px 12px 12px 12px",
          alignItems: "center",
          boxSizing: "border-box",
          flexGrow: 1,
        }}>
          <span style={{
            position: "relative",
            fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgb(255,255,255)",
            flexGrow: 1,
            whiteSpace: "nowrap",
          }}>{props.text2 ?? "Гиг закрыт"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"NKDuy Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 400,
              fontSize: 12,
              textAlign: "right",
              lineHeight: "100%",
              color: "rgb(159,160,164)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text3 ?? "1 нед."}</span>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "0px 12px 0px 16px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          height: 161,
          borderRadius: 12,
          background: "radial-gradient(252px 161px at 50.00% 0.00%, rgba(234,88,12,0.4) 0.00%, rgba(234,88,12,0.08) 46.63%, rgba(234,88,12,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05)), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
          boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-sm2) * 1px)",
          padding: "16px 12px 16px 12px",
          justifyContent: "center",
          alignItems: "flex-start",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-md) * 1px)",
          paddingTop: "calc(var(--spacing-md) * 1px)",
          paddingRight: "calc(var(--spacing-md) * 1px)",
          paddingBottom: "calc(var(--spacing-md) * 1px)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            height: 133,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <Bio
                style={{ position: "relative", width: 294, flexShrink: 0 }}
                info={false}
                sizeFor={"gig"}
                uSER={"company"}
              />
            </div>
            <div style={{
              position: "relative",
              height: 63,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-start",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "100%",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>Миграция аналитического дашборда на Next.js 14</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "0px 12px 0px 16px",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Button
          style={{ position: "relative", width: 158, flexShrink: 0 }}
          icon={false}
          iconType={<IconBootstrapOutlineLogosPencil />}
          text={"Найти проекты"}
          property={"primary"}
          state={"default"}
        />
      </div>
    </div>
  );
  const __impls = {
    // figma: Property=Смена статуса, USER=SPECIALIST
    "property=смена статуса|uSER=specialist": __body0,
    // figma: Property=Новое сообщение, USER=SPECIALIST
    "property=новое сообщение|uSER=specialist": __body1,
    // figma: Property=Приближается дедлайн, USER=SPECIALIST
    "property=приближается дедлайн|uSER=specialist": __body2,
    // figma: Property=Заявка принята, USER=SPECIALIST
    "property=заявка принята|uSER=specialist": __body3,
    // figma: Property=Заявка отклонена, USER=SPECIALIST
    "property=заявка отклонена|uSER=specialist": __body4,
    // figma: Property=Получена оплата, USER=SPECIALIST
    "property=получена оплата|uSER=specialist": __body5,
    // figma: Property=Нет ответа, USER=COMPANY
    "property=нет ответа|uSER=company": __body6,
    // figma: Property=Новое сообщение, USER=COMPANY
    "property=новое сообщение|uSER=company": __body7,
    // figma: Property=Нет заявок, USER=COMPANY
    "property=нет заявок|uSER=company": __body8,
    // figma: Property=Ждёт проверки, USER=COMPANY
    "property=ждёт проверки|uSER=company": __body9,
    // figma: Property=Получена оплата, USER=COMPANY
    "property=получена оплата|uSER=company": __body10,
    // figma: Property=Заявка отклонена, USER=COMPANY
    "property=заявка отклонена|uSER=company": __body11,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default AttentionCard;
