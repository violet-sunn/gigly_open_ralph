// figma node: 2728:1263 section (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1);

export function Section(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "content" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 919,
      height: 734,
      borderRadius: 20,
      backgroundColor: "var(--bg-surface-level-1)",
      boxShadow: "inset 0 0 0 1px var(--border-neutral-weak)",
      display: "flex",
      flexDirection: "column",
      gap: 21,
      alignItems: "flex-start",
      position: "relative",
      color: "rgb(0,136,255)",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 21,
        padding: "20px 20px 20px 20px",
        alignItems: "flex-start",
        boxSizing: "border-box",
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
          <span style={{
            position: "relative",
            fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "28px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "Мои заказы"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            padding: "4px 5px 4px 5px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 14,
              height: 14,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                left: 1.167,
                top: 1.167,
                width: 11.667,
                height: 11.667,
                overflow: "hidden",
              }}>
                <svg width={11.667} height={11.667} viewBox="0 0 11.667 11.667" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 11.667,
                  height: 11.667,
                }}>
                  <path d={"M 11.667 5.833 L 11.167 5.833 C 11.167 8.779 8.779 11.167 5.833 11.167 L 5.833 11.667 L 5.833 12.167 C 9.331 12.167 12.167 9.331 12.167 5.833 L 11.667 5.833 Z M 5.833 11.667 L 5.833 11.167 C 2.888 11.167 0.5 8.779 0.5 5.833 L 0 5.833 L -0.5 5.833 C -0.5 9.331 2.336 12.167 5.833 12.167 L 5.833 11.667 Z M 0 5.833 L 0.5 5.833 C 0.5 2.888 2.888 0.5 5.833 0.5 L 5.833 0 L 5.833 -0.5 C 2.336 -0.5 -0.5 2.336 -0.5 5.833 L 0 5.833 Z M 5.833 0 L 5.833 0.5 C 8.779 0.5 11.167 2.888 11.167 5.833 L 11.667 5.833 L 12.167 5.833 C 12.167 2.336 9.331 -0.5 5.833 -0.5 L 5.833 0 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={3.500} height={3.500} viewBox="0 0 3.500 3.500" fill="none" style={{
                  position: "absolute",
                  left: 4.083,
                  top: 4.083,
                  width: 3.5,
                  height: 3.5,
                }}>
                  <path d={"M 3.5 2.25 C 3.776 2.25 4 2.026 4 1.75 C 4 1.474 3.776 1.25 3.5 1.25 L 3.5 1.75 L 3.5 2.25 Z M 0 1.25 C -0.276 1.25 -0.5 1.474 -0.5 1.75 C -0.5 2.026 -0.276 2.25 0 2.25 L 0 1.75 L 0 1.25 Z M 2.25 0 C 2.25 -0.276 2.026 -0.5 1.75 -0.5 C 1.474 -0.5 1.25 -0.276 1.25 0 L 1.75 0 L 2.25 0 Z M 1.25 3.5 C 1.25 3.776 1.474 4 1.75 4 C 2.026 4 2.25 3.776 2.25 3.5 L 1.75 3.5 L 1.25 3.5 Z M 3.5 1.75 L 3.5 1.25 L 1.75 1.25 L 1.75 1.75 L 1.75 2.25 L 3.5 2.25 L 3.5 1.75 Z M 1.75 1.75 L 1.75 1.25 L 0 1.25 L 0 1.75 L 0 2.25 L 1.75 2.25 L 1.75 1.75 Z M 1.75 1.75 L 2.25 1.75 L 2.25 0 L 1.75 0 L 1.25 0 L 1.25 1.75 L 1.75 1.75 Z M 1.75 1.75 L 1.25 1.75 L 1.25 3.5 L 1.75 3.5 L 2.25 3.5 L 2.25 1.75 L 1.75 1.75 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
              </div>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "100%",
              color: "rgb(0,136,255)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text2 ?? "Добавить"}</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 20,
          backgroundColor: "var(--bg-surface-level-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0px 20px 0px 20px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "20px 0px 20px 0px",
              alignItems: "flex-start",
              boxSizing: "border-box",
              flexGrow: 1,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>{props.text3 ?? "«Создание веб-страницы с использованием HTML и CSS»"}</span>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
                whiteSpace: "nowrap",
              }}>{props.text4 ?? "150 000₽"}</span>
            </div>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "relative",
                borderRadius: 10,
                backgroundColor: "rgb(51,54,67)",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "0px 5px 0px 5px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "rgb(181,181,181)",
                  flexShrink: 0,
                }}>Создан</span>
              </div>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>12.11.2002</span>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 20,
          backgroundColor: "var(--bg-surface-level-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0px 20px 0px 20px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "20px 0px 20px 0px",
              alignItems: "flex-start",
              boxSizing: "border-box",
              flexGrow: 1,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>«Создание веб HTML и CSS»</span>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>150 000₽</span>
            </div>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "relative",
                borderRadius: 10,
                backgroundColor: "var(--bg-success-weak-default)",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "0px 5px 0px 5px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                flexShrink: 0,
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "var(--text-success-default)",
                  flexShrink: 0,
                }}>В работе</span>
              </div>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>12.11.2002</span>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 20,
          backgroundColor: "var(--bg-surface-level-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0px 20px 0px 20px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "20px 0px 20px 0px",
              alignItems: "flex-start",
              boxSizing: "border-box",
              flexGrow: 1,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>«Создание веб-страницы </span>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>150 000₽</span>
            </div>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "relative",
                borderRadius: 10,
                backgroundColor: "rgb(51,54,67)",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "0px 5px 0px 5px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "rgb(181,181,181)",
                  flexShrink: 0,
                }}>Создан</span>
              </div>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>12.11.2002</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 919,
      height: 734,
      borderRadius: 20,
      background: "linear-gradient(rgba(255,255,255,0.01),rgba(255,255,255,0.01)), linear-gradient(rgb(6,8,19),rgb(6,8,19))",
      boxShadow: "inset 0 0 0 1px rgb(49,54,67)",
      display: "flex",
      flexDirection: "column",
      gap: 21,
      alignItems: "flex-start",
      position: "relative",
      color: "rgb(0,136,255)",
      ...props.style,
    }}>
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 21,
        padding: "20px 20px 20px 20px",
        alignItems: "flex-start",
        boxSizing: "border-box",
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
          <span style={{
            position: "relative",
            fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "28px",
            color: "rgb(255,255,255)",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>{props.text1 ?? "Мои заказы"}</span>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 10,
            padding: "4px 5px 4px 5px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 14,
              height: 14,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                left: 1.167,
                top: 1.167,
                width: 11.667,
                height: 11.667,
                overflow: "hidden",
              }}>
                <svg width={11.667} height={11.667} viewBox="0 0 11.667 11.667" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 11.667,
                  height: 11.667,
                }}>
                  <path d={"M 11.667 5.833 L 11.167 5.833 C 11.167 8.779 8.779 11.167 5.833 11.167 L 5.833 11.667 L 5.833 12.167 C 9.331 12.167 12.167 9.331 12.167 5.833 L 11.667 5.833 Z M 5.833 11.667 L 5.833 11.167 C 2.888 11.167 0.5 8.779 0.5 5.833 L 0 5.833 L -0.5 5.833 C -0.5 9.331 2.336 12.167 5.833 12.167 L 5.833 11.667 Z M 0 5.833 L 0.5 5.833 C 0.5 2.888 2.888 0.5 5.833 0.5 L 5.833 0 L 5.833 -0.5 C 2.336 -0.5 -0.5 2.336 -0.5 5.833 L 0 5.833 Z M 5.833 0 L 5.833 0.5 C 8.779 0.5 11.167 2.888 11.167 5.833 L 11.667 5.833 L 12.167 5.833 C 12.167 2.336 9.331 -0.5 5.833 -0.5 L 5.833 0 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={3.500} height={3.500} viewBox="0 0 3.500 3.500" fill="none" style={{
                  position: "absolute",
                  left: 4.083,
                  top: 4.083,
                  width: 3.5,
                  height: 3.5,
                }}>
                  <path d={"M 3.5 2.25 C 3.776 2.25 4 2.026 4 1.75 C 4 1.474 3.776 1.25 3.5 1.25 L 3.5 1.75 L 3.5 2.25 Z M 0 1.25 C -0.276 1.25 -0.5 1.474 -0.5 1.75 C -0.5 2.026 -0.276 2.25 0 2.25 L 0 1.75 L 0 1.25 Z M 2.25 0 C 2.25 -0.276 2.026 -0.5 1.75 -0.5 C 1.474 -0.5 1.25 -0.276 1.25 0 L 1.75 0 L 2.25 0 Z M 1.25 3.5 C 1.25 3.776 1.474 4 1.75 4 C 2.026 4 2.25 3.776 2.25 3.5 L 1.75 3.5 L 1.25 3.5 Z M 3.5 1.75 L 3.5 1.25 L 1.75 1.25 L 1.75 1.75 L 1.75 2.25 L 3.5 2.25 L 3.5 1.75 Z M 1.75 1.75 L 1.75 1.25 L 0 1.25 L 0 1.75 L 0 2.25 L 1.75 2.25 L 1.75 1.75 Z M 1.75 1.75 L 2.25 1.75 L 2.25 0 L 1.75 0 L 1.25 0 L 1.25 1.75 L 1.75 1.75 Z M 1.75 1.75 L 1.25 1.75 L 1.25 3.5 L 1.75 3.5 L 2.25 3.5 L 2.25 1.75 L 1.75 1.75 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
              </div>
            </div>
            <span style={{
              position: "relative",
              fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "100%",
              color: "rgb(0,136,255)",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>{props.text2 ?? "Добавить"}</span>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 20,
          backgroundColor: "var(--bg-surface-level-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0px 20px 0px 20px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "20px 0px 20px 0px",
              alignItems: "flex-start",
              boxSizing: "border-box",
              flexGrow: 1,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>{props.text3 ?? "«Создание веб-страницы с использованием HTML и CSS»"}</span>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
                whiteSpace: "nowrap",
              }}>{props.text4 ?? "150 000₽"}</span>
            </div>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "relative",
                borderRadius: 10,
                backgroundColor: "rgb(51,54,67)",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "0px 5px 0px 5px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "rgb(181,181,181)",
                  flexShrink: 0,
                }}>Создан</span>
              </div>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>12.11.2002</span>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 20,
          backgroundColor: "var(--bg-surface-level-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0px 20px 0px 20px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "20px 0px 20px 0px",
              alignItems: "flex-start",
              boxSizing: "border-box",
              flexGrow: 1,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>«Создание веб HTML и CSS»</span>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>150 000₽</span>
            </div>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "relative",
                borderRadius: 10,
                backgroundColor: "var(--bg-success-weak-default)",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "0px 5px 0px 5px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                flexShrink: 0,
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "var(--text-success-default)",
                  flexShrink: 0,
                }}>В работе</span>
              </div>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>12.11.2002</span>
            </div>
          </div>
        </div>
        <div style={{
          position: "relative",
          borderRadius: 20,
          backgroundColor: "var(--bg-surface-level-2)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "0px 20px 0px 20px",
          alignItems: "flex-start",
          boxSizing: "border-box",
          flexShrink: 0,
          alignSelf: "stretch",
        }}>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "20px 0px 20px 0px",
              alignItems: "flex-start",
              boxSizing: "border-box",
              flexGrow: 1,
            }}>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgb(255,255,255)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>«Создание веб-страницы </span>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>150 000₽</span>
            </div>
            <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              alignSelf: "stretch",
            }}>
              <div style={{
                position: "relative",
                borderRadius: 10,
                backgroundColor: "rgb(51,54,67)",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                padding: "0px 5px 0px 5px",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>
                <span style={{
                  position: "relative",
                  fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "rgb(181,181,181)",
                  flexShrink: 0,
                }}>Создан</span>
              </div>
              <span style={{
                position: "relative",
                fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                textAlign: "center",
                lineHeight: "24px",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
                alignSelf: "stretch",
              }}>12.11.2002</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Property 1=content
    "property1=content": __body0,
    // figma: Property 1=Variant2
    "property1=variant2": __body1,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default Section;
