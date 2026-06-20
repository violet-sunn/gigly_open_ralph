import { HH1BLOCK } from './HH1BLOCK.jsx';
import { Massage } from './Massage.jsx';
import { Menu } from './Menu.jsx';
import { Notification } from './Notification.jsx';
import { ProfileFrame } from './ProfileFrame.jsx';

// figma node: 2802:4051 Side bar (4 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1) + '|' + "noti=" + __venc(p.noti);

export function SideBar(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "full", noti: _p.noti ?? false };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 283,
      height: 982,
      overflow: "hidden",
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 982,
        backgroundColor: "var(--surface-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-4xl) * 1px)",
        padding: "32px 24px 32px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-xl) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-xl) * 1px)",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-3xl) * 1px)",
          alignItems: "flex-start",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 235,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            padding: "0px 12px 0px 12px",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 136,
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div style={{
                position: "relative",
                width: 25.658,
                height: 29,
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <svg width={14.708} height={14.581} viewBox="0 0 14.708 14.581" fill="none" style={{
                  position: "absolute",
                  left: 10.949,
                  top: 14.419,
                  width: 14.708,
                  height: 14.581,
                }}>
                  <path d={"M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.494} height={28.838} viewBox="0 0 25.494 28.838" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 25.494,
                  height: 28.838,
                }}>
                  <path d={"M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
              </div>
              <div style={{
                position: "relative",
                width: 96.747,
                height: 29,
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <svg width={18.304} height={28.838} viewBox="0 0 18.304 28.838" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 18.304,
                  height: 28.838,
                }}>
                  <path d={"M 0 25.436 L 7.354 25.436 L 7.354 3.564 L 0 3.564 L 0 0 L 18.304 0 L 18.304 3.564 L 10.949 3.564 L 10.949 25.274 L 18.304 25.274 L 18.304 28.838 L 0 28.838 L 0 25.436 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.658} height={28.838} viewBox="0 0 25.658 28.838" fill="none" style={{
                  position: "absolute",
                  left: 21.899,
                  top: 0,
                  width: 25.658,
                  height: 28.838,
                }}>
                  <path d={"M 0 3.564 L 1.798 3.564 C 3.105 3.564 3.595 2.916 3.595 1.782 L 3.595 0 L 21.899 0 L 21.899 1.782 C 21.899 3.078 22.553 3.564 23.696 3.564 L 25.658 3.564 L 25.658 10.855 L 22.062 10.855 L 22.062 5.508 C 22.062 4.212 21.409 3.726 20.265 3.726 L 5.72 3.726 C 4.412 3.726 3.922 4.374 3.922 5.508 L 3.922 23.654 C 3.922 24.95 4.576 25.436 5.72 25.436 L 16.669 25.436 C 17.977 25.436 18.467 24.788 18.467 23.654 L 18.467 21.872 L 22.062 21.872 L 22.062 18.307 L 10.949 18.307 L 10.949 14.419 L 25.658 14.419 L 25.658 28.838 L 22.062 28.838 L 22.062 25.274 L 20.265 25.274 C 18.957 25.274 18.467 25.922 18.467 27.056 L 18.467 28.838 L 3.922 28.838 L 3.922 27.056 C 3.922 25.76 3.268 25.274 2.125 25.274 L 0.327 25.274 L 0.327 3.564 L 0 3.564 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={18.140} height={29} viewBox="0 0 18.140 29" fill="none" style={{
                  position: "absolute",
                  left: 52.949,
                  top: 0,
                  width: 18.14,
                  height: 29,
                }}>
                  <path d={"M 0 0 L 3.595 0 L 3.595 25.436 L 18.14 25.436 L 18.14 29 L 0 29 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.494} height={29} viewBox="0 0 25.494 29" fill="none" style={{
                  position: "absolute",
                  left: 71.253,
                  top: 0,
                  width: 25.494,
                  height: 29,
                }}>
                  <path d={"M 0 0 L 3.595 0 L 3.595 5.508 C 3.595 6.804 4.249 7.291 5.393 7.291 L 7.354 7.291 L 7.354 12.799 C 7.354 14.095 8.008 14.581 9.152 14.581 L 16.506 14.581 C 17.813 14.581 18.303 13.933 18.303 12.799 L 18.303 7.291 L 20.101 7.291 C 21.409 7.291 21.899 6.642 21.899 5.508 L 21.899 0 L 25.494 0 L 25.494 7.291 L 23.696 7.291 C 22.389 7.291 21.899 7.939 21.899 9.073 L 21.899 14.581 L 20.101 14.581 C 18.794 14.581 18.303 15.229 18.303 16.363 L 18.303 18.145 L 14.708 18.145 L 14.708 29 L 11.113 29 L 11.113 18.145 L 7.354 18.145 L 7.354 16.363 C 7.354 15.067 6.7 14.581 5.556 14.581 L 3.759 14.581 L 3.759 9.073 C 3.759 7.777 3.105 7.291 1.961 7.291 L 0.163 7.291 L 0.163 0 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
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
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 1.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 6.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{
            position: "relative",
            width: 235,
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--spacing-xl) * 1px)",
            alignItems: "flex-start",
            flexShrink: 0,
          }}>
            <ProfileFrame
              style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                width: "auto",
              }}
              view={"full"}
              state={"default"}
            />
            <Menu
              style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                width: "auto",
              }}
              shorten={false}
              activeTab={"0"}
            />
          </div>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <Massage
            style={{ position: "relative", width: 235, flexShrink: 0 }}
            shorten={false}
            state={"default"}
          />
          <div style={{
            position: "relative",
            width: 40,
            height: 40,
            overflow: "hidden",
            borderRadius: 4,
            backgroundColor: "var(--surface-secondary)",
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
              <svg width={13.750} height={15} viewBox="0 0 13.750 15" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 2.5,
                width: 13.75,
                height: 15,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
              <svg width={13.751} height={8.752} viewBox="0 0 13.751 8.752" fill="none" style={{
                position: "absolute",
                left: 6.25,
                top: 5.624,
                width: 13.751,
                height: 8.752,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 126,
      height: 982,
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 126,
        height: 982,
        backgroundColor: "var(--surface-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-4xl) * 1px)",
        padding: "32px 24px 32px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-xl) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-xl) * 1px)",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-3xl) * 1px)",
          alignItems: "flex-start",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 85.658,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm) * 1px)",
            padding: "0px 12px 0px 12px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
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
                width: 25.658,
                height: 29,
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <svg width={14.708} height={14.581} viewBox="0 0 14.708 14.581" fill="none" style={{
                  position: "absolute",
                  left: 10.949,
                  top: 14.419,
                  width: 14.708,
                  height: 14.581,
                }}>
                  <path d={"M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.494} height={28.838} viewBox="0 0 25.494 28.838" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 25.494,
                  height: 28.838,
                }}>
                  <path d={"M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
              </div>
            </div>
            <div style={{
              position: "relative",
              transform: "matrix(-1,0,0,1,0,0)",
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
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 1.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 6.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--spacing-xl) * 1px)",
            alignItems: "center",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <ProfileFrame
              style={{ position: "relative", height: 158, flexShrink: 0 }}
              view={"short"}
              state={"default"}
            />
            <Menu
              style={{ position: "relative", width: 78, flexShrink: 0 }}
              shorten={true}
              activeTab={"0"}
            />
          </div>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <Massage
            style={{
              position: "relative",
              height: 78,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            shorten={true}
            state={"default"}
          />
          <div style={{
            position: "relative",
            width: 40,
            height: 40,
            overflow: "hidden",
            borderRadius: 4,
            backgroundColor: "var(--surface-secondary)",
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
              <svg width={13.750} height={15} viewBox="0 0 13.750 15" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 2.5,
                width: 13.75,
                height: 15,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
              <svg width={13.751} height={8.752} viewBox="0 0 13.751 8.752" fill="none" style={{
                position: "absolute",
                left: 6.25,
                top: 5.624,
                width: 13.751,
                height: 8.752,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __body2 = () => (
    <div className={props.className} style={{
      width: 283,
      height: 982,
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 627,
        height: 982,
        overflow: "hidden",
        backgroundColor: "var(--surface-secondary)",
      }}>
        <div style={{
          position: "absolute",
          left: 283,
          top: 0,
          width: 344,
          height: 109,
          backgroundColor: "rgba(255,255,255,0.01)",
          backdropFilter: "blur(100px)",
          display: "flex",
          flexDirection: "row",
          padding: "32px 24px 32px 24px",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-lg) * 1px)",
          paddingRight: "calc(var(--spacing-lg) * 1px)",
        }}>
          <HH1BLOCK
            style={{
              position: "relative",
              width: 234,
              flexShrink: 0,
              alignSelf: "stretch",
              height: "auto",
            }}
            text1={"Уведомления"}
            text2={"7"}
          />
          <div style={{
            position: "relative",
            width: 40,
            height: 40,
            overflow: "hidden",
            borderRadius: 4,
            display: "flex",
            flexDirection: "row",
            padding: "6px 0px 6px 0px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={12.001} height={12.001} viewBox="0 0 12.001 12.001" fill="none" style={{
                position: "absolute",
                left: 1.999,
                top: 1.999,
                width: 12.001,
                height: 12.001,
                color: "var(--text-primary)",
              }}>
                <path d={"M 0.147 0.855 C 0.1 0.808 0.063 0.753 0.038 0.692 C 0.013 0.631 0 0.566 0 0.501 C 0 0.435 0.013 0.37 0.038 0.309 C 0.063 0.248 0.1 0.193 0.147 0.147 C 0.193 0.1 0.248 0.063 0.309 0.038 C 0.37 0.013 0.435 0 0.501 0 C 0.566 0 0.631 0.013 0.692 0.038 C 0.753 0.063 0.808 0.1 0.855 0.147 L 6.001 5.294 L 11.147 0.147 C 11.193 0.1 11.248 0.063 11.309 0.038 C 11.37 0.013 11.435 0 11.501 0 C 11.566 0 11.631 0.013 11.692 0.038 C 11.753 0.063 11.808 0.1 11.855 0.147 C 11.901 0.193 11.938 0.248 11.963 0.309 C 11.988 0.37 12.001 0.435 12.001 0.501 C 12.001 0.566 11.988 0.631 11.963 0.692 C 11.938 0.753 11.901 0.808 11.855 0.855 L 6.708 6.001 L 11.855 11.147 C 11.901 11.193 11.938 11.248 11.963 11.309 C 11.988 11.37 12.001 11.435 12.001 11.501 C 12.001 11.566 11.988 11.631 11.963 11.692 C 11.938 11.753 11.901 11.808 11.855 11.855 C 11.808 11.901 11.753 11.938 11.692 11.963 C 11.631 11.988 11.566 12.001 11.501 12.001 C 11.435 12.001 11.37 11.988 11.309 11.963 C 11.248 11.938 11.193 11.901 11.147 11.855 L 6.001 6.708 L 0.855 11.855 C 0.808 11.901 0.753 11.938 0.692 11.963 C 0.631 11.988 0.566 12.001 0.501 12.001 C 0.435 12.001 0.37 11.988 0.309 11.963 C 0.248 11.938 0.193 11.901 0.147 11.855 C 0.1 11.808 0.063 11.753 0.038 11.692 C 0.013 11.631 0 11.566 0 11.501 C 0 11.435 0.013 11.37 0.038 11.309 C 0.063 11.248 0.1 11.193 0.147 11.147 L 5.294 6.001 L 0.147 0.855 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{
          position: "absolute",
          left: 283,
          top: 109,
          width: 344,
          height: 873,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0px 24px 0px 24px",
          alignItems: "center",
          boxSizing: "border-box",
          paddingLeft: "calc(var(--spacing-lg) * 1px)",
          paddingRight: "calc(var(--spacing-lg) * 1px)",
        }}>
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Добро пожаловать в Gigly"}
            text3={"Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Экспертиза всё ещё ждёт вас"}
            text2={"11:00"}
            text3={"Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Новый проект: Рефакторинг API на Go"}
            text2={"13:15"}
            text3={"Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Заявка принята! Начинайте работу"}
            text2={"14:30"}
            text3={"Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."}
          />
          <Notification
            style={{
              position: "relative",
              height: 126,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Заявка отклонена"}
            text2={"14:30"}
            text3={"Клиент выбрал другого специалиста на гиг «Рефакторинг API на Go». Не расстраивайтесь — подходящие задачи появляются регулярно."}
          />
          <Notification
            style={{
              position: "relative",
              height: 126,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Клиент ждёт результаты"}
            text2={"18:00"}
            text3={"По проекту «Рефакторинг API на Go» ещё не сдана работа. Уточните статус у клиента или отправьте результат на проверку."}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Работа принята, деньги зачислены"}
            text2={"16:20"}
            text3={"Клиент подтвердил выполнение проекта «Рефакторинг API на Go». Средства переведены на ваш счёт. Ждём вас на следующих проектах!"}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Добро пожаловать в Gigly"}
            text3={"Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Экспертиза всё ещё ждёт вас"}
            text2={"11:00"}
            text3={"Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Новый проект: Рефакторинг API на Go"}
            text2={"13:15"}
            text3={"Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Заявка принята! Начинайте работу"}
            text2={"14:30"}
            text3={"Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."}
          />
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 982,
        backgroundColor: "var(--surface-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-4xl) * 1px)",
        padding: "32px 24px 32px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-xl) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-xl) * 1px)",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-3xl) * 1px)",
          alignItems: "flex-start",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 235,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            padding: "0px 12px 0px 12px",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 136,
              overflow: "hidden",
              display: "flex",
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div style={{
                position: "relative",
                width: 25.658,
                height: 29,
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <svg width={14.708} height={14.581} viewBox="0 0 14.708 14.581" fill="none" style={{
                  position: "absolute",
                  left: 10.949,
                  top: 14.419,
                  width: 14.708,
                  height: 14.581,
                }}>
                  <path d={"M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.494} height={28.838} viewBox="0 0 25.494 28.838" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 25.494,
                  height: 28.838,
                }}>
                  <path d={"M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
              </div>
              <div style={{
                position: "relative",
                width: 96.747,
                height: 29,
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <svg width={18.304} height={28.838} viewBox="0 0 18.304 28.838" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 18.304,
                  height: 28.838,
                }}>
                  <path d={"M 0 25.436 L 7.354 25.436 L 7.354 3.564 L 0 3.564 L 0 0 L 18.304 0 L 18.304 3.564 L 10.949 3.564 L 10.949 25.274 L 18.304 25.274 L 18.304 28.838 L 0 28.838 L 0 25.436 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.658} height={28.838} viewBox="0 0 25.658 28.838" fill="none" style={{
                  position: "absolute",
                  left: 21.899,
                  top: 0,
                  width: 25.658,
                  height: 28.838,
                }}>
                  <path d={"M 0 3.564 L 1.798 3.564 C 3.105 3.564 3.595 2.916 3.595 1.782 L 3.595 0 L 21.899 0 L 21.899 1.782 C 21.899 3.078 22.553 3.564 23.696 3.564 L 25.658 3.564 L 25.658 10.855 L 22.062 10.855 L 22.062 5.508 C 22.062 4.212 21.409 3.726 20.265 3.726 L 5.72 3.726 C 4.412 3.726 3.922 4.374 3.922 5.508 L 3.922 23.654 C 3.922 24.95 4.576 25.436 5.72 25.436 L 16.669 25.436 C 17.977 25.436 18.467 24.788 18.467 23.654 L 18.467 21.872 L 22.062 21.872 L 22.062 18.307 L 10.949 18.307 L 10.949 14.419 L 25.658 14.419 L 25.658 28.838 L 22.062 28.838 L 22.062 25.274 L 20.265 25.274 C 18.957 25.274 18.467 25.922 18.467 27.056 L 18.467 28.838 L 3.922 28.838 L 3.922 27.056 C 3.922 25.76 3.268 25.274 2.125 25.274 L 0.327 25.274 L 0.327 3.564 L 0 3.564 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={18.140} height={29} viewBox="0 0 18.140 29" fill="none" style={{
                  position: "absolute",
                  left: 52.949,
                  top: 0,
                  width: 18.14,
                  height: 29,
                }}>
                  <path d={"M 0 0 L 3.595 0 L 3.595 25.436 L 18.14 25.436 L 18.14 29 L 0 29 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.494} height={29} viewBox="0 0 25.494 29" fill="none" style={{
                  position: "absolute",
                  left: 71.253,
                  top: 0,
                  width: 25.494,
                  height: 29,
                }}>
                  <path d={"M 0 0 L 3.595 0 L 3.595 5.508 C 3.595 6.804 4.249 7.291 5.393 7.291 L 7.354 7.291 L 7.354 12.799 C 7.354 14.095 8.008 14.581 9.152 14.581 L 16.506 14.581 C 17.813 14.581 18.303 13.933 18.303 12.799 L 18.303 7.291 L 20.101 7.291 C 21.409 7.291 21.899 6.642 21.899 5.508 L 21.899 0 L 25.494 0 L 25.494 7.291 L 23.696 7.291 C 22.389 7.291 21.899 7.939 21.899 9.073 L 21.899 14.581 L 20.101 14.581 C 18.794 14.581 18.303 15.229 18.303 16.363 L 18.303 18.145 L 14.708 18.145 L 14.708 29 L 11.113 29 L 11.113 18.145 L 7.354 18.145 L 7.354 16.363 C 7.354 15.067 6.7 14.581 5.556 14.581 L 3.759 14.581 L 3.759 9.073 C 3.759 7.777 3.105 7.291 1.961 7.291 L 0.163 7.291 L 0.163 0 L 0 0 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
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
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 1.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 6.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{
            position: "relative",
            width: 235,
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--spacing-xl) * 1px)",
            alignItems: "flex-start",
            flexShrink: 0,
          }}>
            <ProfileFrame
              style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                width: "auto",
              }}
              view={"full"}
              state={"default"}
            />
            <Menu
              style={{
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
                width: "auto",
              }}
              shorten={false}
              activeTab={"0"}
            />
          </div>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexGrow: 1,
        }}>
          <Massage
            style={{ position: "relative", width: 235, flexShrink: 0 }}
            shorten={false}
            state={"default"}
          />
          <div style={{
            position: "relative",
            width: 40,
            height: 40,
            overflow: "hidden",
            borderRadius: 4,
            backgroundColor: "var(--surface-secondary)",
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
              <svg width={13.750} height={15} viewBox="0 0 13.750 15" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 2.5,
                width: 13.75,
                height: 15,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
              <svg width={13.751} height={8.752} viewBox="0 0 13.751 8.752" fill="none" style={{
                position: "absolute",
                left: 6.25,
                top: 5.624,
                width: 13.751,
                height: 8.752,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __body3 = () => (
    <div className={props.className} style={{
      width: 117,
      height: 982,
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style,
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 470,
        height: 982,
        overflow: "hidden",
        backgroundColor: "var(--surface-secondary)",
      }}>
        <div style={{
          position: "absolute",
          left: 126,
          top: 109,
          width: 344,
          height: 873,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "0px 32px 0px 32px",
          alignItems: "center",
          boxSizing: "border-box",
        }}>
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Добро пожаловать в Gigly"}
            text3={"Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Экспертиза всё ещё ждёт вас"}
            text2={"11:00"}
            text3={"Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."}
          />
          <Notification
            style={{
              position: "relative",
              height: 146,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Новый проект: Рефакторинг API на Go"}
            text2={"13:15"}
            text3={"Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Заявка принята! Начинайте работу"}
            text2={"14:30"}
            text3={"Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."}
          />
          <Notification
            style={{
              position: "relative",
              height: 126,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Заявка отклонена"}
            text2={"14:30"}
            text3={"Клиент выбрал другого специалиста на гиг «Рефакторинг API на Go». Не расстраивайтесь — подходящие задачи появляются регулярно."}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Клиент ждёт результаты"}
            text2={"18:00"}
            text3={"По проекту «Рефакторинг API на Go» ещё не сдана работа. Уточните статус у клиента или отправьте результат на проверку."}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Работа принята, деньги зачислены"}
            text2={"16:20"}
            text3={"Клиент подтвердил выполнение проекта «Рефакторинг API на Go». Средства переведены на ваш счёт. Ждём вас на следующих проектах!"}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Добро пожаловать в Gigly"}
            text3={"Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."}
          />
          <Notification
            style={{
              position: "relative",
              height: 128,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Экспертиза всё ещё ждёт вас"}
            text2={"11:00"}
            text3={"Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."}
          />
          <Notification
            style={{
              position: "relative",
              height: 146,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Новый проект: Рефакторинг API на Go"}
            text2={"13:15"}
            text3={"Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"}
          />
          <Notification
            style={{
              position: "relative",
              height: 144,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            text1={"Заявка принята! Начинайте работу"}
            text2={"14:30"}
            text3={"Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."}
          />
        </div>
        <div style={{
          position: "absolute",
          left: 126,
          top: 0,
          width: 344,
          backgroundColor: "rgba(255,255,255,0.01)",
          backdropFilter: "blur(100px)",
          display: "flex",
          flexDirection: "row",
          padding: "32px 32px 32px 32px",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}>
          <HH1BLOCK
            style={{ position: "relative", width: 234, flexShrink: 0 }}
            text1={"Уведомления"}
            text2={"7"}
          />
          <div style={{
            position: "relative",
            width: 40,
            height: 40,
            overflow: "hidden",
            borderRadius: 4,
            display: "flex",
            flexDirection: "row",
            padding: "6px 0px 6px 0px",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
            <div style={{
              position: "relative",
              width: 16,
              height: 16,
              overflow: "hidden",
              flexShrink: 0,
            }}>
              <svg width={12.001} height={12.001} viewBox="0 0 12.001 12.001" fill="none" style={{
                position: "absolute",
                left: 1.999,
                top: 1.999,
                width: 12.001,
                height: 12.001,
                color: "var(--text-primary)",
              }}>
                <path d={"M 0.147 0.855 C 0.1 0.808 0.063 0.753 0.038 0.692 C 0.013 0.631 0 0.566 0 0.501 C 0 0.435 0.013 0.37 0.038 0.309 C 0.063 0.248 0.1 0.193 0.147 0.147 C 0.193 0.1 0.248 0.063 0.309 0.038 C 0.37 0.013 0.435 0 0.501 0 C 0.566 0 0.631 0.013 0.692 0.038 C 0.753 0.063 0.808 0.1 0.855 0.147 L 6.001 5.294 L 11.147 0.147 C 11.193 0.1 11.248 0.063 11.309 0.038 C 11.37 0.013 11.435 0 11.501 0 C 11.566 0 11.631 0.013 11.692 0.038 C 11.753 0.063 11.808 0.1 11.855 0.147 C 11.901 0.193 11.938 0.248 11.963 0.309 C 11.988 0.37 12.001 0.435 12.001 0.501 C 12.001 0.566 11.988 0.631 11.963 0.692 C 11.938 0.753 11.901 0.808 11.855 0.855 L 6.708 6.001 L 11.855 11.147 C 11.901 11.193 11.938 11.248 11.963 11.309 C 11.988 11.37 12.001 11.435 12.001 11.501 C 12.001 11.566 11.988 11.631 11.963 11.692 C 11.938 11.753 11.901 11.808 11.855 11.855 C 11.808 11.901 11.753 11.938 11.692 11.963 C 11.631 11.988 11.566 12.001 11.501 12.001 C 11.435 12.001 11.37 11.988 11.309 11.963 C 11.248 11.938 11.193 11.901 11.147 11.855 L 6.001 6.708 L 0.855 11.855 C 0.808 11.901 0.753 11.938 0.692 11.963 C 0.631 11.988 0.566 12.001 0.501 12.001 C 0.435 12.001 0.37 11.988 0.309 11.963 C 0.248 11.938 0.193 11.901 0.147 11.855 C 0.1 11.808 0.063 11.753 0.038 11.692 C 0.013 11.631 0 11.566 0 11.501 C 0 11.435 0.013 11.37 0.038 11.309 C 0.063 11.248 0.1 11.193 0.147 11.147 L 5.294 6.001 L 0.147 0.855 Z"} fill="currentColor" fillRule="nonzero" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 126,
        height: 982,
        backgroundColor: "var(--surface-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "calc(var(--spacing-4xl) * 1px)",
        padding: "32px 24px 32px 24px",
        alignItems: "flex-start",
        boxSizing: "border-box",
        paddingLeft: "calc(var(--spacing-lg) * 1px)",
        paddingTop: "calc(var(--spacing-xl) * 1px)",
        paddingRight: "calc(var(--spacing-lg) * 1px)",
        paddingBottom: "calc(var(--spacing-xl) * 1px)",
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "calc(var(--spacing-3xl) * 1px)",
          alignItems: "flex-start",
          flexShrink: 0,
        }}>
          <div style={{
            position: "relative",
            width: 85.658,
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            gap: "calc(var(--spacing-sm) * 1px)",
            padding: "0px 12px 0px 12px",
            alignItems: "center",
            boxSizing: "border-box",
            flexShrink: 0,
          }}>
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
                width: 25.658,
                height: 29,
                overflow: "hidden",
                flexShrink: 0,
              }}>
                <svg width={14.708} height={14.581} viewBox="0 0 14.708 14.581" fill="none" style={{
                  position: "absolute",
                  left: 10.949,
                  top: 14.419,
                  width: 14.708,
                  height: 14.581,
                }}>
                  <path d={"M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
                <svg width={25.494} height={28.838} viewBox="0 0 25.494 28.838" fill="none" style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 25.494,
                  height: 28.838,
                }}>
                  <path d={"M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z"} fill="currentColor" fillRule="nonzero" />
                </svg>
              </div>
            </div>
            <div style={{
              position: "relative",
              transform: "matrix(-1,0,0,1,0,0)",
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
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 1.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
                <svg width={8.752} height={16.252} viewBox="0 0 8.752 16.252" fill="none" style={{
                  position: "absolute",
                  left: 6.874,
                  top: 1.874,
                  width: 8.752,
                  height: 16.252,
                  color: "rgb(255,255,255)",
                }}>
                  <path d={"M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z"} fill="currentColor" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--spacing-xl) * 1px)",
            alignItems: "center",
            flexShrink: 0,
            alignSelf: "stretch",
          }}>
            <ProfileFrame
              style={{ position: "relative", height: 158, flexShrink: 0 }}
              view={"short"}
              state={"default"}
            />
            <Menu
              style={{ position: "relative", width: 78, flexShrink: 0 }}
              shorten={true}
              activeTab={"0"}
            />
          </div>
        </div>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexGrow: 1,
          alignSelf: "stretch",
        }}>
          <Massage
            style={{
              position: "relative",
              height: 78,
              flexShrink: 0,
              alignSelf: "stretch",
              width: "auto",
            }}
            shorten={true}
            state={"default"}
          />
          <div style={{
            position: "relative",
            width: 40,
            height: 40,
            overflow: "hidden",
            borderRadius: 4,
            backgroundColor: "var(--surface-secondary)",
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
              <svg width={13.750} height={15} viewBox="0 0 13.750 15" fill="none" style={{
                position: "absolute",
                left: 0,
                top: 2.5,
                width: 13.75,
                height: 15,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
              <svg width={13.751} height={8.752} viewBox="0 0 13.751 8.752" fill="none" style={{
                position: "absolute",
                left: 6.25,
                top: 5.624,
                width: 13.751,
                height: 8.752,
                color: "rgb(255,255,255)",
              }}>
                <path d={"M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z"} fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const __impls = {
    // figma: Property 1=full, noti=no
    "property1=full|noti=false": __body0,
    // figma: Property 1=short, noti=no
    "property1=short|noti=false": __body1,
    // figma: Property 1=full, noti=yes
    "property1=full|noti=true": __body2,
    // figma: Property 1=short, noti=yes
    "property1=short|noti=true": __body3,
  };
  return (__impls[__vkey(props)] ?? __body0)();
}
export default SideBar;
