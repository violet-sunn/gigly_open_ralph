import { Component } from './Component.jsx';
import { Icon } from './Icon.jsx';
import { IconBootstrapOutlineLogosPatch } from './IconBootstrapOutlineLogosPatch.jsx';

// figma node: 2931:2365 bio (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "sizeFor=" + __venc(p.sizeFor) + '|' + "uSER=" + __venc(p.uSER);

export function Bio(_p = {}) {
  const props = { ..._p, prop: _p.prop ?? true, verificationMark: _p.verificationMark ?? true, sizeFor: _p.sizeFor ?? "gig", profile: _p.profile ?? true, stars: _p.stars ?? "", info: _p.info ?? true, uSER: _p.uSER ?? "company", text: _p.text ?? "был(-а) недавно", text2: _p.text2 ?? true };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 396,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-sm2) * 1px)",
        alignItems: "center",
        flexGrow: 1,
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
            width: "calc(var(--avatar-size-sm) * 1px)",
            borderRadius: 666,
            backgroundColor: "rgb(255,255,255)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "absolute",
              left: 6,
              top: 5,
              width: 12,
              height: 15,
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: "calc(var(--font-size-label) * 1px)",
              textAlign: "center",
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "rgb(0,0,0)",
            }}>V</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 457,
            fontSize: 12,
            lineHeight: "100%",
            color: "var(--text-primary)",
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
          gap: "calc(var(--spacing-sm) * 1px)",
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
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>45</span>
        </div>
        )}
        <div style={{
          position: "relative",
          width: 14,
          height: 11,
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--spacing-xs) * 1px)",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }} />
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 396,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
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
            width: "calc(var(--avatar-size-sm) * 1px)",
            borderRadius: 666,
            backgroundColor: "rgb(255,255,255)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <span style={{
              position: "absolute",
              left: 6,
              top: 4,
              width: 12,
              height: 15,
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 556,
              fontSize: "calc(var(--font-size-label) * 1px)",
              textAlign: "center",
              lineHeight: "15px",
              letterSpacing: "0.300px",
              color: "rgb(0,0,0)",
            }}>Д</span>
          </div>
          <span style={{
            position: "relative",
            fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
            fontWeight: 457,
            fontSize: 12,
            lineHeight: "100%",
            color: "var(--text-primary)",
            flexShrink: 0,
          }}>Дмитрий</span>
          <IconBootstrapOutlineLogosPatch style={{
              position: "relative",
              width: 16,
              height: 16,
              flexShrink: 0,
              color: "rgb(255,255,255)",
            }} />
        </div>
        {props.prop && (
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
            fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 457,
            fontSize: 11,
            lineHeight: "11px",
            letterSpacing: "0.200px",
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}>45</span>
        </div>
        )}
        {props.profile && (
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}>
          <Component
            style={{ position: "relative", width: 116, flexShrink: 0 }}
            text1={"[Middle Python]"}
            size={"xs"}
          />
        </div>
        )}
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 396,
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
        width: "calc(var(--avatar-size-md) * 1px)",
        height: 32,
        borderRadius: 666,
        backgroundColor: "rgb(255,255,255)",
        flexShrink: 0,
      }}>
        <span style={{
          position: "absolute",
          left: 10,
          top: 5,
          width: 12,
          height: 23,
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 656,
          fontSize: 19.692306518554688,
          textAlign: "center",
          lineHeight: "100%",
          color: "rgb(6,8,19)",
        }}>V</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        alignItems: "flex-start",
        flexGrow: 1,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: "calc(var(--spacing-sm2) * 1px)",
          alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm) * 1px)",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 656,
              fontSize: 18,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>Vercel</span>
            <IconBootstrapOutlineLogosPatch style={{
                position: "relative",
                width: 16,
                height: 16,
                flexShrink: 0,
                color: "rgb(255,255,255)",
              }} />
          </div>
          {props.prop && (
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
              fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 457,
              fontSize: 11,
              lineHeight: "11px",
              letterSpacing: "0.200px",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>45</span>
          </div>
          )}
        </div>
        {props.text2 && (
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "100%",
          color: "rgb(159,160,164)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>был(-а) недавно</span>
        )}
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: "fit-content",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
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
        width: "calc(var(--avatar-size-md) * 1px)",
        height: 32,
        borderRadius: 666,
        backgroundColor: "rgb(255,255,255)",
        flexShrink: 0,
      }}>
        <span style={{
          position: "absolute",
          left: 9,
          top: 4,
          width: 13,
          height: 23,
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 656,
          fontSize: 19.692306518554688,
          textAlign: "center",
          lineHeight: "100%",
          color: "rgb(14,16,26)",
        }}>Д</span>
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-xs) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm) * 1px)",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <span style={{
              position: "relative",
              fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
              fontWeight: 656,
              fontSize: 18,
              textAlign: "center",
              lineHeight: "100%",
              color: "rgb(255,255,255)",
              flexShrink: 0,
            }}>Дмитрий</span>
            <IconBootstrapOutlineLogosPatch style={{
                position: "relative",
                width: 16,
                height: 16,
                flexShrink: 0,
                color: "rgb(255,255,255)",
              }} />
          </div>
          {props.prop && (
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
              fontWeight: 457,
              fontSize: 10,
              lineHeight: "10px",
              letterSpacing: "-0.020em",
              color: "var(--text-secondary)",
              flexShrink: 0,
            }}>45</span>
          </div>
          )}
          {props.profile && (
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <Component
              style={{
                position: "relative",
                width: 134,
                height: 17,
                flexShrink: 0,
              }}
              text1={"[Middle Python]"}
              size={"xs"}
            />
          </div>
          )}
        </div>
        {props.text2 && (
        <span style={{
          position: "relative",
          fontFamily: "\"Vremena Grotesk\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          fontWeight: 457,
          fontSize: 14,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
          lineHeight: "100%",
          color: "rgb(159,160,164)",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>был(-а) недавно</span>
        )}
      </div>
    </div>
  );
  const __impls = {
    // figma: size for=gig, USER=COMPANY
    "sizeFor=gig|uSER=company": __body0,
    // figma: size for=gig, USER=SPECIALIST
    "sizeFor=gig|uSER=specialist": __body1,
    // figma: size for=acc bio, USER=COMPANY
    "sizeFor=acc bio|uSER=company": __body2,
    // figma: size for=acc bio, USER=SPECIALIST
    "sizeFor=acc bio|uSER=specialist": __body3,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Bio;
