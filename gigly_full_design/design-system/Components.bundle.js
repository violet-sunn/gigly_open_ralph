// Components bundle — 62 component(s) materialized from a .fig as one
// self-contained file: no imports/exports; every component is assigned to window below.
// Design tokens / typography still ship separately (fig-tokens.css / fig-typography.css).

// figma node: 3435:5794 Специальность (2 variants)
const __venc_Component = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Component = p => "size=" + __venc_Component(p.size);
function Component(_p = {}) {
  const props = {
    ..._p,
    size: _p.size ?? "s"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "100%",
      letterSpacing: "-0.010em",
      color: "var(--brand-default)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "[Senior Frontend Engineer]"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "0px 4px 0px 4px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-xs) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-xs) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 12,
      lineHeight: "100%",
      letterSpacing: "-0.010em",
      color: "var(--brand-default)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "[Senior Frontend Engineer]"));
  const __impls = {
    // figma: Size=S
    "size=s": __body0,
    // figma: Size=XS
    "size=xs": __body1
  };
  return (__impls[__vkey_Component(props)] ?? __body0)();
}

// figma node: 3100:3400 icon (3 variants)
const __venc_Icon = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Icon = p => "property1=" + __venc_Icon(p.property1) + '|' + "property2=" + __venc_Icon(p.property2) + '|' + "property3=" + __venc_Icon(p.property3);
function Icon(_p = {}) {
  const props = {
    ..._p,
    property1: _p.property1 ?? "bootstrap",
    property2: _p.property2 ?? "outline & logos",
    property3: _p.property3 ?? "star"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.000,
    height: 15.001,
    viewBox: "0 0 16.000 15.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.499,
      width: 16,
      height: 15.001
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.865 14.351 C 2.787 14.795 3.225 15.142 3.611 14.944 L 8.001 12.688 L 12.39 14.944 C 12.776 15.142 13.214 14.795 13.136 14.352 L 12.306 9.622 L 15.828 6.266 C 16.158 5.952 15.988 5.378 15.546 5.316 L 10.648 4.62 L 8.464 0.293 C 8.422 0.205 8.356 0.131 8.274 0.079 C 8.192 0.028 8.097 0 8 0 C 7.903 0 7.808 0.028 7.726 0.079 C 7.644 0.131 7.578 0.205 7.537 0.293 L 5.353 4.621 L 0.455 5.317 C 0.014 5.379 -0.157 5.953 0.172 6.267 L 3.695 9.623 L 2.865 14.353 L 2.865 14.351 Z M 7.77 11.584 L 4.084 13.478 L 4.778 9.521 C 4.794 9.43 4.788 9.336 4.759 9.248 C 4.731 9.16 4.681 9.081 4.615 9.016 L 1.709 6.246 L 5.761 5.67 C 5.845 5.657 5.924 5.625 5.993 5.574 C 6.061 5.524 6.116 5.458 6.154 5.382 L 7.999 1.724 L 9.846 5.382 C 9.883 5.458 9.938 5.524 10.007 5.574 C 10.075 5.625 10.155 5.657 10.239 5.67 L 14.291 6.245 L 11.385 9.015 C 11.318 9.08 11.268 9.16 11.24 9.248 C 11.211 9.336 11.205 9.43 11.222 9.521 L 11.916 13.478 L 8.23 11.584 C 8.158 11.547 8.079 11.528 7.999 11.528 C 7.919 11.528 7.84 11.547 7.769 11.584 L 7.77 11.584 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.000,
    viewBox: "0 0 16.001 15.000",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.5,
      width: 16.001,
      height: 15
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 5.353 4.619 L 7.537 0.292 C 7.579 0.205 7.644 0.131 7.726 0.08 C 7.808 0.028 7.902 0.001 7.999 0 C 8.182 0 8.365 0.097 8.464 0.292 L 10.648 4.619 L 15.546 5.315 C 15.668 5.334 15.78 5.395 15.862 5.487 C 15.945 5.579 15.993 5.697 15.999 5.82 C 16.006 5.902 15.994 5.985 15.965 6.062 C 15.935 6.139 15.889 6.208 15.829 6.265 L 12.306 9.621 L 13.136 14.351 C 13.214 14.794 12.776 15.141 12.39 14.943 L 7.999 12.687 L 3.61 14.943 C 3.564 14.967 3.515 14.984 3.464 14.993 C 3.122 15.053 2.796 14.739 2.864 14.351 L 3.694 9.621 L 0.172 6.265 C 0.117 6.213 0.074 6.151 0.044 6.081 C 0.015 6.012 0 5.937 0 5.862 C 0 5.755 0.029 5.651 0.085 5.56 C 0.124 5.494 0.178 5.438 0.242 5.395 C 0.306 5.353 0.379 5.326 0.455 5.315 L 5.353 4.619 L 5.353 4.619 Z M 7.999 11.527 C 8.08 11.527 8.159 11.546 8.231 11.583 L 11.917 13.477 L 11.223 9.52 C 11.207 9.429 11.213 9.335 11.241 9.247 C 11.269 9.159 11.319 9.079 11.385 9.015 L 14.292 6.245 L 10.24 5.669 C 10.156 5.656 10.077 5.624 10.008 5.573 C 9.94 5.523 9.884 5.457 9.847 5.381 L 8 1.723 L 7.999 1.726 L 7.999 11.526 L 7.999 11.527 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.000,
    height: 15.001,
    viewBox: "0 0 16.000 15.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.499,
      width: 16,
      height: 15.001
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.865 14.351 C 2.787 14.795 3.225 15.142 3.611 14.944 L 8.001 12.688 L 12.39 14.944 C 12.776 15.142 13.214 14.795 13.136 14.352 L 12.306 9.622 L 15.828 6.266 C 16.158 5.952 15.988 5.378 15.546 5.316 L 10.648 4.62 L 8.464 0.293 C 8.422 0.205 8.356 0.131 8.274 0.079 C 8.192 0.028 8.097 0 8 0 C 7.903 0 7.808 0.028 7.726 0.079 C 7.644 0.131 7.578 0.205 7.537 0.293 L 5.353 4.621 L 0.455 5.317 C 0.014 5.379 -0.157 5.953 0.172 6.267 L 3.695 9.623 L 2.865 14.353 L 2.865 14.351 Z M 7.77 11.584 L 4.084 13.478 L 4.778 9.521 C 4.794 9.43 4.788 9.336 4.759 9.248 C 4.731 9.16 4.681 9.081 4.615 9.016 L 1.709 6.246 L 5.761 5.67 C 5.845 5.657 5.924 5.625 5.993 5.574 C 6.061 5.524 6.116 5.458 6.154 5.382 L 7.999 1.724 L 9.846 5.382 C 9.883 5.458 9.938 5.524 10.007 5.574 C 10.075 5.625 10.155 5.657 10.239 5.67 L 14.291 6.245 L 11.385 9.015 C 11.318 9.08 11.268 9.16 11.24 9.248 C 11.211 9.336 11.205 9.43 11.222 9.521 L 11.916 13.478 L 8.23 11.584 C 8.158 11.547 8.079 11.528 7.999 11.528 C 7.919 11.528 7.841 11.547 7.77 11.584 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 7.77 11.584 L 4.084 13.478 L 4.778 9.521 C 4.794 9.43 4.788 9.336 4.759 9.248 C 4.731 9.16 4.681 9.081 4.615 9.016 L 1.709 6.246 L 5.761 5.67 C 5.845 5.657 5.924 5.625 5.993 5.574 C 6.061 5.524 6.116 5.458 6.154 5.382 L 7.999 1.724 L 9.846 5.382 C 9.883 5.458 9.938 5.524 10.007 5.574 C 10.075 5.625 10.155 5.657 10.239 5.67 L 14.291 6.245 L 11.385 9.015 C 11.318 9.08 11.268 9.16 11.24 9.248 C 11.211 9.336 11.205 9.43 11.222 9.521 L 11.916 13.478 L 8.23 11.584 C 8.158 11.547 8.079 11.528 7.999 11.528 C 7.919 11.528 7.841 11.547 7.77 11.584 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __impls = {
    // figma: Property 1=bootstrap, Property 2=outline & logos, Property 3=star
    "property1=bootstrap|property2=outline & logos|property3=star": __body0,
    // figma: Property 1=bootstrap, Property 2=outline & logos, Property 3=star-half
    "property1=bootstrap|property2=outline & logos|property3=star-half": __body1,
    // figma: Property 1=bootstrap, Property 2=filled, Property 3=star
    "property1=bootstrap|property2=filled|property3=star": __body2
  };
  return (__impls[__vkey_Icon(props)] ?? __body0)();
}

// figma node: 2778:2888 icon / bootstrap / outline & logos / patch-check
function IconBootstrapOutlineLogosPatch(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15.998,
    height: 15.998,
    viewBox: "0 0 15.998 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 15.998,
      height: 15.998,
      color: "var(--color-2)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 10.272 2.512 L 9.351 1.568 L 10.066 0.87 L 10.688 1.507 L 11.578 1.496 C 11.963 1.492 12.346 1.564 12.703 1.709 C 13.059 1.855 13.384 2.07 13.656 2.342 C 13.928 2.615 14.144 2.939 14.289 3.296 C 14.434 3.653 14.507 4.035 14.502 4.42 L 14.492 5.31 L 15.128 5.932 C 15.404 6.201 15.623 6.523 15.772 6.878 C 15.921 7.233 15.998 7.614 15.998 7.999 C 15.998 8.384 15.921 8.766 15.772 9.121 C 15.623 9.476 15.404 9.797 15.128 10.066 L 14.491 10.688 L 14.502 11.578 C 14.507 11.963 14.434 12.346 14.289 12.703 C 14.144 13.059 13.928 13.384 13.656 13.656 C 13.384 13.928 13.059 14.144 12.703 14.289 C 12.346 14.434 11.963 14.507 11.578 14.502 L 10.688 14.492 L 10.066 15.128 C 9.797 15.404 9.476 15.623 9.121 15.772 C 8.766 15.921 8.384 15.998 7.999 15.998 C 7.614 15.998 7.233 15.921 6.878 15.772 C 6.523 15.623 6.201 15.404 5.932 15.128 L 5.31 14.491 L 4.42 14.502 C 4.035 14.507 3.653 14.434 3.296 14.289 C 2.939 14.144 2.615 13.928 2.342 13.656 C 2.07 13.384 1.855 13.059 1.709 12.703 C 1.564 12.346 1.492 11.963 1.496 11.578 L 1.506 10.688 L 0.87 10.066 C 0.595 9.797 0.376 9.476 0.226 9.121 C 0.077 8.766 0 8.384 0 7.999 C 0 7.614 0.077 7.233 0.226 6.878 C 0.376 6.523 0.595 6.201 0.87 5.932 L 1.507 5.31 L 1.496 4.42 C 1.492 4.035 1.564 3.653 1.709 3.296 C 1.855 2.939 2.07 2.615 2.342 2.342 C 2.615 2.07 2.939 1.855 3.296 1.709 C 3.653 1.564 4.035 1.492 4.42 1.496 L 5.31 1.506 L 5.932 0.87 C 6.201 0.595 6.523 0.376 6.878 0.226 C 7.233 0.077 7.614 0 7.999 0 C 8.384 0 8.766 0.077 9.121 0.226 C 9.476 0.376 9.797 0.595 10.066 0.87 L 9.351 1.568 C 9.175 1.388 8.965 1.245 8.733 1.147 C 8.501 1.049 8.251 0.999 7.999 0.999 C 7.747 0.999 7.498 1.049 7.266 1.147 C 7.034 1.245 6.823 1.388 6.647 1.568 L 5.727 2.512 L 4.407 2.496 C 4.155 2.493 3.906 2.541 3.672 2.636 C 3.439 2.731 3.227 2.872 3.049 3.05 C 2.871 3.228 2.731 3.44 2.636 3.673 C 2.541 3.907 2.493 4.156 2.496 4.408 L 2.512 5.726 L 1.568 6.647 C 1.388 6.823 1.245 7.034 1.147 7.266 C 1.049 7.498 0.999 7.747 0.999 7.999 C 0.999 8.251 1.049 8.501 1.147 8.733 C 1.245 8.965 1.388 9.175 1.568 9.351 L 2.512 10.271 L 2.496 11.591 C 2.493 11.843 2.541 12.093 2.636 12.326 C 2.731 12.559 2.872 12.771 3.05 12.949 C 3.228 13.127 3.44 13.268 3.673 13.363 C 3.907 13.458 4.156 13.505 4.408 13.502 L 5.726 13.486 L 6.647 14.43 C 6.823 14.61 7.034 14.754 7.266 14.851 C 7.498 14.949 7.747 15 7.999 15 C 8.251 15 8.501 14.949 8.733 14.851 C 8.965 14.754 9.175 14.61 9.351 14.43 L 10.271 13.486 L 11.591 13.502 C 11.843 13.505 12.093 13.457 12.326 13.362 C 12.559 13.267 12.771 13.127 12.949 12.948 C 13.127 12.77 13.268 12.558 13.363 12.325 C 13.458 12.092 13.505 11.842 13.502 11.59 L 13.486 10.272 L 14.43 9.351 C 14.61 9.175 14.754 8.965 14.851 8.733 C 14.949 8.501 15 8.251 15 7.999 C 15 7.747 14.949 7.498 14.851 7.266 C 14.754 7.034 14.61 6.823 14.43 6.647 L 13.486 5.727 L 13.502 4.407 C 13.505 4.155 13.457 3.906 13.362 3.672 C 13.267 3.439 13.127 3.227 12.948 3.049 C 12.77 2.871 12.558 2.731 12.325 2.636 C 12.092 2.541 11.842 2.493 11.59 2.496 L 10.272 2.512 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 10.272 2.512 L 9.351 1.568 C 9.175 1.388 8.965 1.245 8.733 1.147 C 8.501 1.049 8.251 0.999 7.999 0.999 C 7.747 0.999 7.498 1.049 7.266 1.147 C 7.034 1.245 6.823 1.388 6.647 1.568 L 5.727 2.512 L 4.407 2.496 C 4.155 2.493 3.906 2.541 3.672 2.636 C 3.439 2.731 3.227 2.872 3.049 3.05 C 2.871 3.228 2.731 3.44 2.636 3.673 C 2.541 3.907 2.493 4.156 2.496 4.408 L 2.512 5.726 L 1.568 6.647 C 1.388 6.823 1.245 7.034 1.147 7.266 C 1.049 7.498 0.999 7.747 0.999 7.999 C 0.999 8.251 1.049 8.501 1.147 8.733 C 1.245 8.965 1.388 9.175 1.568 9.351 L 2.512 10.271 L 2.496 11.591 C 2.493 11.843 2.541 12.093 2.636 12.326 C 2.731 12.559 2.872 12.771 3.05 12.949 C 3.228 13.127 3.44 13.268 3.673 13.363 C 3.907 13.458 4.156 13.505 4.408 13.502 L 5.726 13.486 L 6.647 14.43 C 6.823 14.61 7.034 14.754 7.266 14.851 C 7.498 14.949 7.747 15 7.999 15 C 8.251 15 8.501 14.949 8.733 14.851 C 8.965 14.754 9.175 14.61 9.351 14.43 L 10.271 13.486 L 11.591 13.502 C 11.843 13.505 12.093 13.457 12.326 13.362 C 12.559 13.267 12.771 13.127 12.949 12.948 C 13.127 12.77 13.268 12.558 13.363 12.325 C 13.458 12.092 13.505 11.842 13.502 11.59 L 13.486 10.272 L 14.43 9.351 C 14.61 9.175 14.754 8.965 14.851 8.733 C 14.949 8.501 15 8.251 15 7.999 C 15 7.747 14.949 7.498 14.851 7.266 C 14.754 7.034 14.61 6.823 14.43 6.647 L 13.486 5.727 L 13.502 4.407 C 13.505 4.155 13.457 3.906 13.362 3.672 C 13.267 3.439 13.127 3.227 12.948 3.049 C 12.77 2.871 12.558 2.731 12.325 2.636 C 12.092 2.541 11.842 2.493 11.59 2.496 L 10.272 2.512 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 5.502,
    height: 4.002,
    viewBox: "0 0 5.502 4.002",
    fill: "none",
    style: {
      position: "absolute",
      left: 4.999,
      top: 5.999,
      width: 5.502,
      height: 4.002,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 5.355 0.147 C 5.401 0.193 5.438 0.249 5.463 0.309 C 5.489 0.37 5.502 0.435 5.502 0.501 C 5.502 0.567 5.489 0.632 5.463 0.693 C 5.438 0.753 5.401 0.808 5.355 0.855 L 2.355 3.855 C 2.308 3.901 2.253 3.938 2.192 3.964 C 2.132 3.989 2.066 4.002 2.001 4.002 C 1.935 4.002 1.87 3.989 1.809 3.964 C 1.748 3.938 1.693 3.901 1.647 3.855 L 0.147 2.355 C 0.1 2.308 0.063 2.253 0.038 2.192 C 0.013 2.132 0 2.067 0 2.001 C 0 1.935 0.013 1.87 0.038 1.809 C 0.063 1.749 0.1 1.693 0.147 1.647 C 0.193 1.6 0.248 1.564 0.309 1.538 C 0.37 1.513 0.435 1.5 0.501 1.5 C 0.566 1.5 0.631 1.513 0.692 1.538 C 0.753 1.564 0.808 1.6 0.855 1.647 L 2.001 2.794 L 4.647 0.147 C 4.693 0.1 4.748 0.063 4.809 0.038 C 4.87 0.013 4.935 0 5.001 0 C 5.066 0 5.132 0.013 5.192 0.038 C 5.253 0.063 5.308 0.1 5.355 0.147 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })));
}

// figma node: 2931:2365 bio (4 variants)
const __venc_Bio = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Bio = p => "sizeFor=" + __venc_Bio(p.sizeFor) + '|' + "uSER=" + __venc_Bio(p.uSER);
function Bio(_p = {}) {
  const props = {
    ..._p,
    prop: _p.prop ?? true,
    verificationMark: _p.verificationMark ?? true,
    sizeFor: _p.sizeFor ?? "gig",
    profile: _p.profile ?? true,
    stars: _p.stars ?? "",
    info: _p.info ?? true,
    uSER: _p.uSER ?? "company",
    text: _p.text ?? "был(-а) недавно",
    text2: _p.text2 ?? true
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      alignItems: "center",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "calc(var(--avatar-size-sm) * 1px)",
      borderRadius: 666,
      backgroundColor: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      color: "rgb(0,0,0)"
    }
  }, "V")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 457,
      fontSize: 12,
      lineHeight: "100%",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "Vercel"), props.verificationMark && /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPatch, {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  })), props.prop && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "45")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 14,
      height: 11,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-xs) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0
    }
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "calc(var(--avatar-size-sm) * 1px)",
      borderRadius: 666,
      backgroundColor: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      color: "rgb(0,0,0)"
    }
  }, "\u0414")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 457,
      fontSize: 12,
      lineHeight: "100%",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "\u0414\u043C\u0438\u0442\u0440\u0438\u0439"), /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPatch, {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  })), props.prop && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "45")), props.profile && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Component, {
    style: {
      position: "relative",
      width: 116,
      flexShrink: 0
    },
    text1: "[Middle Python]",
    size: "xs"
  }))));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "calc(var(--avatar-size-md) * 1px)",
      height: 32,
      borderRadius: 666,
      backgroundColor: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 10,
      top: 5,
      width: 12,
      height: 23,
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 19.692306518554688,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(6,8,19)"
    }
  }, "V")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      alignItems: "flex-start",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 656,
      fontSize: 18,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "Vercel"), /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPatch, {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  })), props.prop && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "45"))), props.text2 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 14,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\u0431\u044B\u043B(-\u0430) \u043D\u0435\u0434\u0430\u0432\u043D\u043E")));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "calc(var(--avatar-size-md) * 1px)",
      height: 32,
      borderRadius: 666,
      backgroundColor: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 9,
      top: 4,
      width: 13,
      height: 23,
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 19.692306518554688,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(14,16,26)"
    }
  }, "\u0414")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 656,
      fontSize: 18,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "\u0414\u043C\u0438\u0442\u0440\u0438\u0439"), /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPatch, {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  })), props.prop && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 457,
      fontSize: 10,
      lineHeight: "10px",
      letterSpacing: "-0.020em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "45")), props.profile && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Component, {
    style: {
      position: "relative",
      width: 134,
      height: 17,
      flexShrink: 0
    },
    text1: "[Middle Python]",
    size: "xs"
  }))), props.text2 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 14,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\u0431\u044B\u043B(-\u0430) \u043D\u0435\u0434\u0430\u0432\u043D\u043E")));
  const __impls = {
    // figma: size for=gig, USER=COMPANY
    "sizeFor=gig|uSER=company": __body0,
    // figma: size for=gig, USER=SPECIALIST
    "sizeFor=gig|uSER=specialist": __body1,
    // figma: size for=acc bio, USER=COMPANY
    "sizeFor=acc bio|uSER=company": __body2,
    // figma: size for=acc bio, USER=SPECIALIST
    "sizeFor=acc bio|uSER=specialist": __body3
  };
  return (__impls[__vkey_Bio(props)] ?? __body0)();
}

// figma node: 2778:907 icon / bootstrap / outline & logos / arrow-down-right-square
function IconBootstrapOutlineLogosArrow18(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 15 2 C 15 1.735 14.895 1.48 14.707 1.293 C 14.52 1.105 14.265 1 14 1 L 2 1 C 1.735 1 1.48 1.105 1.293 1.293 C 1.105 1.48 1 1.735 1 2 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 14 15 C 14.265 15 14.52 14.895 14.707 14.707 C 14.895 14.52 15 14.265 15 14 L 15 2 Z M 0 2 C 0 1.47 0.211 0.961 0.586 0.586 C 0.961 0.211 1.47 0 2 0 L 14 0 C 14.53 0 15.039 0.211 15.414 0.586 C 15.789 0.961 16 1.47 16 2 L 16 14 C 16 14.53 15.789 15.039 15.414 15.414 C 15.039 15.789 14.53 16 14 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 0 2 Z M 5.854 5.146 C 5.76 5.052 5.633 4.999 5.5 4.999 C 5.367 4.999 5.24 5.052 5.146 5.146 C 5.052 5.24 4.999 5.367 4.999 5.5 C 4.999 5.633 5.052 5.76 5.146 5.854 L 9.243 9.95 L 6.475 9.95 C 6.342 9.95 6.215 10.003 6.121 10.096 C 6.028 10.19 5.975 10.317 5.975 10.45 C 5.975 10.583 6.028 10.71 6.121 10.804 C 6.215 10.897 6.342 10.95 6.475 10.95 L 10.45 10.95 C 10.583 10.95 10.71 10.897 10.804 10.804 C 10.897 10.71 10.95 10.583 10.95 10.45 L 10.95 6.475 C 10.95 6.342 10.897 6.215 10.804 6.121 C 10.71 6.028 10.583 5.975 10.45 5.975 C 10.317 5.975 10.19 6.028 10.096 6.121 C 10.003 6.215 9.95 6.342 9.95 6.475 L 9.95 9.243 L 5.854 5.146 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })));
}

// figma node: 3149:3432 Button (9 variants)
const __venc_Button = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Button = p => "property=" + __venc_Button(p.property) + '|' + "state=" + __venc_Button(p.state);
function Button(_p = {}) {
  const props = {
    ..._p,
    icon: _p.icon ?? false,
    property: _p.property ?? "primary",
    state: _p.state ?? "default",
    txt: _p.txt ?? true,
    text: _p.text ?? "К проекту"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 16,
      lineHeight: "100%",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      opacity: 0.5,
      borderRadius: 8,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 16,
      lineHeight: "100%",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      opacity: 0.5,
      borderRadius: 8,
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-disabled)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 32,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 8px 4px 8px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 16,
      lineHeight: "100%",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, null)));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 32,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 8px 4px 8px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--brand-hover)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, null)));
  const __body8 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      minHeight: 32,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 8px 4px 8px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.txt && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-disabled)",
      flexShrink: 0
    }
  }, props.text), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosArrow18, null)));
  const __impls = {
    // figma: Property=Primary, State=Default
    "property=primary|state=default": __body0,
    // figma: Property=Primary, State=Hover
    "property=primary|state=hover": __body1,
    // figma: Property=Primary, State=Disabled
    "property=primary|state=disabled": __body2,
    // figma: Property=Secondary, State=Default
    "property=secondary|state=default": __body3,
    // figma: Property=Secondary, State=Hover
    "property=secondary|state=hover": __body4,
    // figma: Property=Secondary, State=Disabled
    "property=secondary|state=disabled": __body5,
    // figma: Property=Tetriary, State=Default
    "property=tetriary|state=default": __body6,
    // figma: Property=Tetriary, State=Hover
    "property=tetriary|state=hover": __body7,
    // figma: Property=Tetriary, State=Disabled
    "property=tetriary|state=disabled": __body8
  };
  return (__impls[__vkey_Button(props)] ?? __body0)();
}

// figma node: 3398:7497 Gig/На рассмотрении/full
function GigFull4(_p = {}) {
  const props = {
    ..._p,
    category: _p.category ?? false,
    timeline: _p.timeline ?? true,
    loadline: _p.loadline ?? "",
    description: _p.description ?? true,
    prop: _p.prop ?? true,
    loadline2: _p.loadline2 ?? "",
    loadline3: _p.loadline3 ?? ""
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 558.5,
      borderRadius: 12,
      background: "radial-gradient(558.500px 217px at 50.00% 0.00%, rgba(8,145,178,0.4) 0.00%, rgba(8,145,178,0.08) 46.63%, rgba(8,145,178,0) 100.00%), linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05)), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
      boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "16px 16px 16px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-md) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-md) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      width: 294,
      flexShrink: 0
    },
    info: false,
    sizeFor: "gig",
    uSER: "company"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 18,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text1 ?? "Миграция аналитического дашборда на Next.js 14"), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      overflow: "hidden",
      lineHeight: "16px",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.")), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(115,115,115)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
}

// figma node: 2868:3725 Category/Blue/XS
function CategoryBlueXS(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 666,
      borderTop: "1px solid rgb(76,172,255)",
      borderRight: "1px solid rgb(76,172,255)",
      borderBottom: "1px solid rgb(76,172,255)",
      borderLeft: "1px solid rgb(76,172,255)",
      display: "flex",
      flexDirection: "row",
      padding: "3px 6px 3px 6px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 11,
      lineHeight: "100%",
      color: "rgb(76,172,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Маркетинг"));
}

// figma node: 3392:5123 status/SPECIALIST/В работе/XS
function StatusSPECIALISTXS(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      backgroundColor: "rgba(0,136,255,0.1)",
      borderTop: "1px solid rgb(0,136,255)",
      borderRight: "2px solid rgb(0,136,255)",
      borderBottom: "1px solid rgb(0,136,255)",
      borderLeft: "2px solid rgb(0,136,255)",
      display: "flex",
      flexDirection: "row",
      padding: "0px 6px 0px 6px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 12,
      lineHeight: "16px",
      color: "rgb(0,136,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "В работе"));
}

// figma node: 3392:5067 Gig/SPECIALIST/в работе/attention block
function GigSPECIALISTAttentionBlock(_p = {}) {
  const props = {
    ..._p,
    status: _p.status ?? true,
    category: _p.category ?? false,
    timeline: _p.timeline ?? true,
    loadline: _p.loadline ?? "",
    description: _p.description ?? true,
    prop: _p.prop ?? true,
    loadline2: _p.loadline2 ?? "",
    loadline3: _p.loadline3 ?? ""
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 280,
      borderRadius: 8,
      background: "radial-gradient(280px 166px at 50.00% 0.00%, rgba(19,121,243,0.4) 0.00%, rgba(19,121,243,0.08) 46.63%, rgba(19,121,243,0) 100.00%), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
      boxShadow: "inset 0 0 0 0.500px rgba(255,255,255,0.08), 0 0 0 0.500px rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      padding: "12px 12px 12px 12px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      width: 294,
      flexShrink: 0
    },
    verificationMark: true,
    info: false,
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      justifyContent: "flex-end",
      alignItems: "center",
      flexShrink: 0
    }
  }, props.category && /*#__PURE__*/React.createElement(CategoryBlueXS, {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }), props.status && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(StatusSPECIALISTXS, null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text1 ?? "Миграция аналитического дашборда на Next.js 14"), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "16px",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности.")), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "25.08.2025"))));
}

// figma node: 2778:2931 icon / bootstrap / outline & logos / pencil
function IconBootstrapOutlineLogosPencil(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 16.001,
    viewBox: "0 0 16.001 16.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: -0.001,
      width: 16.001,
      height: 16.001
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.146 0.147 C 12.192 0.1 12.247 0.063 12.308 0.038 C 12.369 0.013 12.434 0 12.5 0 C 12.566 0 12.631 0.013 12.691 0.038 C 12.752 0.063 12.807 0.1 12.854 0.147 L 15.854 3.147 C 15.9 3.193 15.937 3.249 15.963 3.309 C 15.988 3.37 16.001 3.435 16.001 3.501 C 16.001 3.567 15.988 3.632 15.963 3.693 C 15.937 3.753 15.9 3.808 15.854 3.855 L 5.854 13.855 C 5.806 13.903 5.749 13.94 5.686 13.965 L 0.686 15.965 C 0.595 16.001 0.495 16.01 0.4 15.991 C 0.304 15.971 0.216 15.923 0.146 15.854 C 0.077 15.785 0.03 15.697 0.01 15.601 C -0.009 15.505 -0.001 15.406 0.036 15.315 L 2.036 10.315 C 2.061 10.252 2.098 10.195 2.146 10.147 L 12.146 0.147 L 12.146 0.147 Z M 11.207 2.501 L 13.5 4.794 L 14.793 3.501 L 12.5 1.208 L 11.207 2.501 Z M 12.793 5.501 L 10.5 3.208 L 4 9.708 L 4 10.001 L 4.5 10.001 C 4.632 10.001 4.76 10.054 4.853 10.147 C 4.947 10.241 5 10.368 5 10.501 L 5 11.001 L 5.5 11.001 C 5.632 11.001 5.76 11.054 5.853 11.147 C 5.947 11.241 6 11.368 6 11.501 L 6 12.001 L 6.293 12.001 L 12.793 5.501 L 12.793 5.501 Z M 3.032 10.676 L 2.926 10.782 L 1.398 14.603 L 5.219 13.075 L 5.325 12.969 C 5.229 12.933 5.147 12.869 5.089 12.786 C 5.031 12.702 5 12.603 5 12.501 L 5 12.001 L 4.5 12.001 C 4.367 12.001 4.24 11.948 4.146 11.854 C 4.052 11.761 4 11.634 4 11.501 L 4 11.001 L 3.5 11.001 C 3.398 11.001 3.299 10.97 3.215 10.912 C 3.131 10.854 3.067 10.771 3.032 10.676 L 3.032 10.676 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 3398:7361 Message/attention block
function MessageAttentionBlock(_p = {}) {
  const props = {
    ..._p,
    counter: _p.counter ?? true
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 275,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      height: 20,
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 22,
      height: 22,
      borderRadius: 666,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "3px 3px 3px 3px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? "), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "Кристина"))));
}

// figma node: 3367:3916 attention card (12 variants)
const __venc_AttentionCard = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_AttentionCard = p => "property=" + __venc_AttentionCard(p.property) + '|' + "uSER=" + __venc_AttentionCard(p.uSER);
function AttentionCard(_p = {}) {
  const props = {
    ..._p,
    property: _p.property ?? "смена статуса",
    uSER: _p.uSER ?? "specialist"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "👀")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Новый статус"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigSPECIALISTAttentionBlock, {
    style: {
      position: "relative",
      height: 132,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    description: true,
    timeline: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "К проекту",
    property: "primary",
    state: "default"
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "💬")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Новые сообщения"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(MessageAttentionBlock, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 93,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Ответить",
    property: "primary",
    state: "default"
  })));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "⏳")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Скоро дедлайн"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigSPECIALISTAttentionBlock, {
    style: {
      position: "relative",
      height: 126,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "Остался 1 день")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 71,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Button, {
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Сдать",
    property: "primary",
    state: "default"
  }))));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "🤝")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Заявка принята"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigSPECIALISTAttentionBlock, {
    style: {
      position: "relative",
      height: 146,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    category: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 111,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Приступить",
    property: "primary",
    state: "default"
  })));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "⛔")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Заявка отклонена"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      width: 294,
      flexShrink: 0
    },
    info: false,
    sizeFor: "gig",
    uSER: "company"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\u041C\u0438\u0433\u0440\u0430\u0446\u0438\u044F \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430 \u043D\u0430 Next.js 14"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 134,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Найти проекты",
    property: "primary",
    state: "default"
  })));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "💰")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Получена оплата"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigFull4, {
    style: {
      position: "relative",
      height: 185,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 137,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Оставить отзыв",
    property: "primary",
    state: "default"
  })));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "👀")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Нет ответа"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 142,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      width: 294,
      flexShrink: 0
    },
    verificationMark: true,
    info: false,
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      justifyContent: "flex-end",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(StatusSPECIALISTXS, {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\u041C\u0438\u0433\u0440\u0430\u0446\u0438\u044F \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430 \u043D\u0430 Next.js 14"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "16px",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u043E\u043F\u044B\u0442\u043D\u044B\u0439 React \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u0434\u043B\u044F \u0440\u0435\u0444\u0430\u043A\u0442\u043E\u0440\u0438\u043D\u0433\u0430 \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430. \u0424\u043E\u043A\u0443\u0441 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u044B\u0445 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430\u0445 \u0434\u043B\u044F \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u0438 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u0438."))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 124,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "К проекту",
    property: "primary",
    state: "default"
  })));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "💬")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Новые сообщения"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(MessageAttentionBlock, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 116,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Ответить",
    property: "primary",
    state: "default"
  })));
  const __body8 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "⏳")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Нет заявок"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigSPECIALISTAttentionBlock, {
    style: {
      position: "relative",
      height: 150,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "Остался 1 день")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 90,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Сдать",
    property: "primary",
    state: "default"
  })));
  const __body9 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "🤝")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Ждёт проверки"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigSPECIALISTAttentionBlock, {
    style: {
      position: "relative",
      height: 170,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    category: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 132,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Приступить",
    property: "primary",
    state: "default"
  })));
  const __body10 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "💰")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "К оплате"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(GigFull4, {
    style: {
      position: "relative",
      height: 209,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 166,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Оставить отзыв",
    property: "primary",
    state: "default"
  })));
  const __body11 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(0,0,0)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "⛔")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "20px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Гиг закрыт"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "1 нед.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "0px 12px 0px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 133,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      width: 294,
      flexShrink: 0
    },
    info: false,
    sizeFor: "gig",
    uSER: "company"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 63,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\u041C\u0438\u0433\u0440\u0430\u0446\u0438\u044F \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430 \u043D\u0430 Next.js 14"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "0px 12px 0px 16px",
      justifyContent: "center",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      width: 158,
      flexShrink: 0
    },
    icon: false,
    iconType: /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPencil, null),
    text: "Найти проекты",
    property: "primary",
    state: "default"
  })));
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
    "property=заявка отклонена|uSER=company": __body11
  };
  return (__impls[__vkey_AttentionCard(props)] ?? __body0)();
}

// figma node: 2728:540 Bag (12 variants)
const __venc_Bag = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Bag = p => "format=" + __venc_Bag(p.format) + '|' + "weight=" + __venc_Bag(p.weight);
function Bag(_p = {}) {
  const props = {
    ..._p,
    format: _p.format ?? "outline",
    weight: _p.weight ?? "bold"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      color: "rgb(52,51,48)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 26,
    height: 25,
    viewBox: "0 0 26 25",
    fill: "none",
    style: {
      position: "absolute",
      left: 3,
      top: 2,
      width: 26,
      height: 25
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 24 6 L 19 6 C 19 4.409 18.368 2.883 17.243 1.757 C 16.117 0.632 14.591 0 13 0 C 11.409 0 9.883 0.632 8.757 1.757 C 7.632 2.883 7 4.409 7 6 L 2 6 C 1.47 6 0.961 6.211 0.586 6.586 C 0.211 6.961 0 7.47 0 8 L 0 23 C 0 23.53 0.211 24.039 0.586 24.414 C 0.961 24.789 1.47 25 2 25 L 24 25 C 24.53 25 25.039 24.789 25.414 24.414 C 25.789 24.039 26 23.53 26 23 L 26 8 C 26 7.47 25.789 6.961 25.414 6.586 C 25.039 6.211 24.53 6 24 6 Z M 13 2 C 14.061 2 15.078 2.421 15.828 3.172 C 16.579 3.922 17 4.939 17 6 L 9 6 C 9 4.939 9.421 3.922 10.172 3.172 C 10.922 2.421 11.939 2 13 2 Z M 24 23 L 2 23 L 2 8 L 7 8 L 7 10 C 7 10.265 7.105 10.52 7.293 10.707 C 7.48 10.895 7.735 11 8 11 C 8.265 11 8.52 10.895 8.707 10.707 C 8.895 10.52 9 10.265 9 10 L 9 8 L 17 8 L 17 10 C 17 10.265 17.105 10.52 17.293 10.707 C 17.48 10.895 17.735 11 18 11 C 18.265 11 18.52 10.895 18.707 10.707 C 18.895 10.52 19 10.265 19 10 L 19 8 L 24 8 L 24 23 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      color: "rgb(52,51,48)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 25,
    height: 24,
    viewBox: "0 0 25 24",
    fill: "none",
    style: {
      position: "absolute",
      left: 3.5,
      top: 2.5,
      width: 25,
      height: 24
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23.5 6 L 18 6 L 18 5.5 C 18 4.041 17.421 2.642 16.389 1.611 C 15.358 0.579 13.959 0 12.5 0 C 11.041 0 9.642 0.579 8.611 1.611 C 7.579 2.642 7 4.041 7 5.5 L 7 6 L 1.5 6 C 1.102 6 0.721 6.158 0.439 6.439 C 0.158 6.721 0 7.102 0 7.5 L 0 22.5 C 0 22.898 0.158 23.279 0.439 23.561 C 0.721 23.842 1.102 24 1.5 24 L 23.5 24 C 23.898 24 24.279 23.842 24.561 23.561 C 24.842 23.279 25 22.898 25 22.5 L 25 7.5 C 25 7.102 24.842 6.721 24.561 6.439 C 24.279 6.158 23.898 6 23.5 6 Z M 8 5.5 C 8 4.307 8.474 3.162 9.318 2.318 C 10.162 1.474 11.307 1 12.5 1 C 13.693 1 14.838 1.474 15.682 2.318 C 16.526 3.162 17 4.307 17 5.5 L 17 6 L 8 6 L 8 5.5 Z M 24 22.5 C 24 22.633 23.947 22.76 23.854 22.854 C 23.76 22.947 23.633 23 23.5 23 L 1.5 23 C 1.367 23 1.24 22.947 1.146 22.854 C 1.053 22.76 1 22.633 1 22.5 L 1 7.5 C 1 7.367 1.053 7.24 1.146 7.146 C 1.24 7.053 1.367 7 1.5 7 L 7 7 L 7 9.5 C 7 9.633 7.053 9.76 7.146 9.854 C 7.24 9.947 7.367 10 7.5 10 C 7.633 10 7.76 9.947 7.854 9.854 C 7.947 9.76 8 9.633 8 9.5 L 8 7 L 17 7 L 17 9.5 C 17 9.633 17.053 9.76 17.146 9.854 C 17.24 9.947 17.367 10 17.5 10 C 17.633 10 17.76 9.947 17.854 9.854 C 17.947 9.76 18 9.633 18 9.5 L 18 7 L 23.5 7 C 23.633 7 23.76 7.053 23.854 7.146 C 23.947 7.24 24 7.367 24 7.5 L 24 22.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      color: "rgb(52,51,48)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 25.500,
    height: 24.500,
    viewBox: "0 0 25.500 24.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 3.25,
      top: 2.25,
      width: 25.5,
      height: 24.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23.75 6 L 18.5 6 L 18.5 5.75 C 18.5 4.225 17.894 2.762 16.816 1.684 C 15.738 0.606 14.275 0 12.75 0 C 11.225 0 9.762 0.606 8.684 1.684 C 7.606 2.762 7 4.225 7 5.75 L 7 6 L 1.75 6 C 1.286 6 0.841 6.184 0.513 6.513 C 0.184 6.841 0 7.286 0 7.75 L 0 22.75 C 0 23.214 0.184 23.659 0.513 23.987 C 0.841 24.316 1.286 24.5 1.75 24.5 L 23.75 24.5 C 24.214 24.5 24.659 24.316 24.987 23.987 C 25.316 23.659 25.5 23.214 25.5 22.75 L 25.5 7.75 C 25.5 7.286 25.316 6.841 24.987 6.513 C 24.659 6.184 24.214 6 23.75 6 Z M 8.5 5.75 C 8.5 4.623 8.948 3.542 9.745 2.745 C 10.542 1.948 11.623 1.5 12.75 1.5 C 13.877 1.5 14.958 1.948 15.755 2.745 C 16.552 3.542 17 4.623 17 5.75 L 17 6 L 8.5 6 L 8.5 5.75 Z M 24 22.75 C 24 22.816 23.974 22.88 23.927 22.927 C 23.88 22.974 23.816 23 23.75 23 L 1.75 23 C 1.684 23 1.62 22.974 1.573 22.927 C 1.526 22.88 1.5 22.816 1.5 22.75 L 1.5 7.75 C 1.5 7.684 1.526 7.62 1.573 7.573 C 1.62 7.526 1.684 7.5 1.75 7.5 L 7 7.5 L 7 9.75 C 7 9.949 7.079 10.14 7.22 10.28 C 7.36 10.421 7.551 10.5 7.75 10.5 C 7.949 10.5 8.14 10.421 8.28 10.28 C 8.421 10.14 8.5 9.949 8.5 9.75 L 8.5 7.5 L 17 7.5 L 17 9.75 C 17 9.949 17.079 10.14 17.22 10.28 C 17.36 10.421 17.551 10.5 17.75 10.5 C 17.949 10.5 18.14 10.421 18.28 10.28 C 18.421 10.14 18.5 9.949 18.5 9.75 L 18.5 7.5 L 23.75 7.5 C 23.816 7.5 23.88 7.526 23.927 7.573 C 23.974 7.62 24 7.684 24 7.75 L 24 22.75 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      color: "rgb(52,51,48)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 27,
    height: 25.975,
    viewBox: "0 0 27 25.975",
    fill: "none",
    style: {
      position: "absolute",
      left: 2.5,
      top: 1.525,
      width: 27,
      height: 25.975
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 24.5 5.975 L 19.979 5.975 C 19.847 4.347 19.107 2.829 17.907 1.722 C 16.706 0.615 15.133 0 13.5 0 C 11.867 0 10.294 0.615 9.093 1.722 C 7.893 2.829 7.153 4.347 7.021 5.975 L 2.5 5.975 C 1.837 5.975 1.201 6.238 0.732 6.707 C 0.263 7.176 0 7.812 0 8.475 L 0 23.475 C 0 24.138 0.263 24.774 0.732 25.243 C 1.201 25.711 1.837 25.975 2.5 25.975 L 24.5 25.975 C 25.163 25.975 25.799 25.711 26.268 25.243 C 26.737 24.774 27 24.138 27 23.475 L 27 8.475 C 27 7.812 26.737 7.176 26.268 6.707 C 25.799 6.238 25.163 5.975 24.5 5.975 Z M 13.5 2.975 C 14.342 2.975 15.155 3.278 15.791 3.829 C 16.427 4.38 16.844 5.142 16.964 5.975 L 10.036 5.975 C 10.156 5.142 10.573 4.38 11.209 3.829 C 11.845 3.278 12.658 2.975 13.5 2.975 Z M 24 22.975 L 3 22.975 L 3 8.975 L 7 8.975 L 7 10.475 C 7 10.873 7.158 11.254 7.439 11.535 C 7.721 11.817 8.102 11.975 8.5 11.975 C 8.898 11.975 9.279 11.817 9.561 11.535 C 9.842 11.254 10 10.873 10 10.475 L 10 8.975 L 17 8.975 L 17 10.475 C 17 10.873 17.158 11.254 17.439 11.535 C 17.721 11.817 18.102 11.975 18.5 11.975 C 18.898 11.975 19.279 11.817 19.561 11.535 C 19.842 11.254 20 10.873 20 10.475 L 20 8.975 L 24 8.975 L 24 22.975 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      color: "rgb(52,51,48)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 26,
    height: 25,
    viewBox: "0 0 26 25",
    fill: "none",
    style: {
      position: "absolute",
      left: 3,
      top: 2,
      width: 26,
      height: 25
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 24 6 L 19 6 C 19 4.409 18.368 2.883 17.243 1.757 C 16.117 0.632 14.591 0 13 0 C 11.409 0 9.883 0.632 8.757 1.757 C 7.632 2.883 7 4.409 7 6 L 2 6 C 1.47 6 0.961 6.211 0.586 6.586 C 0.211 6.961 0 7.47 0 8 L 0 23 C 0 23.53 0.211 24.039 0.586 24.414 C 0.961 24.789 1.47 25 2 25 L 24 25 C 24.53 25 25.039 24.789 25.414 24.414 C 25.789 24.039 26 23.53 26 23 L 26 8 C 26 7.47 25.789 6.961 25.414 6.586 C 25.039 6.211 24.53 6 24 6 Z M 9 11 C 9 11.265 8.895 11.52 8.707 11.707 C 8.52 11.895 8.265 12 8 12 C 7.735 12 7.48 11.895 7.293 11.707 C 7.105 11.52 7 11.265 7 11 L 7 9 C 7 8.735 7.105 8.48 7.293 8.293 C 7.48 8.105 7.735 8 8 8 C 8.265 8 8.52 8.105 8.707 8.293 C 8.895 8.48 9 8.735 9 9 L 9 11 Z M 13 2 C 14.061 2 15.078 2.421 15.828 3.172 C 16.579 3.922 17 4.939 17 6 L 9 6 C 9 4.939 9.421 3.922 10.172 3.172 C 10.922 2.421 11.939 2 13 2 Z M 19 11 C 19 11.265 18.895 11.52 18.707 11.707 C 18.52 11.895 18.265 12 18 12 C 17.735 12 17.48 11.895 17.293 11.707 C 17.105 11.52 17 11.265 17 11 L 17 9 C 17 8.735 17.105 8.48 17.293 8.293 C 17.48 8.105 17.735 8 18 8 C 18.265 8 18.52 8.105 18.707 8.293 C 18.895 8.48 19 8.735 19 9 L 19 11 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      color: "rgb(52,51,48)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      opacity: 0.2
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 24 1 L 24 16 C 24 16.265 23.895 16.52 23.707 16.707 C 23.52 16.895 23.265 17 23 17 L 1 17 C 0.735 17 0.48 16.895 0.293 16.707 C 0.105 16.52 0 16.265 0 16 L 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 23 0 C 23.265 0 23.52 0.105 23.707 0.293 C 23.895 0.48 24 0.735 24 1 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 26,
    height: 25,
    viewBox: "0 0 26 25",
    fill: "none",
    style: {
      position: "absolute",
      left: 3,
      top: 2,
      width: 26,
      height: 25
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 24 6 L 19 6 C 19 4.409 18.368 2.883 17.243 1.757 C 16.117 0.632 14.591 0 13 0 C 11.409 0 9.883 0.632 8.757 1.757 C 7.632 2.883 7 4.409 7 6 L 2 6 C 1.47 6 0.961 6.211 0.586 6.586 C 0.211 6.961 0 7.47 0 8 L 0 23 C 0 23.53 0.211 24.039 0.586 24.414 C 0.961 24.789 1.47 25 2 25 L 24 25 C 24.53 25 25.039 24.789 25.414 24.414 C 25.789 24.039 26 23.53 26 23 L 26 8 C 26 7.47 25.789 6.961 25.414 6.586 C 25.039 6.211 24.53 6 24 6 Z M 13 2 C 14.061 2 15.078 2.421 15.828 3.172 C 16.579 3.922 17 4.939 17 6 L 9 6 C 9 4.939 9.421 3.922 10.172 3.172 C 10.922 2.421 11.939 2 13 2 Z M 24 23 L 2 23 L 2 8 L 7 8 L 7 10 C 7 10.265 7.105 10.52 7.293 10.707 C 7.48 10.895 7.735 11 8 11 C 8.265 11 8.52 10.895 8.707 10.707 C 8.895 10.52 9 10.265 9 10 L 9 8 L 17 8 L 17 10 C 17 10.265 17.105 10.52 17.293 10.707 C 17.48 10.895 17.735 11 18 11 C 18.265 11 18.52 10.895 18.707 10.707 C 18.895 10.52 19 10.265 19 10 L 19 8 L 24 8 L 24 23 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      border: "1px dashed currentColor",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 10,
      opacity: 0.45
    }
  }, "Vector"), /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 0 L 1 1 L 23 1 L 23 0 L 23 -1 L 1 -1 L 1 0 Z M 23 0 L 23 1 L 24 1 L 25 1 C 25 -0.105 24.105 -1 23 -1 L 23 0 Z M 24 1 L 23 1 L 23 16 L 24 16 L 25 16 L 25 1 L 24 1 Z M 24 16 L 23 16 L 23 17 L 23 18 C 24.105 18 25 17.105 25 16 L 24 16 Z M 23 17 L 23 16 L 1 16 L 1 17 L 1 18 L 23 18 L 23 17 Z M 1 17 L 1 16 L 0 16 L -1 16 C -1 17.105 -0.105 18 1 18 L 1 17 Z M 0 16 L 1 16 L 1 1 L 0 1 L -1 1 L -1 16 L 0 16 Z M 0 1 L 1 1 L 1 0 L 1 -1 C -0.105 -1 -1 -0.105 -1 1 L 0 1 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 9,
    viewBox: "0 0 10 9",
    fill: "none",
    style: {
      position: "absolute",
      left: 11,
      top: 3,
      width: 10,
      height: 9,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -1 9 C -1 9.552 -0.552 10 0 10 C 0.552 10 1 9.552 1 9 L 0 9 L -1 9 Z M 0 5 L -1 5 L 0 5 Z M 5 0 L 5 -1 L 5 0 Z M 9 9 C 9 9.552 9.448 10 10 10 C 10.552 10 11 9.552 11 9 L 10 9 L 9 9 Z M 0 9 L 1 9 L 1 5 L 0 5 L -1 5 L -1 9 L 0 9 Z M 0 5 L 1 5 C 1 3.939 1.421 2.922 2.172 2.172 L 1.464 1.464 L 0.757 0.757 C -0.368 1.883 -1 3.409 -1 5 L 0 5 Z M 1.464 1.464 L 2.172 2.172 C 2.922 1.421 3.939 1 5 1 L 5 0 L 5 -1 C 3.409 -1 1.883 -0.368 0.757 0.757 L 1.464 1.464 Z M 5 0 L 5 1 C 6.061 1 7.078 1.421 7.828 2.172 L 8.536 1.464 L 9.243 0.757 C 8.117 -0.368 6.591 -1 5 -1 L 5 0 Z M 8.536 1.464 L 7.828 2.172 C 8.579 2.922 9 3.939 9 5 L 10 5 L 11 5 C 11 3.409 10.368 1.883 9.243 0.757 L 8.536 1.464 Z M 10 5 L 9 5 L 9 9 L 10 9 L 11 9 L 11 5 L 10 5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      border: "1px dashed currentColor",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 10,
      opacity: 0.45
    }
  }, "Vector"), /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 0 L 1 0.5 L 23 0.5 L 23 0 L 23 -0.5 L 1 -0.5 L 1 0 Z M 23 0 L 23 0.5 C 23.276 0.5 23.5 0.724 23.5 1 L 24 1 L 24.5 1 C 24.5 0.172 23.828 -0.5 23 -0.5 L 23 0 Z M 24 1 L 23.5 1 L 23.5 16 L 24 16 L 24.5 16 L 24.5 1 L 24 1 Z M 24 16 L 23.5 16 C 23.5 16.276 23.276 16.5 23 16.5 L 23 17 L 23 17.5 C 23.828 17.5 24.5 16.828 24.5 16 L 24 16 Z M 23 17 L 23 16.5 L 1 16.5 L 1 17 L 1 17.5 L 23 17.5 L 23 17 Z M 1 17 L 1 16.5 C 0.724 16.5 0.5 16.276 0.5 16 L 0 16 L -0.5 16 C -0.5 16.828 0.172 17.5 1 17.5 L 1 17 Z M 0 16 L 0.5 16 L 0.5 1 L 0 1 L -0.5 1 L -0.5 16 L 0 16 Z M 0 1 L 0.5 1 C 0.5 0.724 0.724 0.5 1 0.5 L 1 0 L 1 -0.5 C 0.172 -0.5 -0.5 0.172 -0.5 1 L 0 1 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 9,
    viewBox: "0 0 10 9",
    fill: "none",
    style: {
      position: "absolute",
      left: 11,
      top: 3,
      width: 10,
      height: 9,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -0.5 9 C -0.5 9.276 -0.276 9.5 0 9.5 C 0.276 9.5 0.5 9.276 0.5 9 L 0 9 L -0.5 9 Z M 0 5 L -0.5 5 L 0 5 Z M 5 0 L 5 -0.5 L 5 0 Z M 9.5 9 C 9.5 9.276 9.724 9.5 10 9.5 C 10.276 9.5 10.5 9.276 10.5 9 L 10 9 L 9.5 9 Z M 0 9 L 0.5 9 L 0.5 5 L 0 5 L -0.5 5 L -0.5 9 L 0 9 Z M 0 5 L 0.5 5 C 0.5 3.807 0.974 2.662 1.818 1.818 L 1.464 1.464 L 1.111 1.111 C 0.079 2.142 -0.5 3.541 -0.5 5 L 0 5 Z M 1.464 1.464 L 1.818 1.818 C 2.662 0.974 3.807 0.5 5 0.5 L 5 0 L 5 -0.5 C 3.541 -0.5 2.142 0.079 1.111 1.111 L 1.464 1.464 Z M 5 0 L 5 0.5 C 6.193 0.5 7.338 0.974 8.182 1.818 L 8.536 1.464 L 8.889 1.111 C 7.858 0.079 6.459 -0.5 5 -0.5 L 5 0 Z M 8.536 1.464 L 8.182 1.818 C 9.026 2.662 9.5 3.807 9.5 5 L 10 5 L 10.5 5 C 10.5 3.541 9.921 2.142 8.889 1.111 L 8.536 1.464 Z M 10 5 L 9.5 5 L 9.5 9 L 10 9 L 10.5 9 L 10.5 5 L 10 5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body8 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      border: "1px dashed currentColor",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 10,
      opacity: 0.45
    }
  }, "Vector"), /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 0 L 1 0.75 L 23 0.75 L 23 0 L 23 -0.75 L 1 -0.75 L 1 0 Z M 23 0 L 23 0.75 C 23.138 0.75 23.25 0.862 23.25 1 L 24 1 L 24.75 1 C 24.75 0.034 23.966 -0.75 23 -0.75 L 23 0 Z M 24 1 L 23.25 1 L 23.25 16 L 24 16 L 24.75 16 L 24.75 1 L 24 1 Z M 24 16 L 23.25 16 C 23.25 16.138 23.138 16.25 23 16.25 L 23 17 L 23 17.75 C 23.966 17.75 24.75 16.966 24.75 16 L 24 16 Z M 23 17 L 23 16.25 L 1 16.25 L 1 17 L 1 17.75 L 23 17.75 L 23 17 Z M 1 17 L 1 16.25 C 0.862 16.25 0.75 16.138 0.75 16 L 0 16 L -0.75 16 C -0.75 16.966 0.034 17.75 1 17.75 L 1 17 Z M 0 16 L 0.75 16 L 0.75 1 L 0 1 L -0.75 1 L -0.75 16 L 0 16 Z M 0 1 L 0.75 1 C 0.75 0.862 0.862 0.75 1 0.75 L 1 0 L 1 -0.75 C 0.034 -0.75 -0.75 0.034 -0.75 1 L 0 1 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 9,
    viewBox: "0 0 10 9",
    fill: "none",
    style: {
      position: "absolute",
      left: 11,
      top: 3,
      width: 10,
      height: 9,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -0.75 9 C -0.75 9.414 -0.414 9.75 0 9.75 C 0.414 9.75 0.75 9.414 0.75 9 L 0 9 L -0.75 9 Z M 0 5 L -0.75 5 L 0 5 Z M 5 0 L 5 -0.75 L 5 0 Z M 9.25 9 C 9.25 9.414 9.586 9.75 10 9.75 C 10.414 9.75 10.75 9.414 10.75 9 L 10 9 L 9.25 9 Z M 0 9 L 0.75 9 L 0.75 5 L 0 5 L -0.75 5 L -0.75 9 L 0 9 Z M 0 5 L 0.75 5 C 0.75 3.873 1.198 2.792 1.995 1.995 L 1.464 1.464 L 0.934 0.934 C -0.144 2.012 -0.75 3.475 -0.75 5 L 0 5 Z M 1.464 1.464 L 1.995 1.995 C 2.792 1.198 3.873 0.75 5 0.75 L 5 0 L 5 -0.75 C 3.475 -0.75 2.012 -0.144 0.934 0.934 L 1.464 1.464 Z M 5 0 L 5 0.75 C 6.127 0.75 7.208 1.198 8.005 1.995 L 8.536 1.464 L 9.066 0.934 C 7.988 -0.144 6.525 -0.75 5 -0.75 L 5 0 Z M 8.536 1.464 L 8.005 1.995 C 8.802 2.792 9.25 3.873 9.25 5 L 10 5 L 10.75 5 C 10.75 3.475 10.144 2.012 9.066 0.934 L 8.536 1.464 Z M 10 5 L 9.25 5 L 9.25 9 L 10 9 L 10.75 9 L 10.75 5 L 10 5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body9 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      border: "1px dashed currentColor",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 10,
      opacity: 0.45
    }
  }, "Vector"), /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 0 L 1 1.5 L 23 1.5 L 23 0 L 23 -1.5 L 1 -1.5 L 1 0 Z M 23 0 L 23 1.5 C 22.724 1.5 22.5 1.276 22.5 1 L 24 1 L 25.5 1 C 25.5 -0.381 24.381 -1.5 23 -1.5 L 23 0 Z M 24 1 L 22.5 1 L 22.5 16 L 24 16 L 25.5 16 L 25.5 1 L 24 1 Z M 24 16 L 22.5 16 C 22.5 15.724 22.724 15.5 23 15.5 L 23 17 L 23 18.5 C 24.381 18.5 25.5 17.381 25.5 16 L 24 16 Z M 23 17 L 23 15.5 L 1 15.5 L 1 17 L 1 18.5 L 23 18.5 L 23 17 Z M 1 17 L 1 15.5 C 1.276 15.5 1.5 15.724 1.5 16 L 0 16 L -1.5 16 C -1.5 17.381 -0.381 18.5 1 18.5 L 1 17 Z M 0 16 L 1.5 16 L 1.5 1 L 0 1 L -1.5 1 L -1.5 16 L 0 16 Z M 0 1 L 1.5 1 C 1.5 1.276 1.276 1.5 1 1.5 L 1 0 L 1 -1.5 C -0.381 -1.5 -1.5 -0.381 -1.5 1 L 0 1 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 9,
    viewBox: "0 0 10 9",
    fill: "none",
    style: {
      position: "absolute",
      left: 11,
      top: 3,
      width: 10,
      height: 9,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -1.5 9 C -1.5 9.828 -0.828 10.5 0 10.5 C 0.828 10.5 1.5 9.828 1.5 9 L 0 9 L -1.5 9 Z M 0 5 L -1.5 5 L 0 5 Z M 5 0 L 5 -1.5 L 5 0 Z M 8.5 9 C 8.5 9.828 9.172 10.5 10 10.5 C 10.828 10.5 11.5 9.828 11.5 9 L 10 9 L 8.5 9 Z M 0 9 L 1.5 9 L 1.5 5 L 0 5 L -1.5 5 L -1.5 9 L 0 9 Z M 0 5 L 1.5 5 C 1.5 4.072 1.869 3.182 2.525 2.525 L 1.464 1.464 L 0.404 0.404 C -0.815 1.623 -1.5 3.276 -1.5 5 L 0 5 Z M 1.464 1.464 L 2.525 2.525 C 3.182 1.869 4.072 1.5 5 1.5 L 5 0 L 5 -1.5 C 3.276 -1.5 1.623 -0.815 0.404 0.404 L 1.464 1.464 Z M 5 0 L 5 1.5 C 5.928 1.5 6.818 1.869 7.475 2.525 L 8.536 1.464 L 9.596 0.404 C 8.377 -0.815 6.724 -1.5 5 -1.5 L 5 0 Z M 8.536 1.464 L 7.475 2.525 C 8.131 3.182 8.5 4.072 8.5 5 L 10 5 L 11.5 5 C 11.5 3.276 10.815 1.623 9.596 0.404 L 8.536 1.464 Z M 10 5 L 8.5 5 L 8.5 9 L 10 9 L 11.5 9 L 11.5 5 L 10 5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body10 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      border: "1px dashed currentColor",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 10,
      opacity: 0.45
    }
  }, "Vector"), /*#__PURE__*/React.createElement("svg", {
    width: 26,
    height: 25,
    viewBox: "0 0 26 25",
    fill: "none",
    style: {
      position: "absolute",
      left: 3,
      top: 2,
      width: 26,
      height: 25,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 24 6 L 19 6 C 19 4.409 18.368 2.883 17.243 1.757 C 16.117 0.632 14.591 0 13 0 C 11.409 0 9.883 0.632 8.757 1.757 C 7.632 2.883 7 4.409 7 6 L 2 6 C 1.47 6 0.961 6.211 0.586 6.586 C 0.211 6.961 0 7.47 0 8 L 0 23 C 0 23.53 0.211 24.039 0.586 24.414 C 0.961 24.789 1.47 25 2 25 L 24 25 C 24.53 25 25.039 24.789 25.414 24.414 C 25.789 24.039 26 23.53 26 23 L 26 8 C 26 7.47 25.789 6.961 25.414 6.586 C 25.039 6.211 24.53 6 24 6 Z M 9 11 C 9 11.265 8.895 11.52 8.707 11.707 C 8.52 11.895 8.265 12 8 12 C 7.735 12 7.48 11.895 7.293 11.707 C 7.105 11.52 7 11.265 7 11 L 7 9 C 7 8.735 7.105 8.48 7.293 8.293 C 7.48 8.105 7.735 8 8 8 C 8.265 8 8.52 8.105 8.707 8.293 C 8.895 8.48 9 8.735 9 9 L 9 11 Z M 13 2 C 14.061 2 15.078 2.421 15.828 3.172 C 16.579 3.922 17 4.939 17 6 L 9 6 C 9 4.939 9.421 3.922 10.172 3.172 C 10.922 2.421 11.939 2 13 2 Z M 19 11 C 19 11.265 18.895 11.52 18.707 11.707 C 18.52 11.895 18.265 12 18 12 C 17.735 12 17.48 11.895 17.293 11.707 C 17.105 11.52 17 11.265 17 11 L 17 9 C 17 8.735 17.105 8.48 17.293 8.293 C 17.48 8.105 17.735 8 18 8 C 18.265 8 18.52 8.105 18.707 8.293 C 18.895 8.48 19 8.735 19 9 L 19 11 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body11 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 32,
      height: 32,
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      border: "1px dashed currentColor",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 10,
      opacity: 0.45
    }
  }, "Vector"), /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      opacity: 0.2,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23 0 L 1 0 C 0.448 0 0 0.448 0 1 L 0 16 C 0 16.552 0.448 17 1 17 L 23 17 C 23.552 17 24 16.552 24 16 L 24 1 C 24 0.448 23.552 0 23 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 24,
    height: 17,
    viewBox: "0 0 24 17",
    fill: "none",
    style: {
      position: "absolute",
      left: 4,
      top: 9,
      width: 24,
      height: 17,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 0 L 1 1 L 23 1 L 23 0 L 23 -1 L 1 -1 L 1 0 Z M 23 0 L 23 1 L 24 1 L 25 1 C 25 -0.105 24.105 -1 23 -1 L 23 0 Z M 24 1 L 23 1 L 23 16 L 24 16 L 25 16 L 25 1 L 24 1 Z M 24 16 L 23 16 L 23 17 L 23 18 C 24.105 18 25 17.105 25 16 L 24 16 Z M 23 17 L 23 16 L 1 16 L 1 17 L 1 18 L 23 18 L 23 17 Z M 1 17 L 1 16 L 0 16 L -1 16 C -1 17.105 -0.105 18 1 18 L 1 17 Z M 0 16 L 1 16 L 1 1 L 0 1 L -1 1 L -1 16 L 0 16 Z M 0 1 L 1 1 L 1 0 L 1 -1 C -0.105 -1 -1 -0.105 -1 1 L 0 1 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 9,
    viewBox: "0 0 10 9",
    fill: "none",
    style: {
      position: "absolute",
      left: 11,
      top: 3,
      width: 10,
      height: 9,
      color: "rgb(52,51,48)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M -1 9 C -1 9.552 -0.552 10 0 10 C 0.552 10 1 9.552 1 9 L 0 9 L -1 9 Z M 0 5 L -1 5 L 0 5 Z M 5 0 L 5 -1 L 5 0 Z M 9 9 C 9 9.552 9.448 10 10 10 C 10.552 10 11 9.552 11 9 L 10 9 L 9 9 Z M 0 9 L 1 9 L 1 5 L 0 5 L -1 5 L -1 9 L 0 9 Z M 0 5 L 1 5 C 1 3.939 1.421 2.922 2.172 2.172 L 1.464 1.464 L 0.757 0.757 C -0.368 1.883 -1 3.409 -1 5 L 0 5 Z M 1.464 1.464 L 2.172 2.172 C 2.922 1.421 3.939 1 5 1 L 5 0 L 5 -1 C 3.409 -1 1.883 -0.368 0.757 0.757 L 1.464 1.464 Z M 5 0 L 5 1 C 6.061 1 7.078 1.421 7.828 2.172 L 8.536 1.464 L 9.243 0.757 C 8.117 -0.368 6.591 -1 5 -1 L 5 0 Z M 8.536 1.464 L 7.828 2.172 C 8.579 2.922 9 3.939 9 5 L 10 5 L 11 5 C 11 3.409 10.368 1.883 9.243 0.757 L 8.536 1.464 Z M 10 5 L 9 5 L 9 9 L 10 9 L 11 9 L 11 5 L 10 5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __impls = {
    // figma: Format=Outline, Weight=Regular
    "format=outline|weight=regular": __body0,
    // figma: Format=Outline, Weight=Thin
    "format=outline|weight=thin": __body1,
    // figma: Format=Outline, Weight=Light
    "format=outline|weight=light": __body2,
    // figma: Format=Outline, Weight=Bold
    "format=outline|weight=bold": __body3,
    // figma: Format=Outline, Weight=Fill
    "format=outline|weight=fill": __body4,
    // figma: Format=Outline, Weight=Duotone
    "format=outline|weight=duotone": __body5,
    // figma: Format=Stroke, Weight=Regular
    "format=stroke|weight=regular": __body6,
    // figma: Format=Stroke, Weight=Thin
    "format=stroke|weight=thin": __body7,
    // figma: Format=Stroke, Weight=Light
    "format=stroke|weight=light": __body8,
    // figma: Format=Stroke, Weight=Bold
    "format=stroke|weight=bold": __body9,
    // figma: Format=Stroke, Weight=Fill
    "format=stroke|weight=fill": __body10,
    // figma: Format=Stroke, Weight=Duotone
    "format=stroke|weight=duotone": __body11
  };
  return (__impls[__vkey_Bag(props)] ?? __body3)();
}

// figma node: 2619:280 Button Default (9 variants)
const __venc_ButtonDefault = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_ButtonDefault = p => "state=" + __venc_ButtonDefault(p.state) + '|' + "type=" + __venc_ButtonDefault(p.type);
function ButtonDefault(_p = {}) {
  const props = {
    ..._p,
    state: _p.state ?? "default",
    type: _p.type ?? "default"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "rgb(159,160,164)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 12,
    viewBox: "0 0 15 12",
    fill: "none",
    style: {
      position: "relative",
      width: 15,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 2.5 C 2.724 2.5 2.5 2.724 2.5 3 C 2.5 3.276 2.724 3.5 3 3.5 L 3 3 L 3 2.5 Z M 6 3.5 C 6.276 3.5 6.5 3.276 6.5 3 C 6.5 2.724 6.276 2.5 6 2.5 L 6 3 L 6 3.5 Z M 14.245 8.248 L 14.273 8.748 L 14.275 8.748 L 14.245 8.248 Z M 14.998 7.549 L 15.497 7.584 L 15.498 7.58 L 14.998 7.549 Z M 14.998 4.451 L 15.498 4.42 L 15.497 4.415 L 14.998 4.451 Z M 14.245 3.751 L 14.275 3.252 L 14.274 3.252 L 14.245 3.751 Z M 13.371 0.879 L 13.017 1.232 L 13.018 1.233 L 13.371 0.879 Z M 13.371 11.121 L 13.018 10.767 L 13.017 10.768 L 13.371 11.121 Z M 11.993 5.5 C 11.717 5.5 11.493 5.724 11.493 6 C 11.493 6.276 11.717 6.5 11.993 6.5 L 11.993 6 L 11.993 5.5 Z M 12.001 6.5 C 12.277 6.5 12.501 6.276 12.501 6 C 12.501 5.724 12.277 5.5 12.001 5.5 L 12.001 6 L 12.001 6.5 Z M 3 3 L 3 3.5 L 6 3.5 L 6 3 L 6 2.5 L 3 2.5 L 3 3 Z M 14.125 3.75 L 14.125 3.25 L 12.173 3.25 L 12.173 3.75 L 12.173 4.25 L 14.125 4.25 L 14.125 3.75 Z M 12.173 3.75 L 12.173 3.25 C 10.594 3.25 9.25 4.447 9.25 6 L 9.75 6 L 10.25 6 C 10.25 5.068 11.075 4.25 12.173 4.25 L 12.173 3.75 Z M 9.75 6 L 9.25 6 C 9.25 7.553 10.595 8.75 12.172 8.75 L 12.172 8.25 L 12.172 7.75 C 11.076 7.75 10.25 6.932 10.25 6 L 9.75 6 Z M 12.172 8.25 L 12.172 8.75 L 14.125 8.75 L 14.125 8.25 L 14.125 7.75 L 12.172 7.75 L 12.172 8.25 Z M 14.125 8.25 L 14.125 8.75 C 14.181 8.75 14.229 8.75 14.273 8.748 L 14.245 8.248 L 14.216 7.749 C 14.208 7.75 14.195 7.75 14.125 7.75 L 14.125 8.25 Z M 14.245 8.248 L 14.275 8.748 C 14.901 8.709 15.452 8.238 15.497 7.584 L 14.998 7.549 L 14.5 7.514 C 14.493 7.611 14.398 7.738 14.214 7.749 L 14.245 8.248 Z M 14.998 7.549 L 15.498 7.58 C 15.5 7.536 15.5 7.488 15.5 7.438 L 15 7.438 L 14.5 7.438 C 14.5 7.468 14.5 7.486 14.5 7.501 C 14.5 7.514 14.499 7.518 14.499 7.518 L 14.998 7.549 Z M 15 7.438 L 15.5 7.438 L 15.5 4.562 L 15 4.562 L 14.5 4.562 L 14.5 7.438 L 15 7.438 Z M 15 4.562 L 15.5 4.562 C 15.5 4.512 15.5 4.464 15.498 4.42 L 14.998 4.451 L 14.499 4.482 C 14.499 4.482 14.5 4.486 14.5 4.499 C 14.5 4.514 14.5 4.532 14.5 4.562 L 15 4.562 Z M 14.998 4.451 L 15.497 4.415 C 15.45 3.762 14.902 3.291 14.275 3.252 L 14.245 3.751 L 14.214 4.251 C 14.398 4.262 14.493 4.389 14.5 4.487 L 14.998 4.451 Z M 14.245 3.751 L 14.274 3.252 C 14.23 3.25 14.18 3.25 14.125 3.25 L 14.125 3.75 L 14.125 4.25 C 14.195 4.25 14.208 4.25 14.215 4.251 L 14.245 3.751 Z M 14.224 3.75 L 14.723 3.729 C 14.665 2.319 14.478 1.278 13.724 0.525 L 13.371 0.879 L 13.018 1.233 C 13.477 1.692 13.666 2.373 13.724 3.771 L 14.224 3.75 Z M 13.371 0.879 L 13.725 0.526 C 13.177 -0.022 12.481 -0.268 11.608 -0.386 C 10.75 -0.501 9.65 -0.5 8.25 -0.5 L 8.25 0 L 8.25 0.5 C 9.678 0.5 10.699 0.501 11.475 0.605 C 12.237 0.708 12.687 0.901 13.017 1.232 L 13.371 0.879 Z M 8.25 0 L 8.25 -0.5 L 6 -0.5 L 6 0 L 6 0.5 L 8.25 0.5 L 8.25 0 Z M 6 0 L 6 -0.5 C 4.6 -0.5 3.5 -0.501 2.642 -0.386 C 1.769 -0.268 1.073 -0.022 0.525 0.526 L 0.879 0.879 L 1.233 1.232 C 1.563 0.901 2.013 0.708 2.775 0.605 C 3.551 0.501 4.572 0.5 6 0.5 L 6 0 Z M 0.879 0.879 L 0.525 0.526 C -0.022 1.073 -0.268 1.77 -0.385 2.642 C -0.501 3.5 -0.5 4.6 -0.5 6 L 0 6 L 0.5 6 C 0.5 4.572 0.501 3.551 0.606 2.775 C 0.708 2.014 0.902 1.564 1.233 1.232 L 0.879 0.879 Z M 0 6 L -0.5 6 C -0.5 7.4 -0.501 8.5 -0.386 9.358 C -0.268 10.231 -0.022 10.927 0.526 11.475 L 0.879 11.121 L 1.232 10.767 C 0.901 10.437 0.708 9.987 0.605 9.225 C 0.501 8.449 0.5 7.428 0.5 6 L 0 6 Z M 0.879 11.121 L 0.526 11.475 C 1.073 12.022 1.77 12.268 2.642 12.385 C 3.5 12.501 4.6 12.5 6 12.5 L 6 12 L 6 11.5 C 4.572 11.5 3.551 11.499 2.775 11.394 C 2.014 11.292 1.564 11.098 1.232 10.767 L 0.879 11.121 Z M 6 12 L 6 12.5 L 8.25 12.5 L 8.25 12 L 8.25 11.5 L 6 11.5 L 6 12 Z M 8.25 12 L 8.25 12.5 C 9.65 12.5 10.75 12.501 11.608 12.386 C 12.481 12.268 13.177 12.022 13.725 11.474 L 13.371 11.121 L 13.017 10.768 C 12.687 11.099 12.237 11.292 11.475 11.395 C 10.699 11.499 9.678 11.5 8.25 11.5 L 8.25 12 Z M 13.371 11.121 L 13.724 11.475 C 14.478 10.722 14.665 9.681 14.723 8.271 L 14.224 8.25 L 13.724 8.229 C 13.667 9.627 13.477 10.308 13.018 10.767 L 13.371 11.121 Z M 11.993 6 L 11.993 6.5 L 12.001 6.5 L 12.001 6 L 12.001 5.5 L 11.993 5.5 L 11.993 6 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 12,
    viewBox: "0 0 15 12",
    fill: "none",
    style: {
      position: "relative",
      width: 15,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 2.5 C 2.724 2.5 2.5 2.724 2.5 3 C 2.5 3.276 2.724 3.5 3 3.5 L 3 3 L 3 2.5 Z M 6 3.5 C 6.276 3.5 6.5 3.276 6.5 3 C 6.5 2.724 6.276 2.5 6 2.5 L 6 3 L 6 3.5 Z M 14.245 8.248 L 14.273 8.748 L 14.275 8.748 L 14.245 8.248 Z M 14.998 7.549 L 15.497 7.584 L 15.498 7.58 L 14.998 7.549 Z M 14.998 4.451 L 15.498 4.42 L 15.497 4.415 L 14.998 4.451 Z M 14.245 3.751 L 14.275 3.252 L 14.274 3.252 L 14.245 3.751 Z M 13.371 0.879 L 13.017 1.232 L 13.018 1.233 L 13.371 0.879 Z M 13.371 11.121 L 13.018 10.767 L 13.017 10.768 L 13.371 11.121 Z M 11.993 5.5 C 11.717 5.5 11.493 5.724 11.493 6 C 11.493 6.276 11.717 6.5 11.993 6.5 L 11.993 6 L 11.993 5.5 Z M 12.001 6.5 C 12.277 6.5 12.501 6.276 12.501 6 C 12.501 5.724 12.277 5.5 12.001 5.5 L 12.001 6 L 12.001 6.5 Z M 3 3 L 3 3.5 L 6 3.5 L 6 3 L 6 2.5 L 3 2.5 L 3 3 Z M 14.125 3.75 L 14.125 3.25 L 12.173 3.25 L 12.173 3.75 L 12.173 4.25 L 14.125 4.25 L 14.125 3.75 Z M 12.173 3.75 L 12.173 3.25 C 10.594 3.25 9.25 4.447 9.25 6 L 9.75 6 L 10.25 6 C 10.25 5.068 11.075 4.25 12.173 4.25 L 12.173 3.75 Z M 9.75 6 L 9.25 6 C 9.25 7.553 10.595 8.75 12.172 8.75 L 12.172 8.25 L 12.172 7.75 C 11.076 7.75 10.25 6.932 10.25 6 L 9.75 6 Z M 12.172 8.25 L 12.172 8.75 L 14.125 8.75 L 14.125 8.25 L 14.125 7.75 L 12.172 7.75 L 12.172 8.25 Z M 14.125 8.25 L 14.125 8.75 C 14.181 8.75 14.229 8.75 14.273 8.748 L 14.245 8.248 L 14.216 7.749 C 14.208 7.75 14.195 7.75 14.125 7.75 L 14.125 8.25 Z M 14.245 8.248 L 14.275 8.748 C 14.901 8.709 15.452 8.238 15.497 7.584 L 14.998 7.549 L 14.5 7.514 C 14.493 7.611 14.398 7.738 14.214 7.749 L 14.245 8.248 Z M 14.998 7.549 L 15.498 7.58 C 15.5 7.536 15.5 7.488 15.5 7.438 L 15 7.438 L 14.5 7.438 C 14.5 7.468 14.5 7.486 14.5 7.501 C 14.5 7.514 14.499 7.518 14.499 7.518 L 14.998 7.549 Z M 15 7.438 L 15.5 7.438 L 15.5 4.562 L 15 4.562 L 14.5 4.562 L 14.5 7.438 L 15 7.438 Z M 15 4.562 L 15.5 4.562 C 15.5 4.512 15.5 4.464 15.498 4.42 L 14.998 4.451 L 14.499 4.482 C 14.499 4.482 14.5 4.486 14.5 4.499 C 14.5 4.514 14.5 4.532 14.5 4.562 L 15 4.562 Z M 14.998 4.451 L 15.497 4.415 C 15.45 3.762 14.902 3.291 14.275 3.252 L 14.245 3.751 L 14.214 4.251 C 14.398 4.262 14.493 4.389 14.5 4.487 L 14.998 4.451 Z M 14.245 3.751 L 14.274 3.252 C 14.23 3.25 14.18 3.25 14.125 3.25 L 14.125 3.75 L 14.125 4.25 C 14.195 4.25 14.208 4.25 14.215 4.251 L 14.245 3.751 Z M 14.224 3.75 L 14.723 3.729 C 14.665 2.319 14.478 1.278 13.724 0.525 L 13.371 0.879 L 13.018 1.233 C 13.477 1.692 13.666 2.373 13.724 3.771 L 14.224 3.75 Z M 13.371 0.879 L 13.725 0.526 C 13.177 -0.022 12.481 -0.268 11.608 -0.386 C 10.75 -0.501 9.65 -0.5 8.25 -0.5 L 8.25 0 L 8.25 0.5 C 9.678 0.5 10.699 0.501 11.475 0.605 C 12.237 0.708 12.687 0.901 13.017 1.232 L 13.371 0.879 Z M 8.25 0 L 8.25 -0.5 L 6 -0.5 L 6 0 L 6 0.5 L 8.25 0.5 L 8.25 0 Z M 6 0 L 6 -0.5 C 4.6 -0.5 3.5 -0.501 2.642 -0.386 C 1.769 -0.268 1.073 -0.022 0.525 0.526 L 0.879 0.879 L 1.233 1.232 C 1.563 0.901 2.013 0.708 2.775 0.605 C 3.551 0.501 4.572 0.5 6 0.5 L 6 0 Z M 0.879 0.879 L 0.525 0.526 C -0.022 1.073 -0.268 1.77 -0.385 2.642 C -0.501 3.5 -0.5 4.6 -0.5 6 L 0 6 L 0.5 6 C 0.5 4.572 0.501 3.551 0.606 2.775 C 0.708 2.014 0.902 1.564 1.233 1.232 L 0.879 0.879 Z M 0 6 L -0.5 6 C -0.5 7.4 -0.501 8.5 -0.386 9.358 C -0.268 10.231 -0.022 10.927 0.526 11.475 L 0.879 11.121 L 1.232 10.767 C 0.901 10.437 0.708 9.987 0.605 9.225 C 0.501 8.449 0.5 7.428 0.5 6 L 0 6 Z M 0.879 11.121 L 0.526 11.475 C 1.073 12.022 1.77 12.268 2.642 12.385 C 3.5 12.501 4.6 12.5 6 12.5 L 6 12 L 6 11.5 C 4.572 11.5 3.551 11.499 2.775 11.394 C 2.014 11.292 1.564 11.098 1.232 10.767 L 0.879 11.121 Z M 6 12 L 6 12.5 L 8.25 12.5 L 8.25 12 L 8.25 11.5 L 6 11.5 L 6 12 Z M 8.25 12 L 8.25 12.5 C 9.65 12.5 10.75 12.501 11.608 12.386 C 12.481 12.268 13.177 12.022 13.725 11.474 L 13.371 11.121 L 13.017 10.768 C 12.687 11.099 12.237 11.292 11.475 11.395 C 10.699 11.499 9.678 11.5 8.25 11.5 L 8.25 12 Z M 13.371 11.121 L 13.724 11.475 C 14.478 10.722 14.665 9.681 14.723 8.271 L 14.224 8.25 L 13.724 8.229 C 13.667 9.627 13.477 10.308 13.018 10.767 L 13.371 11.121 Z M 11.993 6 L 11.993 6.5 L 12.001 6.5 L 12.001 6 L 12.001 5.5 L 11.993 5.5 L 11.993 6 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "var(--color-primary-hover)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "var(--color-primary-hover)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "rgb(159,160,164)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 12,
    viewBox: "0 0 15 12",
    fill: "none",
    style: {
      position: "relative",
      width: 15,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 2.5 C 2.724 2.5 2.5 2.724 2.5 3 C 2.5 3.276 2.724 3.5 3 3.5 L 3 3 L 3 2.5 Z M 6 3.5 C 6.276 3.5 6.5 3.276 6.5 3 C 6.5 2.724 6.276 2.5 6 2.5 L 6 3 L 6 3.5 Z M 14.245 8.248 L 14.273 8.748 L 14.275 8.748 L 14.245 8.248 Z M 14.998 7.549 L 15.497 7.584 L 15.498 7.58 L 14.998 7.549 Z M 14.998 4.451 L 15.498 4.42 L 15.497 4.415 L 14.998 4.451 Z M 14.245 3.751 L 14.275 3.252 L 14.274 3.252 L 14.245 3.751 Z M 13.371 0.879 L 13.017 1.232 L 13.018 1.233 L 13.371 0.879 Z M 13.371 11.121 L 13.018 10.767 L 13.017 10.768 L 13.371 11.121 Z M 11.993 5.5 C 11.717 5.5 11.493 5.724 11.493 6 C 11.493 6.276 11.717 6.5 11.993 6.5 L 11.993 6 L 11.993 5.5 Z M 12.001 6.5 C 12.277 6.5 12.501 6.276 12.501 6 C 12.501 5.724 12.277 5.5 12.001 5.5 L 12.001 6 L 12.001 6.5 Z M 3 3 L 3 3.5 L 6 3.5 L 6 3 L 6 2.5 L 3 2.5 L 3 3 Z M 14.125 3.75 L 14.125 3.25 L 12.173 3.25 L 12.173 3.75 L 12.173 4.25 L 14.125 4.25 L 14.125 3.75 Z M 12.173 3.75 L 12.173 3.25 C 10.594 3.25 9.25 4.447 9.25 6 L 9.75 6 L 10.25 6 C 10.25 5.068 11.075 4.25 12.173 4.25 L 12.173 3.75 Z M 9.75 6 L 9.25 6 C 9.25 7.553 10.595 8.75 12.172 8.75 L 12.172 8.25 L 12.172 7.75 C 11.076 7.75 10.25 6.932 10.25 6 L 9.75 6 Z M 12.172 8.25 L 12.172 8.75 L 14.125 8.75 L 14.125 8.25 L 14.125 7.75 L 12.172 7.75 L 12.172 8.25 Z M 14.125 8.25 L 14.125 8.75 C 14.181 8.75 14.229 8.75 14.273 8.748 L 14.245 8.248 L 14.216 7.749 C 14.208 7.75 14.195 7.75 14.125 7.75 L 14.125 8.25 Z M 14.245 8.248 L 14.275 8.748 C 14.901 8.709 15.452 8.238 15.497 7.584 L 14.998 7.549 L 14.5 7.514 C 14.493 7.611 14.398 7.738 14.214 7.749 L 14.245 8.248 Z M 14.998 7.549 L 15.498 7.58 C 15.5 7.536 15.5 7.488 15.5 7.438 L 15 7.438 L 14.5 7.438 C 14.5 7.468 14.5 7.486 14.5 7.501 C 14.5 7.514 14.499 7.518 14.499 7.518 L 14.998 7.549 Z M 15 7.438 L 15.5 7.438 L 15.5 4.562 L 15 4.562 L 14.5 4.562 L 14.5 7.438 L 15 7.438 Z M 15 4.562 L 15.5 4.562 C 15.5 4.512 15.5 4.464 15.498 4.42 L 14.998 4.451 L 14.499 4.482 C 14.499 4.482 14.5 4.486 14.5 4.499 C 14.5 4.514 14.5 4.532 14.5 4.562 L 15 4.562 Z M 14.998 4.451 L 15.497 4.415 C 15.45 3.762 14.902 3.291 14.275 3.252 L 14.245 3.751 L 14.214 4.251 C 14.398 4.262 14.493 4.389 14.5 4.487 L 14.998 4.451 Z M 14.245 3.751 L 14.274 3.252 C 14.23 3.25 14.18 3.25 14.125 3.25 L 14.125 3.75 L 14.125 4.25 C 14.195 4.25 14.208 4.25 14.215 4.251 L 14.245 3.751 Z M 14.224 3.75 L 14.723 3.729 C 14.665 2.319 14.478 1.278 13.724 0.525 L 13.371 0.879 L 13.018 1.233 C 13.477 1.692 13.666 2.373 13.724 3.771 L 14.224 3.75 Z M 13.371 0.879 L 13.725 0.526 C 13.177 -0.022 12.481 -0.268 11.608 -0.386 C 10.75 -0.501 9.65 -0.5 8.25 -0.5 L 8.25 0 L 8.25 0.5 C 9.678 0.5 10.699 0.501 11.475 0.605 C 12.237 0.708 12.687 0.901 13.017 1.232 L 13.371 0.879 Z M 8.25 0 L 8.25 -0.5 L 6 -0.5 L 6 0 L 6 0.5 L 8.25 0.5 L 8.25 0 Z M 6 0 L 6 -0.5 C 4.6 -0.5 3.5 -0.501 2.642 -0.386 C 1.769 -0.268 1.073 -0.022 0.525 0.526 L 0.879 0.879 L 1.233 1.232 C 1.563 0.901 2.013 0.708 2.775 0.605 C 3.551 0.501 4.572 0.5 6 0.5 L 6 0 Z M 0.879 0.879 L 0.525 0.526 C -0.022 1.073 -0.268 1.77 -0.385 2.642 C -0.501 3.5 -0.5 4.6 -0.5 6 L 0 6 L 0.5 6 C 0.5 4.572 0.501 3.551 0.606 2.775 C 0.708 2.014 0.902 1.564 1.233 1.232 L 0.879 0.879 Z M 0 6 L -0.5 6 C -0.5 7.4 -0.501 8.5 -0.386 9.358 C -0.268 10.231 -0.022 10.927 0.526 11.475 L 0.879 11.121 L 1.232 10.767 C 0.901 10.437 0.708 9.987 0.605 9.225 C 0.501 8.449 0.5 7.428 0.5 6 L 0 6 Z M 0.879 11.121 L 0.526 11.475 C 1.073 12.022 1.77 12.268 2.642 12.385 C 3.5 12.501 4.6 12.5 6 12.5 L 6 12 L 6 11.5 C 4.572 11.5 3.551 11.499 2.775 11.394 C 2.014 11.292 1.564 11.098 1.232 10.767 L 0.879 11.121 Z M 6 12 L 6 12.5 L 8.25 12.5 L 8.25 12 L 8.25 11.5 L 6 11.5 L 6 12 Z M 8.25 12 L 8.25 12.5 C 9.65 12.5 10.75 12.501 11.608 12.386 C 12.481 12.268 13.177 12.022 13.725 11.474 L 13.371 11.121 L 13.017 10.768 C 12.687 11.099 12.237 11.292 11.475 11.395 C 10.699 11.499 9.678 11.5 8.25 11.5 L 8.25 12 Z M 13.371 11.121 L 13.724 11.475 C 14.478 10.722 14.665 9.681 14.723 8.271 L 14.224 8.25 L 13.724 8.229 C 13.667 9.627 13.477 10.308 13.018 10.767 L 13.371 11.121 Z M 11.993 6 L 11.993 6.5 L 12.001 6.5 L 12.001 6 L 12.001 5.5 L 11.993 5.5 L 11.993 6 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "var(--color-primary-hover)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 12,
    viewBox: "0 0 15 12",
    fill: "none",
    style: {
      position: "relative",
      width: 15,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 2.5 C 2.724 2.5 2.5 2.724 2.5 3 C 2.5 3.276 2.724 3.5 3 3.5 L 3 3 L 3 2.5 Z M 6 3.5 C 6.276 3.5 6.5 3.276 6.5 3 C 6.5 2.724 6.276 2.5 6 2.5 L 6 3 L 6 3.5 Z M 14.245 8.248 L 14.273 8.748 L 14.275 8.748 L 14.245 8.248 Z M 14.998 7.549 L 15.497 7.584 L 15.498 7.58 L 14.998 7.549 Z M 14.998 4.451 L 15.498 4.42 L 15.497 4.415 L 14.998 4.451 Z M 14.245 3.751 L 14.275 3.252 L 14.274 3.252 L 14.245 3.751 Z M 13.371 0.879 L 13.017 1.232 L 13.018 1.233 L 13.371 0.879 Z M 13.371 11.121 L 13.018 10.767 L 13.017 10.768 L 13.371 11.121 Z M 11.993 5.5 C 11.717 5.5 11.493 5.724 11.493 6 C 11.493 6.276 11.717 6.5 11.993 6.5 L 11.993 6 L 11.993 5.5 Z M 12.001 6.5 C 12.277 6.5 12.501 6.276 12.501 6 C 12.501 5.724 12.277 5.5 12.001 5.5 L 12.001 6 L 12.001 6.5 Z M 3 3 L 3 3.5 L 6 3.5 L 6 3 L 6 2.5 L 3 2.5 L 3 3 Z M 14.125 3.75 L 14.125 3.25 L 12.173 3.25 L 12.173 3.75 L 12.173 4.25 L 14.125 4.25 L 14.125 3.75 Z M 12.173 3.75 L 12.173 3.25 C 10.594 3.25 9.25 4.447 9.25 6 L 9.75 6 L 10.25 6 C 10.25 5.068 11.075 4.25 12.173 4.25 L 12.173 3.75 Z M 9.75 6 L 9.25 6 C 9.25 7.553 10.595 8.75 12.172 8.75 L 12.172 8.25 L 12.172 7.75 C 11.076 7.75 10.25 6.932 10.25 6 L 9.75 6 Z M 12.172 8.25 L 12.172 8.75 L 14.125 8.75 L 14.125 8.25 L 14.125 7.75 L 12.172 7.75 L 12.172 8.25 Z M 14.125 8.25 L 14.125 8.75 C 14.181 8.75 14.229 8.75 14.273 8.748 L 14.245 8.248 L 14.216 7.749 C 14.208 7.75 14.195 7.75 14.125 7.75 L 14.125 8.25 Z M 14.245 8.248 L 14.275 8.748 C 14.901 8.709 15.452 8.238 15.497 7.584 L 14.998 7.549 L 14.5 7.514 C 14.493 7.611 14.398 7.738 14.214 7.749 L 14.245 8.248 Z M 14.998 7.549 L 15.498 7.58 C 15.5 7.536 15.5 7.488 15.5 7.438 L 15 7.438 L 14.5 7.438 C 14.5 7.468 14.5 7.486 14.5 7.501 C 14.5 7.514 14.499 7.518 14.499 7.518 L 14.998 7.549 Z M 15 7.438 L 15.5 7.438 L 15.5 4.562 L 15 4.562 L 14.5 4.562 L 14.5 7.438 L 15 7.438 Z M 15 4.562 L 15.5 4.562 C 15.5 4.512 15.5 4.464 15.498 4.42 L 14.998 4.451 L 14.499 4.482 C 14.499 4.482 14.5 4.486 14.5 4.499 C 14.5 4.514 14.5 4.532 14.5 4.562 L 15 4.562 Z M 14.998 4.451 L 15.497 4.415 C 15.45 3.762 14.902 3.291 14.275 3.252 L 14.245 3.751 L 14.214 4.251 C 14.398 4.262 14.493 4.389 14.5 4.487 L 14.998 4.451 Z M 14.245 3.751 L 14.274 3.252 C 14.23 3.25 14.18 3.25 14.125 3.25 L 14.125 3.75 L 14.125 4.25 C 14.195 4.25 14.208 4.25 14.215 4.251 L 14.245 3.751 Z M 14.224 3.75 L 14.723 3.729 C 14.665 2.319 14.478 1.278 13.724 0.525 L 13.371 0.879 L 13.018 1.233 C 13.477 1.692 13.666 2.373 13.724 3.771 L 14.224 3.75 Z M 13.371 0.879 L 13.725 0.526 C 13.177 -0.022 12.481 -0.268 11.608 -0.386 C 10.75 -0.501 9.65 -0.5 8.25 -0.5 L 8.25 0 L 8.25 0.5 C 9.678 0.5 10.699 0.501 11.475 0.605 C 12.237 0.708 12.687 0.901 13.017 1.232 L 13.371 0.879 Z M 8.25 0 L 8.25 -0.5 L 6 -0.5 L 6 0 L 6 0.5 L 8.25 0.5 L 8.25 0 Z M 6 0 L 6 -0.5 C 4.6 -0.5 3.5 -0.501 2.642 -0.386 C 1.769 -0.268 1.073 -0.022 0.525 0.526 L 0.879 0.879 L 1.233 1.232 C 1.563 0.901 2.013 0.708 2.775 0.605 C 3.551 0.501 4.572 0.5 6 0.5 L 6 0 Z M 0.879 0.879 L 0.525 0.526 C -0.022 1.073 -0.268 1.77 -0.385 2.642 C -0.501 3.5 -0.5 4.6 -0.5 6 L 0 6 L 0.5 6 C 0.5 4.572 0.501 3.551 0.606 2.775 C 0.708 2.014 0.902 1.564 1.233 1.232 L 0.879 0.879 Z M 0 6 L -0.5 6 C -0.5 7.4 -0.501 8.5 -0.386 9.358 C -0.268 10.231 -0.022 10.927 0.526 11.475 L 0.879 11.121 L 1.232 10.767 C 0.901 10.437 0.708 9.987 0.605 9.225 C 0.501 8.449 0.5 7.428 0.5 6 L 0 6 Z M 0.879 11.121 L 0.526 11.475 C 1.073 12.022 1.77 12.268 2.642 12.385 C 3.5 12.501 4.6 12.5 6 12.5 L 6 12 L 6 11.5 C 4.572 11.5 3.551 11.499 2.775 11.394 C 2.014 11.292 1.564 11.098 1.232 10.767 L 0.879 11.121 Z M 6 12 L 6 12.5 L 8.25 12.5 L 8.25 12 L 8.25 11.5 L 6 11.5 L 6 12 Z M 8.25 12 L 8.25 12.5 C 9.65 12.5 10.75 12.501 11.608 12.386 C 12.481 12.268 13.177 12.022 13.725 11.474 L 13.371 11.121 L 13.017 10.768 C 12.687 11.099 12.237 11.292 11.475 11.395 C 10.699 11.499 9.678 11.5 8.25 11.5 L 8.25 12 Z M 13.371 11.121 L 13.724 11.475 C 14.478 10.722 14.665 9.681 14.723 8.271 L 14.224 8.25 L 13.724 8.229 C 13.667 9.627 13.477 10.308 13.018 10.767 L 13.371 11.121 Z M 11.993 6 L 11.993 6.5 L 12.001 6.5 L 12.001 6 L 12.001 5.5 L 11.993 5.5 L 11.993 6 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "rgb(0,108,203)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "rgb(159,160,164)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 12,
    viewBox: "0 0 15 12",
    fill: "none",
    style: {
      position: "relative",
      width: 15,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 2.5 C 2.724 2.5 2.5 2.724 2.5 3 C 2.5 3.276 2.724 3.5 3 3.5 L 3 3 L 3 2.5 Z M 6 3.5 C 6.276 3.5 6.5 3.276 6.5 3 C 6.5 2.724 6.276 2.5 6 2.5 L 6 3 L 6 3.5 Z M 14.245 8.248 L 14.273 8.748 L 14.275 8.748 L 14.245 8.248 Z M 14.998 7.549 L 15.497 7.584 L 15.498 7.58 L 14.998 7.549 Z M 14.998 4.451 L 15.498 4.42 L 15.497 4.415 L 14.998 4.451 Z M 14.245 3.751 L 14.275 3.252 L 14.274 3.252 L 14.245 3.751 Z M 13.371 0.879 L 13.017 1.232 L 13.018 1.233 L 13.371 0.879 Z M 13.371 11.121 L 13.018 10.767 L 13.017 10.768 L 13.371 11.121 Z M 11.993 5.5 C 11.717 5.5 11.493 5.724 11.493 6 C 11.493 6.276 11.717 6.5 11.993 6.5 L 11.993 6 L 11.993 5.5 Z M 12.001 6.5 C 12.277 6.5 12.501 6.276 12.501 6 C 12.501 5.724 12.277 5.5 12.001 5.5 L 12.001 6 L 12.001 6.5 Z M 3 3 L 3 3.5 L 6 3.5 L 6 3 L 6 2.5 L 3 2.5 L 3 3 Z M 14.125 3.75 L 14.125 3.25 L 12.173 3.25 L 12.173 3.75 L 12.173 4.25 L 14.125 4.25 L 14.125 3.75 Z M 12.173 3.75 L 12.173 3.25 C 10.594 3.25 9.25 4.447 9.25 6 L 9.75 6 L 10.25 6 C 10.25 5.068 11.075 4.25 12.173 4.25 L 12.173 3.75 Z M 9.75 6 L 9.25 6 C 9.25 7.553 10.595 8.75 12.172 8.75 L 12.172 8.25 L 12.172 7.75 C 11.076 7.75 10.25 6.932 10.25 6 L 9.75 6 Z M 12.172 8.25 L 12.172 8.75 L 14.125 8.75 L 14.125 8.25 L 14.125 7.75 L 12.172 7.75 L 12.172 8.25 Z M 14.125 8.25 L 14.125 8.75 C 14.181 8.75 14.229 8.75 14.273 8.748 L 14.245 8.248 L 14.216 7.749 C 14.208 7.75 14.195 7.75 14.125 7.75 L 14.125 8.25 Z M 14.245 8.248 L 14.275 8.748 C 14.901 8.709 15.452 8.238 15.497 7.584 L 14.998 7.549 L 14.5 7.514 C 14.493 7.611 14.398 7.738 14.214 7.749 L 14.245 8.248 Z M 14.998 7.549 L 15.498 7.58 C 15.5 7.536 15.5 7.488 15.5 7.438 L 15 7.438 L 14.5 7.438 C 14.5 7.468 14.5 7.486 14.5 7.501 C 14.5 7.514 14.499 7.518 14.499 7.518 L 14.998 7.549 Z M 15 7.438 L 15.5 7.438 L 15.5 4.562 L 15 4.562 L 14.5 4.562 L 14.5 7.438 L 15 7.438 Z M 15 4.562 L 15.5 4.562 C 15.5 4.512 15.5 4.464 15.498 4.42 L 14.998 4.451 L 14.499 4.482 C 14.499 4.482 14.5 4.486 14.5 4.499 C 14.5 4.514 14.5 4.532 14.5 4.562 L 15 4.562 Z M 14.998 4.451 L 15.497 4.415 C 15.45 3.762 14.902 3.291 14.275 3.252 L 14.245 3.751 L 14.214 4.251 C 14.398 4.262 14.493 4.389 14.5 4.487 L 14.998 4.451 Z M 14.245 3.751 L 14.274 3.252 C 14.23 3.25 14.18 3.25 14.125 3.25 L 14.125 3.75 L 14.125 4.25 C 14.195 4.25 14.208 4.25 14.215 4.251 L 14.245 3.751 Z M 14.224 3.75 L 14.723 3.729 C 14.665 2.319 14.478 1.278 13.724 0.525 L 13.371 0.879 L 13.018 1.233 C 13.477 1.692 13.666 2.373 13.724 3.771 L 14.224 3.75 Z M 13.371 0.879 L 13.725 0.526 C 13.177 -0.022 12.481 -0.268 11.608 -0.386 C 10.75 -0.501 9.65 -0.5 8.25 -0.5 L 8.25 0 L 8.25 0.5 C 9.678 0.5 10.699 0.501 11.475 0.605 C 12.237 0.708 12.687 0.901 13.017 1.232 L 13.371 0.879 Z M 8.25 0 L 8.25 -0.5 L 6 -0.5 L 6 0 L 6 0.5 L 8.25 0.5 L 8.25 0 Z M 6 0 L 6 -0.5 C 4.6 -0.5 3.5 -0.501 2.642 -0.386 C 1.769 -0.268 1.073 -0.022 0.525 0.526 L 0.879 0.879 L 1.233 1.232 C 1.563 0.901 2.013 0.708 2.775 0.605 C 3.551 0.501 4.572 0.5 6 0.5 L 6 0 Z M 0.879 0.879 L 0.525 0.526 C -0.022 1.073 -0.268 1.77 -0.385 2.642 C -0.501 3.5 -0.5 4.6 -0.5 6 L 0 6 L 0.5 6 C 0.5 4.572 0.501 3.551 0.606 2.775 C 0.708 2.014 0.902 1.564 1.233 1.232 L 0.879 0.879 Z M 0 6 L -0.5 6 C -0.5 7.4 -0.501 8.5 -0.386 9.358 C -0.268 10.231 -0.022 10.927 0.526 11.475 L 0.879 11.121 L 1.232 10.767 C 0.901 10.437 0.708 9.987 0.605 9.225 C 0.501 8.449 0.5 7.428 0.5 6 L 0 6 Z M 0.879 11.121 L 0.526 11.475 C 1.073 12.022 1.77 12.268 2.642 12.385 C 3.5 12.501 4.6 12.5 6 12.5 L 6 12 L 6 11.5 C 4.572 11.5 3.551 11.499 2.775 11.394 C 2.014 11.292 1.564 11.098 1.232 10.767 L 0.879 11.121 Z M 6 12 L 6 12.5 L 8.25 12.5 L 8.25 12 L 8.25 11.5 L 6 11.5 L 6 12 Z M 8.25 12 L 8.25 12.5 C 9.65 12.5 10.75 12.501 11.608 12.386 C 12.481 12.268 13.177 12.022 13.725 11.474 L 13.371 11.121 L 13.017 10.768 C 12.687 11.099 12.237 11.292 11.475 11.395 C 10.699 11.499 9.678 11.5 8.25 11.5 L 8.25 12 Z M 13.371 11.121 L 13.724 11.475 C 14.478 10.722 14.665 9.681 14.723 8.271 L 14.224 8.25 L 13.724 8.229 C 13.667 9.627 13.477 10.308 13.018 10.767 L 13.371 11.121 Z M 11.993 6 L 11.993 6.5 L 12.001 6.5 L 12.001 6 L 12.001 5.5 L 11.993 5.5 L 11.993 6 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      height: 42,
      borderRadius: 10,
      backgroundColor: "rgb(0,108,203)",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15,
    height: 12,
    viewBox: "0 0 15 12",
    fill: "none",
    style: {
      position: "relative",
      width: 15,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 2.5 C 2.724 2.5 2.5 2.724 2.5 3 C 2.5 3.276 2.724 3.5 3 3.5 L 3 3 L 3 2.5 Z M 6 3.5 C 6.276 3.5 6.5 3.276 6.5 3 C 6.5 2.724 6.276 2.5 6 2.5 L 6 3 L 6 3.5 Z M 14.245 8.248 L 14.273 8.748 L 14.275 8.748 L 14.245 8.248 Z M 14.998 7.549 L 15.497 7.584 L 15.498 7.58 L 14.998 7.549 Z M 14.998 4.451 L 15.498 4.42 L 15.497 4.415 L 14.998 4.451 Z M 14.245 3.751 L 14.275 3.252 L 14.274 3.252 L 14.245 3.751 Z M 13.371 0.879 L 13.017 1.232 L 13.018 1.233 L 13.371 0.879 Z M 13.371 11.121 L 13.018 10.767 L 13.017 10.768 L 13.371 11.121 Z M 11.993 5.5 C 11.717 5.5 11.493 5.724 11.493 6 C 11.493 6.276 11.717 6.5 11.993 6.5 L 11.993 6 L 11.993 5.5 Z M 12.001 6.5 C 12.277 6.5 12.501 6.276 12.501 6 C 12.501 5.724 12.277 5.5 12.001 5.5 L 12.001 6 L 12.001 6.5 Z M 3 3 L 3 3.5 L 6 3.5 L 6 3 L 6 2.5 L 3 2.5 L 3 3 Z M 14.125 3.75 L 14.125 3.25 L 12.173 3.25 L 12.173 3.75 L 12.173 4.25 L 14.125 4.25 L 14.125 3.75 Z M 12.173 3.75 L 12.173 3.25 C 10.594 3.25 9.25 4.447 9.25 6 L 9.75 6 L 10.25 6 C 10.25 5.068 11.075 4.25 12.173 4.25 L 12.173 3.75 Z M 9.75 6 L 9.25 6 C 9.25 7.553 10.595 8.75 12.172 8.75 L 12.172 8.25 L 12.172 7.75 C 11.076 7.75 10.25 6.932 10.25 6 L 9.75 6 Z M 12.172 8.25 L 12.172 8.75 L 14.125 8.75 L 14.125 8.25 L 14.125 7.75 L 12.172 7.75 L 12.172 8.25 Z M 14.125 8.25 L 14.125 8.75 C 14.181 8.75 14.229 8.75 14.273 8.748 L 14.245 8.248 L 14.216 7.749 C 14.208 7.75 14.195 7.75 14.125 7.75 L 14.125 8.25 Z M 14.245 8.248 L 14.275 8.748 C 14.901 8.709 15.452 8.238 15.497 7.584 L 14.998 7.549 L 14.5 7.514 C 14.493 7.611 14.398 7.738 14.214 7.749 L 14.245 8.248 Z M 14.998 7.549 L 15.498 7.58 C 15.5 7.536 15.5 7.488 15.5 7.438 L 15 7.438 L 14.5 7.438 C 14.5 7.468 14.5 7.486 14.5 7.501 C 14.5 7.514 14.499 7.518 14.499 7.518 L 14.998 7.549 Z M 15 7.438 L 15.5 7.438 L 15.5 4.562 L 15 4.562 L 14.5 4.562 L 14.5 7.438 L 15 7.438 Z M 15 4.562 L 15.5 4.562 C 15.5 4.512 15.5 4.464 15.498 4.42 L 14.998 4.451 L 14.499 4.482 C 14.499 4.482 14.5 4.486 14.5 4.499 C 14.5 4.514 14.5 4.532 14.5 4.562 L 15 4.562 Z M 14.998 4.451 L 15.497 4.415 C 15.45 3.762 14.902 3.291 14.275 3.252 L 14.245 3.751 L 14.214 4.251 C 14.398 4.262 14.493 4.389 14.5 4.487 L 14.998 4.451 Z M 14.245 3.751 L 14.274 3.252 C 14.23 3.25 14.18 3.25 14.125 3.25 L 14.125 3.75 L 14.125 4.25 C 14.195 4.25 14.208 4.25 14.215 4.251 L 14.245 3.751 Z M 14.224 3.75 L 14.723 3.729 C 14.665 2.319 14.478 1.278 13.724 0.525 L 13.371 0.879 L 13.018 1.233 C 13.477 1.692 13.666 2.373 13.724 3.771 L 14.224 3.75 Z M 13.371 0.879 L 13.725 0.526 C 13.177 -0.022 12.481 -0.268 11.608 -0.386 C 10.75 -0.501 9.65 -0.5 8.25 -0.5 L 8.25 0 L 8.25 0.5 C 9.678 0.5 10.699 0.501 11.475 0.605 C 12.237 0.708 12.687 0.901 13.017 1.232 L 13.371 0.879 Z M 8.25 0 L 8.25 -0.5 L 6 -0.5 L 6 0 L 6 0.5 L 8.25 0.5 L 8.25 0 Z M 6 0 L 6 -0.5 C 4.6 -0.5 3.5 -0.501 2.642 -0.386 C 1.769 -0.268 1.073 -0.022 0.525 0.526 L 0.879 0.879 L 1.233 1.232 C 1.563 0.901 2.013 0.708 2.775 0.605 C 3.551 0.501 4.572 0.5 6 0.5 L 6 0 Z M 0.879 0.879 L 0.525 0.526 C -0.022 1.073 -0.268 1.77 -0.385 2.642 C -0.501 3.5 -0.5 4.6 -0.5 6 L 0 6 L 0.5 6 C 0.5 4.572 0.501 3.551 0.606 2.775 C 0.708 2.014 0.902 1.564 1.233 1.232 L 0.879 0.879 Z M 0 6 L -0.5 6 C -0.5 7.4 -0.501 8.5 -0.386 9.358 C -0.268 10.231 -0.022 10.927 0.526 11.475 L 0.879 11.121 L 1.232 10.767 C 0.901 10.437 0.708 9.987 0.605 9.225 C 0.501 8.449 0.5 7.428 0.5 6 L 0 6 Z M 0.879 11.121 L 0.526 11.475 C 1.073 12.022 1.77 12.268 2.642 12.385 C 3.5 12.501 4.6 12.5 6 12.5 L 6 12 L 6 11.5 C 4.572 11.5 3.551 11.499 2.775 11.394 C 2.014 11.292 1.564 11.098 1.232 10.767 L 0.879 11.121 Z M 6 12 L 6 12.5 L 8.25 12.5 L 8.25 12 L 8.25 11.5 L 6 11.5 L 6 12 Z M 8.25 12 L 8.25 12.5 C 9.65 12.5 10.75 12.501 11.608 12.386 C 12.481 12.268 13.177 12.022 13.725 11.474 L 13.371 11.121 L 13.017 10.768 C 12.687 11.099 12.237 11.292 11.475 11.395 C 10.699 11.499 9.678 11.5 8.25 11.5 L 8.25 12 Z M 13.371 11.121 L 13.724 11.475 C 14.478 10.722 14.665 9.681 14.723 8.271 L 14.224 8.25 L 13.724 8.229 C 13.667 9.627 13.477 10.308 13.018 10.767 L 13.371 11.121 Z M 11.993 6 L 11.993 6.5 L 12.001 6.5 L 12.001 6 L 12.001 5.5 L 11.993 5.5 L 11.993 6 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ОТПРАВИТЬ ОТКЛИК"));
  const __impls = {
    // figma: state=Default, type=Default
    "state=default|type=default": __body0,
    // figma: state=Default, type=icon
    "state=default|type=icon": __body1,
    // figma: state=Default, type=icon end
    "state=default|type=icon end": __body2,
    // figma: state=hover, type=Default
    "state=hover|type=default": __body3,
    // figma: state=hover, type=icon
    "state=hover|type=icon": __body4,
    // figma: state=hover, type=icon end
    "state=hover|type=icon end": __body5,
    // figma: state=active, type=Default
    "state=active|type=default": __body0,
    // figma: state=active, type=icon
    "state=active|type=icon": __body6,
    // figma: state=active, type=icon end
    "state=active|type=icon end": __body7
  };
  return (__impls[__vkey_ButtonDefault(props)] ?? __body0)();
}

// figma node: 2778:2629 icon / bootstrap / outline & logos / journals
function IconBootstrapOutlineLogosJournals(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 3828:11151 button_icon (6 variants)
const __venc_ButtonIcon = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_ButtonIcon = p => "state=" + __venc_ButtonIcon(p.state) + '|' + "bG=" + __venc_ButtonIcon(p.bG);
function ButtonIcon(_p = {}) {
  const props = {
    ..._p,
    state: _p.state ?? "default",
    bG: _p.bG ?? false,
    counter: _p.counter ?? false
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5")));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5")));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--brand-active)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5")));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5")));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 40,
      height: 40,
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "var(--surface-tetriary)",
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5")));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 40,
      height: 40,
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "var(--surface-tetriary)",
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--brand-active)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5")));
  const __impls = {
    // figma: State=Default, BG=no
    "state=default|bG=false": __body0,
    // figma: State=Hover, BG=no
    "state=hover|bG=false": __body1,
    // figma: State=Active, BG=no
    "state=active|bG=false": __body2,
    // figma: State=Default, BG=yes
    "state=default|bG=true": __body3,
    // figma: State=Hover, BG=yes
    "state=hover|bG=true": __body4,
    // figma: State=Active, BG=yes
    "state=active|bG=true": __body5
  };
  return (__impls[__vkey_ButtonIcon(props)] ?? __body0)();
}

// figma node: 2868:3724 Category (5 variants)
const __venc_Category = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Category = p => "color=" + __venc_Category(p.color) + '|' + "size=" + __venc_Category(p.size);
function Category(_p = {}) {
  const props = {
    ..._p,
    color: _p.color ?? "blue",
    size: _p.size ?? "s"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(76,172,255)",
      borderRight: "2px solid rgb(76,172,255)",
      borderBottom: "2px solid rgb(76,172,255)",
      borderLeft: "2px solid rgb(76,172,255)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(76,172,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Маркетинг"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(244,95,177)",
      borderRight: "2px solid rgb(244,95,177)",
      borderBottom: "2px solid rgb(244,95,177)",
      borderLeft: "2px solid rgb(244,95,177)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(244,95,177)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Дизайн"));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(12,198,113)",
      borderRight: "2px solid rgb(12,198,113)",
      borderBottom: "2px solid rgb(12,198,113)",
      borderLeft: "2px solid rgb(12,198,113)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(12,198,113)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Программирование"));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(5,201,230)",
      borderRight: "2px solid rgb(5,201,230)",
      borderBottom: "2px solid rgb(5,201,230)",
      borderLeft: "2px solid rgb(5,201,230)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(5,201,230)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Разработка"));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      borderTop: "2px solid rgb(242,124,13)",
      borderRight: "2px solid rgb(242,124,13)",
      borderBottom: "2px solid rgb(242,124,13)",
      borderLeft: "2px solid rgb(242,124,13)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(242,124,13)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Кодинг"));
  const __impls = {
    // figma: Color=Blue, Size=S
    "color=blue|size=s": __body0,
    // figma: Color=rose, Size=S
    "color=rose|size=s": __body1,
    // figma: Color=green, Size=S
    "color=green|size=s": __body2,
    // figma: Color=teal, Size=S
    "color=teal|size=s": __body3,
    // figma: Color=orange, Size=S
    "color=orange|size=s": __body4
  };
  return (__impls[__vkey_Category(props)] ?? __body0)();
}

// figma node: 2346:6 Component 4 (25 variants)
const __venc_Component4 = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Component4 = p => "variant=" + __venc_Component4(p.variant) + '|' + "hover=" + __venc_Component4(p.hover);
function Component4(_p = {}) {
  const props = {
    ..._p,
    text: _p.text ?? "Websoft HCM",
    variant: _p.variant ?? "1",
    hover: _p.hover ?? true
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 208,
      display: "flex",
      flexDirection: "column",
      padding: "6px 0px 7.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 24,
      lineHeight: "22px",
      letterSpacing: "-1px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.text));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 208,
      display: "flex",
      flexDirection: "column",
      padding: "6px 0px 7.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 24,
      lineHeight: "22px",
      letterSpacing: "-1px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 54.39,
      overflow: "hidden",
      borderRadius: 30,
      backgroundColor: "rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      padding: "9.830px 0px 9.840px 0px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 54.39,
      height: 54.39,
      backgroundColor: "rgb(255,255,255)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "5.500px 0px 7.220px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "21.700px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text)));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 54.39,
      overflow: "hidden",
      borderRadius: 30,
      backgroundColor: "rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      padding: "9.830px 0px 9.840px 0px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 54.39,
      height: 54.39,
      opacity: 0,
      backgroundColor: "rgb(255,255,255)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "5.500px 0px 7.220px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "21.700px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text)));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 54.39,
      overflow: "hidden",
      borderRadius: 30,
      backgroundColor: "rgb(109,245,209)",
      display: "flex",
      flexDirection: "row",
      padding: "9.830px 0px 9.840px 0px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 54.39,
      height: 54.39,
      backgroundColor: "rgb(109,245,209)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "5.500px 0px 7.220px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "21.700px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text)));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 54.39,
      overflow: "hidden",
      borderRadius: 30,
      backgroundColor: "rgb(109,245,209)",
      display: "flex",
      flexDirection: "row",
      padding: "9.830px 0px 9.840px 0px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 54.39,
      height: 54.39,
      opacity: 0,
      backgroundColor: "rgb(109,245,209)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "5.500px 0px 7.220px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "21.700px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text)));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 300.8,
      display: "flex",
      flexDirection: "column",
      padding: "6px 0px 7.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 24,
      lineHeight: "22px",
      letterSpacing: "-1px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 300.8,
      display: "flex",
      flexDirection: "column",
      padding: "6px 0px 7.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 24,
      lineHeight: "22px",
      letterSpacing: "-1px",
      color: "rgb(60,60,60)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body8 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 54.39,
      overflow: "hidden",
      borderRadius: 30,
      backgroundColor: "rgb(60,60,60)",
      display: "flex",
      flexDirection: "row",
      padding: "9.830px 0px 9.840px 0px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 54.39,
      height: 54.39,
      backgroundColor: "rgb(60,60,60)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "5.500px 0px 7.220px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "21.700px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.text)));
  const __body9 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 54.39,
      overflow: "hidden",
      borderRadius: 30,
      backgroundColor: "rgb(60,60,60)",
      display: "flex",
      flexDirection: "row",
      padding: "9.830px 0px 9.840px 0px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 54.39,
      height: 54.39,
      opacity: 0,
      backgroundColor: "rgb(60,60,60)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: "5.500px 0px 7.220px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "21.700px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.text)));
  const __body10 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 256.56,
      display: "flex",
      flexDirection: "column",
      padding: "23.500px 0px 25.090px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 90,
      lineHeight: "81px",
      letterSpacing: "-3px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text));
  const __body11 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 256.57,
      display: "flex",
      flexDirection: "column",
      padding: "23.500px 0px 25.090px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 90,
      lineHeight: "81px",
      letterSpacing: "-3px",
      color: "rgb(60,60,60)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body12 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 385.59,
      display: "flex",
      flexDirection: "column",
      padding: "23.500px 0px 25.090px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 90,
      lineHeight: "81px",
      letterSpacing: "-3px",
      color: "rgb(247,248,252)",
      flexShrink: 0
    }
  }, props.text));
  const __body13 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 385.59,
      display: "flex",
      flexDirection: "column",
      padding: "23.500px 0px 25.090px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 90,
      lineHeight: "81px",
      letterSpacing: "-3px",
      color: "rgb(247,248,252)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body14 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 294.39,
      display: "flex",
      flexDirection: "column",
      padding: "7px 0px 8.590px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "26px",
      color: "rgb(123,132,135)",
      flexShrink: 0
    }
  }, props.text));
  const __body15 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 294.39,
      display: "flex",
      flexDirection: "column",
      padding: "7px 0px 8.590px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "26px",
      color: "rgb(123,132,135)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body16 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 331.19,
      display: "flex",
      flexDirection: "column",
      padding: "7px 0px 8.590px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "26px",
      color: "rgb(247,248,252)",
      flexShrink: 0
    }
  }, props.text));
  const __body17 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 331.19,
      display: "flex",
      flexDirection: "column",
      padding: "7px 0px 8.590px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 22,
      lineHeight: "26px",
      color: "rgb(247,248,252)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body18 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 585.59,
      display: "flex",
      flexDirection: "column",
      padding: "12px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 44,
      lineHeight: "40px",
      letterSpacing: "-3px",
      color: "rgb(60,60,60)",
      flexShrink: 0
    }
  }, props.text));
  const __body19 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 585.59,
      display: "flex",
      flexDirection: "column",
      padding: "12px 0px 12px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Arial, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 44,
      lineHeight: "40px",
      letterSpacing: "-3px",
      color: "rgb(60,60,60)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body20 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 752,
      opacity: 0.5,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(129,130,135)",
      flexShrink: 0
    }
  }, props.text));
  const __body21 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 657.89,
      opacity: 0.5,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(129,130,135)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body22 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 20.8,
      display: "flex",
      flexDirection: "column",
      padding: "5px 0px 5.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "rgb(123,132,135)",
      flexShrink: 0
    }
  }, props.text));
  const __body23 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 20.8,
      display: "flex",
      flexDirection: "column",
      padding: "5px 0px 5.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "rgb(123,132,135)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text));
  const __body24 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 23.3,
      display: "flex",
      flexDirection: "column",
      padding: "5px 0px 5.200px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "rgb(123,132,135)",
      flexShrink: 0
    }
  }, props.text));
  const __impls = {
    // figma: variant=1,:hover=true
    "variant=1|hover=true": __body0,
    // figma: variant=1,:hover=false
    "variant=1|hover=false": __body1,
    // figma: variant=2,:hover=true
    "variant=2|hover=true": __body2,
    // figma: variant=2,:hover=false
    "variant=2|hover=false": __body3,
    // figma: variant=3,:hover=true
    "variant=3|hover=true": __body4,
    // figma: variant=3,:hover=false
    "variant=3|hover=false": __body5,
    // figma: variant=4,:hover=true
    "variant=4|hover=true": __body6,
    // figma: variant=4,:hover=false
    "variant=4|hover=false": __body7,
    // figma: variant=5,:hover=true
    "variant=5|hover=true": __body8,
    // figma: variant=5,:hover=false
    "variant=5|hover=false": __body9,
    // figma: variant=6,:hover=true
    "variant=6|hover=true": __body10,
    // figma: variant=6,:hover=false
    "variant=6|hover=false": __body11,
    // figma: variant=7,:hover=true
    "variant=7|hover=true": __body12,
    // figma: variant=7,:hover=false
    "variant=7|hover=false": __body13,
    // figma: variant=8,:hover=true
    "variant=8|hover=true": __body14,
    // figma: variant=8,:hover=false
    "variant=8|hover=false": __body15,
    // figma: variant=9,:hover=true
    "variant=9|hover=true": __body16,
    // figma: variant=9,:hover=false
    "variant=9|hover=false": __body17,
    // figma: variant=10,:hover=true
    "variant=10|hover=true": __body18,
    // figma: variant=10,:hover=false
    "variant=10|hover=false": __body19,
    // figma: variant=11,:hover=false
    "variant=11|hover=false": __body20,
    // figma: variant=12,:hover=false
    "variant=12|hover=false": __body21,
    // figma: variant=13,:hover=true
    "variant=13|hover=true": __body22,
    // figma: variant=13,:hover=false
    "variant=13|hover=false": __body23,
    // figma: variant=14,:hover=false
    "variant=14|hover=false": __body24
  };
  return (__impls[__vkey_Component4(props)] ?? __body0)();
}

// figma node: 2346:69 Component 5 (2 variants)
const __venc_Component5 = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Component5 = p => "variant=" + __venc_Component5(p.variant) + '|' + "hover=" + __venc_Component5(p.hover);
function Component5(_p = {}) {
  const props = {
    ..._p,
    text: _p.text ?? "Отправить заявку",
    variant: _p.variant ?? "1",
    hover: _p.hover ?? true
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 256,
      height: 80,
      borderRadius: 100,
      backgroundColor: "rgb(115,57,255)",
      display: "flex",
      flexDirection: "column",
      padding: "0px 15px 0px 15px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.text));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 256,
      height: 80,
      borderRadius: 100,
      backgroundColor: "rgb(146,105,245)",
      display: "flex",
      flexDirection: "column",
      padding: "0px 15px 0px 15px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.text));
  const __impls = {
    // figma: variant=1,:hover=true
    "variant=1|hover=true": __body0,
    // figma: variant=1,:hover=false
    "variant=1|hover=false": __body1
  };
  return (__impls[__vkey_Component5(props)] ?? __body0)();
}

// figma node: 3907:6156 dropdown/item (5 variants)
const __venc_DropdownItem = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_DropdownItem = p => "state=" + __venc_DropdownItem(p.state) + '|' + "selected=" + __venc_DropdownItem(p.selected);
function DropdownItem(_p = {}) {
  const props = {
    ..._p,
    state: _p.state ?? "default",
    selected: _p.selected ?? false
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, props.text1 ?? "Фильтр"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, props.text1 ?? "Фильтр"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, props.text1 ?? "Фильтр"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--color-2)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 4,
      top: 4,
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "var(--color-2)"
    }
  })));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, props.text1 ?? "Фильтр"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--color-2)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 4,
      top: 4,
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "var(--color-2)"
    }
  })));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, props.text1 ?? "Фильтр"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))));
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
    "state=disabled|selected=false": __body4
  };
  return (__impls[__vkey_DropdownItem(props)] ?? __body0)();
}

// figma node: 3934:6211 dropdown (1 variants)
const __venc_Dropdown = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Dropdown = p => "property1=" + __venc_Dropdown(p.property1);
function Dropdown(_p = {}) {
  const props = {
    ..._p,
    property1: _p.property1 ?? "default"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 126,
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
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(DropdownItem, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    state: "default",
    selected: false
  }), /*#__PURE__*/React.createElement(DropdownItem, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    state: "default",
    selected: false
  }));
  const __impls = {
    // figma: Property 1=Default
    "property1=default": __body0
  };
  return (__impls[__vkey_Dropdown(props)] ?? __body0)();
}

// figma node: 2778:1593 icon / bootstrap / outline & logos / chevron-down
function IconBootstrapOutlineLogosChevron16(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13.002,
    height: 7.002,
    viewBox: "0 0 13.002 7.002",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.499,
      top: 4.499,
      width: 13.002,
      height: 7.002
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0.147 0.147 C 0.193 0.1 0.249 0.063 0.309 0.038 C 0.37 0.013 0.435 0 0.501 0 C 0.567 0 0.632 0.013 0.693 0.038 C 0.753 0.063 0.808 0.1 0.855 0.147 L 6.501 5.794 L 12.147 0.147 C 12.193 0.1 12.249 0.064 12.309 0.038 C 12.37 0.013 12.435 0 12.501 0 C 12.567 0 12.632 0.013 12.692 0.038 C 12.753 0.064 12.808 0.1 12.855 0.147 C 12.901 0.193 12.938 0.249 12.963 0.309 C 12.989 0.37 13.002 0.435 13.002 0.501 C 13.002 0.567 12.989 0.632 12.963 0.692 C 12.938 0.753 12.901 0.808 12.855 0.855 L 6.855 6.855 C 6.808 6.901 6.753 6.938 6.693 6.964 C 6.632 6.989 6.567 7.002 6.501 7.002 C 6.435 7.002 6.37 6.989 6.309 6.964 C 6.249 6.938 6.193 6.901 6.147 6.855 L 0.147 0.855 C 0.1 0.808 0.063 0.753 0.038 0.693 C 0.013 0.632 0 0.567 0 0.501 C 0 0.435 0.013 0.37 0.038 0.309 C 0.063 0.249 0.1 0.193 0.147 0.147 L 0.147 0.147 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })));
}

// figma node: 2778:2330 icon / bootstrap / outline & logos / filter-circle
function IconBootstrapOutlineLogosFilter2(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 7,
    viewBox: "0 0 10 7",
    fill: "none",
    style: {
      position: "absolute",
      left: 3,
      top: 5,
      width: 10,
      height: 7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 6.5 C 4 6.367 4.053 6.24 4.146 6.146 C 4.24 6.053 4.367 6 4.5 6 L 5.5 6 C 5.633 6 5.76 6.053 5.854 6.146 C 5.947 6.24 6 6.367 6 6.5 C 6 6.633 5.947 6.76 5.854 6.854 C 5.76 6.947 5.633 7 5.5 7 L 4.5 7 C 4.367 7 4.24 6.947 4.146 6.854 C 4.053 6.76 4 6.633 4 6.5 Z M 2 3.5 C 2 3.367 2.053 3.24 2.146 3.146 C 2.24 3.053 2.367 3 2.5 3 L 7.5 3 C 7.633 3 7.76 3.053 7.854 3.146 C 7.947 3.24 8 3.367 8 3.5 C 8 3.633 7.947 3.76 7.854 3.854 C 7.76 3.947 7.633 4 7.5 4 L 2.5 4 C 2.367 4 2.24 3.947 2.146 3.854 C 2.053 3.76 2 3.633 2 3.5 Z M 0 0.5 C 0 0.367 0.053 0.24 0.146 0.146 C 0.24 0.053 0.367 0 0.5 0 L 9.5 0 C 9.633 0 9.76 0.053 9.854 0.146 C 9.947 0.24 10 0.367 10 0.5 C 10 0.633 9.947 0.76 9.854 0.854 C 9.76 0.947 9.633 1 9.5 1 L 0.5 1 C 0.367 1 0.24 0.947 0.146 0.854 C 0.053 0.76 0 0.633 0 0.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 2826:2529 Filter (7 variants)
const __venc_Filter = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Filter = p => "state=" + __venc_Filter(p.state) + '|' + "expand=" + __venc_Filter(p.expand) + '|' + "selected=" + __venc_Filter(p.selected);
function Filter(_p = {}) {
  const props = {
    ..._p,
    state: _p.state ?? "default",
    text: _p.text ?? true,
    expand: _p.expand ?? false,
    iconR: _p.iconR ?? true,
    iconL: _p.iconL ?? true,
    selected: _p.selected ?? false
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFilter2, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.text && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 12,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "20px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null)));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFilter2, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.text && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 12,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "14px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null)));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFilter2, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.text && /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      transform: "matrix(1,0,0,-1,0,0)",
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null))), /*#__PURE__*/React.createElement(Dropdown, {
    style: {
      position: "relative",
      height: 96,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    property1: "default"
  }));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFilter2, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.text && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 12,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "14px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null)));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFilter2, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.text && /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null)));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 20,
      height: 20,
      color: "var(--brand-default)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 10 18.75 C 7.679 18.75 5.454 17.828 3.813 16.187 C 2.172 14.546 1.25 12.321 1.25 10 C 1.25 7.679 2.172 5.454 3.813 3.813 C 5.454 2.172 7.679 1.25 10 1.25 C 12.321 1.25 14.546 2.172 16.187 3.813 C 17.828 5.454 18.75 7.679 18.75 10 C 18.75 12.321 17.828 14.546 16.187 16.187 C 14.546 17.828 12.321 18.75 10 18.75 Z M 10 20 C 12.652 20 15.196 18.946 17.071 17.071 C 18.946 15.196 20 12.652 20 10 C 20 7.348 18.946 4.804 17.071 2.929 C 15.196 1.054 12.652 0 10 0 C 7.348 0 4.804 1.054 2.929 2.929 C 1.054 4.804 0 7.348 0 10 C 0 12.652 1.054 15.196 2.929 17.071 C 4.804 18.946 7.348 20 10 20 L 10 20 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 12.500,
    height: 8.750,
    viewBox: "0 0 12.500 8.750",
    fill: "none",
    style: {
      position: "absolute",
      left: 3.75,
      top: 6.25,
      width: 12.5,
      height: 8.75,
      color: "var(--brand-default)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 5 8.125 C 5 7.959 5.066 7.8 5.183 7.683 C 5.3 7.566 5.459 7.5 5.625 7.5 L 6.875 7.5 C 7.041 7.5 7.2 7.566 7.317 7.683 C 7.434 7.8 7.5 7.959 7.5 8.125 C 7.5 8.291 7.434 8.45 7.317 8.567 C 7.2 8.684 7.041 8.75 6.875 8.75 L 5.625 8.75 C 5.459 8.75 5.3 8.684 5.183 8.567 C 5.066 8.45 5 8.291 5 8.125 Z M 2.5 4.375 C 2.5 4.209 2.566 4.05 2.683 3.933 C 2.8 3.816 2.959 3.75 3.125 3.75 L 9.375 3.75 C 9.541 3.75 9.7 3.816 9.817 3.933 C 9.934 4.05 10 4.209 10 4.375 C 10 4.541 9.934 4.7 9.817 4.817 C 9.7 4.934 9.541 5 9.375 5 L 3.125 5 C 2.959 5 2.8 4.934 2.683 4.817 C 2.566 4.7 2.5 4.541 2.5 4.375 Z M 0 0.625 C 0 0.459 0.066 0.3 0.183 0.183 C 0.3 0.066 0.459 0 0.625 0 L 11.875 0 C 12.041 0 12.2 0.066 12.317 0.183 C 12.434 0.3 12.5 0.459 12.5 0.625 C 12.5 0.791 12.434 0.95 12.317 1.067 C 12.2 1.184 12.041 1.25 11.875 1.25 L 0.625 1.25 C 0.459 1.25 0.3 1.184 0.183 1.067 C 0.066 0.95 0 0.791 0 0.625 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      transform: "matrix(1,0,0,-1,0,0)",
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, "\u0424\u0438\u043B\u044C\u0442\u0440"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--color-2)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 4,
      top: 4,
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "var(--color-2)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexGrow: 1
    }
  }, "\u0424\u0438\u043B\u044C\u0442\u0440"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--text-disabled)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFilter2, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), props.text && /*#__PURE__*/React.createElement("span", {
    style: {
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
      flexShrink: 0
    }
  }, props.text1 ?? "Фильтр"), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "var(--text-disabled)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null)));
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
    "state=disabled|expand=false|selected=false": __body6
  };
  return (__impls[__vkey_Filter(props)] ?? __body0)();
}

// figma node: 2813:2228 status (6 variants)
const __venc_Status = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Status = p => "status=" + __venc_Status(p.status);
function Status(_p = {}) {
  const props = {
    ..._p,
    status: _p.status ?? "открыт"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "var(--status-new-text)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "16px",
      color: "var(--status-new-text)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Открыт"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "var(--status-review-text)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "16px",
      color: "var(--status-review-text)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "На рассмотрении"));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "var(--status-in-progress-text)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "16px",
      color: "var(--status-in-progress-text)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "В работе"));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "var(--status-testing-text)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--status-testing-text)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "На проверке"));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "var(--status-completed-text)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "16px",
      color: "var(--status-completed-text)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Завершён"));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 2,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: "var(--status-rejected-text)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "16px",
      color: "var(--status-rejected-text)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Отклонён"));
  const __impls = {
    // figma: Status=Открыт
    "status=открыт": __body0,
    // figma: Status=На рассмотрении
    "status=на рассмотрении": __body1,
    // figma: Status=В работе
    "status=в работе": __body2,
    // figma: Status=На проверке
    "status=на проверке": __body3,
    // figma: Status=Завершён
    "status=завершён": __body4,
    // figma: Status=Отклонён
    "status=отклонён": __body5
  };
  return (__impls[__vkey_Status(props)] ?? __body0)();
}

// figma node: 2802:3299 tag/Blue/XS
function TagBlueXS(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgba(0,136,255,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 11,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--color-primary-hover)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "React"));
}

// figma node: 2802:3367 Gig (6 variants)
const __venc_Gig = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Gig = p => "status=" + __venc_Gig(p.status);
function Gig(_p = {}) {
  const props = {
    ..._p,
    timeline: _p.timeline ?? true,
    postingDate: _p.postingDate ?? true,
    tags: _p.tags ?? true,
    description: _p.description ?? true,
    status: _p.status ?? "открыт",
    bottomInfo: _p.bottomInfo ?? true,
    loadline3: _p.loadline3 ?? ""
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Status, {
    status: "открыт"
  })), props.postingDate && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "13px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "2 мин")), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(Category, {
    color: "rose",
    size: "s"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "23px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14"), props.tags && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon3 ?? /*#__PURE__*/React.createElement(TagBlueXS, null)), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 81,
      flexShrink: 0
    },
    text1: "Next.js 14"
  }), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 87,
      flexShrink: 0
    },
    text1: "TypeScript"
  }))), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "25.08.2025")))), props.bottomInfo && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Status, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    status: "на рассмотрении"
  }), props.postingDate && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "13px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "2 мин")), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Category, {
    color: "rose",
    size: "s"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "23px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14"), props.tags && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(TagBlueXS, null)), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 81,
      flexShrink: 0
    },
    text1: "Next.js 14"
  }), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 87,
      flexShrink: 0
    },
    text1: "TypeScript"
  }))), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "25.08.2025")))), props.bottomInfo && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Status, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    status: "в работе"
  }), props.postingDate && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "13px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "2 мин")), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Category, {
    color: "rose",
    size: "s"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "23px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14"), props.tags && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(TagBlueXS, null)), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 81,
      flexShrink: 0
    },
    text1: "Next.js 14"
  }), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 87,
      flexShrink: 0
    },
    text1: "TypeScript"
  }))), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "25.08.2025")))), props.bottomInfo && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Status, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    status: "на проверке"
  }), props.postingDate && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "13px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "2 мин")), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Category, {
    color: "rose",
    size: "s"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "23px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14"), props.tags && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(TagBlueXS, null)), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 81,
      flexShrink: 0
    },
    text1: "Next.js 14"
  }), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 87,
      flexShrink: 0
    },
    text1: "TypeScript"
  }))), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "25.08.2025")))), props.bottomInfo && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Status, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    status: "завершён"
  }), props.postingDate && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "13px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "2 мин")), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Category, {
    color: "rose",
    size: "s"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "23px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14"), props.tags && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(TagBlueXS, null)), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 81,
      flexShrink: 0
    },
    text1: "Next.js 14"
  }), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 87,
      flexShrink: 0
    },
    text1: "TypeScript"
  }))), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "25.08.2025")))), props.bottomInfo && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Status, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    status: "отклонён"
  }), props.postingDate && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "13px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "2 мин")), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Category, {
    color: "rose",
    size: "s"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "23px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14"), props.tags && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(TagBlueXS, null)), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 81,
      flexShrink: 0
    },
    text1: "Next.js 14"
  }), /*#__PURE__*/React.createElement(TagBlueXS, {
    style: {
      position: "relative",
      width: 87,
      flexShrink: 0
    },
    text1: "TypeScript"
  }))), props.description && /*#__PURE__*/React.createElement("span", {
    style: {
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
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Требуется опытный React разработчик для рефакторинга текущего дашборда. Фокус на серверных компонентах для оптимизации производительности."), props.timeline && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "3px 0px 3px 0px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "25.08.2025"), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 46,
      borderRadius: 3000,
      backgroundColor: "rgb(159,160,164)",
      flexGrow: 1
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "25.08.2025")))), props.bottomInfo && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043A\u0441. \u0446\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "200 400 \u20BD ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "rgb(159,160,164)",
      flexShrink: 0
    }
  }, "\u0421\u0440\u043E\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 656,
      fontSize: 15,
      lineHeight: "19px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "14 \u0434\u043D\u0435\u0439")), /*#__PURE__*/React.createElement(Button, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    property: "primary",
    state: "default"
  })));
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
    "status=отклонен": __body5
  };
  return (__impls[__vkey_Gig(props)] ?? __body0)();
}

// figma node: 2778:2096 icon / bootstrap / outline & logos / file-earmark-font
function IconBootstrapOutlineLogosFile21(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 5.999,
    height: 7,
    viewBox: "0 0 5.999 7",
    fill: "none",
    style: {
      position: "absolute",
      left: 5,
      top: 6,
      width: 5.999,
      height: 7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 5.943 0 L 0.057 0 L 0 2 L 0.5 2 C 0.68 0.904 0.856 0.808 2.194 0.765 L 2.487 0.755 L 2.487 5.845 C 2.487 6.315 2.387 6.427 1.589 6.5 L 1.589 7 L 4.41 7 L 4.41 6.5 C 3.607 6.427 3.507 6.316 3.507 5.846 L 3.507 0.755 L 3.805 0.765 C 5.143 0.808 5.319 0.905 5.499 2 L 5.999 2 L 5.942 0 L 5.943 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 12,
    height: 16,
    viewBox: "0 0 12 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 2,
      top: 0,
      width: 12,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12 4.5 L 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 0 2 C 0 1.47 0.211 0.961 0.586 0.586 C 0.961 0.211 1.47 0 2 0 L 7.5 0 L 12 4.5 Z M 9 4.5 C 8.602 4.5 8.221 4.342 7.939 4.061 C 7.658 3.779 7.5 3.398 7.5 3 L 7.5 1 L 2 1 C 1.735 1 1.48 1.105 1.293 1.293 C 1.105 1.48 1 1.735 1 2 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4.5 L 9 4.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 2932:7197 H3 (2 variants)
const __venc_H3 = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_H3 = p => "type=" + __venc_H3(p.type);
function H3(_p = {}) {
  const props = {
    ..._p,
    type: _p.type ?? "header 3"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 637,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "100%",
      color: "var(--color-2-2)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ЗАДАЧА"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 637,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 6,
      height: 6,
      backgroundColor: "var(--color-2-2)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFile21, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 11,
      lineHeight: "100%",
      color: "var(--color-2-2)",
      textDecoration: "underline",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ТЗ.doc")));
  const __impls = {
    // figma: type=header 3
    "type=header 3": __body0,
    // figma: type=file
    "type=file": __body1
  };
  return (__impls[__vkey_H3(props)] ?? __body0)();
}

// figma node: 2778:3201 icon / bootstrap / outline & logos / search
function IconBootstrapOutlineLogosSearch(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 2778:3828 icon / bootstrap / outline & logos / x-circle
function IconBootstrapOutlineLogosX2(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 7.002,
    height: 7.002,
    viewBox: "0 0 7.002 7.002",
    fill: "none",
    style: {
      position: "absolute",
      left: 4.499,
      top: 4.499,
      width: 7.002,
      height: 7.002
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0.147 0.147 C 0.193 0.1 0.249 0.063 0.309 0.038 C 0.37 0.013 0.435 0 0.501 0 C 0.567 0 0.632 0.013 0.693 0.038 C 0.753 0.063 0.808 0.1 0.855 0.147 L 3.501 2.794 L 6.147 0.147 C 6.193 0.1 6.249 0.064 6.309 0.038 C 6.37 0.013 6.435 0 6.501 0 C 6.567 0 6.632 0.013 6.692 0.038 C 6.753 0.064 6.808 0.1 6.855 0.147 C 6.901 0.193 6.938 0.249 6.963 0.309 C 6.989 0.37 7.002 0.435 7.002 0.501 C 7.002 0.567 6.989 0.632 6.963 0.692 C 6.938 0.753 6.901 0.808 6.855 0.855 L 4.208 3.501 L 6.855 6.147 C 6.901 6.193 6.938 6.249 6.963 6.309 C 6.989 6.37 7.002 6.435 7.002 6.501 C 7.002 6.567 6.989 6.632 6.963 6.692 C 6.938 6.753 6.901 6.808 6.855 6.855 C 6.808 6.901 6.753 6.938 6.692 6.963 C 6.632 6.989 6.567 7.002 6.501 7.002 C 6.435 7.002 6.37 6.989 6.309 6.963 C 6.249 6.938 6.193 6.901 6.147 6.855 L 3.501 4.208 L 0.855 6.855 C 0.808 6.901 0.753 6.938 0.692 6.963 C 0.632 6.989 0.567 7.002 0.501 7.002 C 0.435 7.002 0.37 6.989 0.309 6.963 C 0.249 6.938 0.193 6.901 0.147 6.855 C 0.1 6.808 0.064 6.753 0.038 6.692 C 0.013 6.632 0 6.567 0 6.501 C 0 6.435 0.013 6.37 0.038 6.309 C 0.064 6.249 0.1 6.193 0.147 6.147 L 2.794 3.501 L 0.147 0.855 C 0.1 0.808 0.063 0.753 0.038 0.693 C 0.013 0.632 0 0.567 0 0.501 C 0 0.435 0.013 0.37 0.038 0.309 C 0.063 0.249 0.1 0.193 0.147 0.147 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 2868:2320 Input Field (1 variants)
const __venc_InputField = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_InputField = p => "state=" + __venc_InputField(p.state);
function InputField(_p = {}) {
  const props = {
    ..._p,
    iconL: _p.iconL ?? true,
    state: _p.state ?? "default",
    iconR: _p.iconR ?? true,
    text: _p.text ?? "Поиск по названию или описанию..."
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 800,
      height: 40,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "1px solid var(--brand-default)",
      borderRight: "4px solid var(--brand-default)",
      borderBottom: "1px solid var(--brand-default)",
      borderLeft: "1px solid var(--brand-default)",
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
      ...props.style
    }
  }, props.iconL && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconLType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosSearch, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 14,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "100%",
      color: "var(--text-secondary)",
      flexGrow: 1
    }
  }, props.text), props.iconR && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconRType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosX2, null)));
  const __impls = {
    // figma: State=default
    "state=default": __body0
  };
  return (__impls[__vkey_InputField(props)] ?? __body0)();
}

// figma node: 2999:4376 search + filters
function SearchFilters(_p = {}) {
  const props = {
    ..._p,
    filters: _p.filters ?? true
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1149,
      maxWidth: null,
      maxHeight: 40,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-md) * 1px)",
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(InputField, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    iconR: false,
    text: "Поиск чего угодно...",
    state: "default"
  }), props.filters && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: null,
      maxHeight: 40,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Filter, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    },
    state: "default",
    expand: false,
    selected: false
  }), /*#__PURE__*/React.createElement(Filter, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    },
    state: "default",
    expand: false,
    selected: false
  }), /*#__PURE__*/React.createElement(Filter, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    },
    state: "default",
    expand: false,
    selected: false
  }), /*#__PURE__*/React.createElement(Filter, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    },
    state: "default",
    expand: false,
    selected: false
  })));
}

// figma node: 3972:5628 switch bar (3 variants)
const __venc_SwitchBar = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_SwitchBar = p => "state=" + __venc_SwitchBar(p.state) + '|' + "active=" + __venc_SwitchBar(p.active);
function SwitchBar(_p = {}) {
  const props = {
    ..._p,
    tabText: _p.tabText ?? "Tab text",
    state: _p.state ?? "default",
    counter: _p.counter ?? false,
    active: _p.active ?? false,
    count: _p.count ?? "1"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 110,
      height: 32,
      minHeight: 32,
      maxWidth: null,
      maxHeight: 32,
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 24,
      lineHeight: "29px",
      letterSpacing: "-0.300px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.tabText), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.count));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 110,
      height: 32,
      minHeight: 32,
      maxWidth: null,
      maxHeight: 32,
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.tabText), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.count));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 110,
      height: 32,
      minHeight: 32,
      maxWidth: null,
      maxHeight: 32,
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 8px 0px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.tabText), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.count));
  const __impls = {
    // figma: State=Default, Active=no
    "state=default|active=false": __body0,
    // figma: State=Hover, Active=no
    "state=hover|active=false": __body1,
    // figma: State=Default, Active=yes
    "state=default|active=true": __body2
  };
  return (__impls[__vkey_SwitchBar(props)] ?? __body0)();
}

// figma node: 3972:5655 switcher (7 variants)
const __venc_Switcher2 = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Switcher2 = p => "activeTab=" + __venc_Switcher2(p.activeTab);
function Switcher2(_p = {}) {
  const props = {
    ..._p,
    activeTab: _p.activeTab ?? "0"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: true
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: true
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: true
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: true
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: true
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1440,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: false
  }), /*#__PURE__*/React.createElement(SwitchBar, {
    style: {
      position: "relative",
      flexGrow: 1,
      alignSelf: "stretch",
      width: "auto",
      height: "auto"
    },
    state: "default",
    active: true
  }));
  const __impls = {
    // figma: Active tab=0
    "activeTab=0": __body0,
    // figma: Active tab=1
    "activeTab=1": __body1,
    // figma: Active tab=2
    "activeTab=2": __body2,
    // figma: Active tab=3
    "activeTab=3": __body3,
    // figma: Active tab=4
    "activeTab=4": __body4,
    // figma: Active tab=5
    "activeTab=5": __body5,
    // figma: Active tab=6
    "activeTab=6": __body6
  };
  return (__impls[__vkey_Switcher2(props)] ?? __body0)();
}

// figma node: 3024:2775 HEADER (3 variants)
const __venc_HEADER = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_HEADER = p => "type=" + __venc_HEADER(p.type) + '|' + "collapsed=" + __venc_HEADER(p.collapsed);
function HEADER(_p = {}) {
  const props = {
    ..._p,
    search: _p.search ?? true,
    type: _p.type ?? "header 1",
    button: _p.button ?? true,
    collapsed: _p.collapsed ?? false,
    switcher: _p.switcher ?? false,
    counter: _p.counter ?? true
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 32,
      lineHeight: "37px",
      letterSpacing: "-0.500px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ДАШБОРД"), props.button && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 40,
      height: 40,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(ButtonIcon, {
    state: "default",
    bG: true
  }))), props.search && /*#__PURE__*/React.createElement(SearchFilters, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  }));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 600,
      fontSize: 32,
      lineHeight: "37px",
      letterSpacing: "-0.500px",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ДАШБОРД"), props.button && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 40,
      height: 40,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(ButtonIcon, {
    state: "default",
    bG: true
  }))), props.search && /*#__PURE__*/React.createElement(SearchFilters, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    }
  }));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 24,
      lineHeight: "29px",
      letterSpacing: "-0.300px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Сообщения"), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
      lineHeight: "17px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "6"))), props.button && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 40,
      height: 40,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(ButtonIcon, {
    state: "default",
    bG: true
  }))), props.switcher && /*#__PURE__*/React.createElement(Switcher2, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    activeTab: "0"
  }), props.search && /*#__PURE__*/React.createElement(InputField, {
    style: {
      position: "relative",
      height: 40,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    state: "default"
  }));
  const __impls = {
    // figma: type=Header 1, Collapsed=yes
    "type=header 1|collapsed=true": __body0,
    // figma: type=type3, Collapsed=no
    "type=type3|collapsed=false": __body1,
    // figma: type=Header 2, Collapsed=no
    "type=header 2|collapsed=false": __body2
  };
  return (__impls[__vkey_HEADER(props)] ?? __body0)();
}

// figma node: 3179:3573 logomark (4 variants)
const __venc_Logomark = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Logomark = p => "size=" + __venc_Logomark(p.size);
function Logomark(_p = {}) {
  const props = {
    ..._p,
    size: _p.size ?? "l"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 250,
      height: 250,
      borderRadius: 32,
      backgroundColor: "var(--color-2)",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 132,
    height: 150,
    viewBox: "0 0 132 150",
    fill: "none",
    style: {
      position: "absolute",
      left: 59,
      top: 50,
      width: 132,
      height: 150
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 55.731 93.878 L 112.423 93.878 L 93.808 93.878 L 93.808 112.306 L 112.423 112.306 L 112.423 150 L 131.885 150 L 131.885 74.612 L 55.731 74.612 L 55.731 93.878 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 122.692 18.428 C 115.923 18.428 113.385 15.078 113.385 9.214 L 113.385 0 L 18.615 0 L 18.615 9.214 C 18.615 15.915 15.231 18.428 9.308 18.428 L 0 18.428 L 0 130.672 L 9.308 130.672 C 16.077 130.672 18.615 134.023 18.615 139.886 L 18.615 149.1 L 75.308 149.1 L 75.308 139.886 C 75.308 133.185 78.692 130.672 84.615 130.672 L 93.923 130.672 L 93.923 112.244 L 75.308 112.244 L 75.308 121.458 C 75.308 128.159 71.923 130.672 66 130.672 L 28.769 130.672 C 22 130.672 19.462 127.322 19.462 121.458 L 19.462 28.48 C 19.462 21.779 22.846 19.266 28.769 19.266 L 104.077 19.266 C 110.846 19.266 113.385 22.616 113.385 28.48 L 113.385 56.96 L 132 56.96 L 132 18.428 L 122.692 18.428 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 175,
      height: 175,
      borderRadius: 24,
      backgroundColor: "var(--color-2)",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 92.400,
    height: 105,
    viewBox: "0 0 92.400 105",
    fill: "none",
    style: {
      position: "absolute",
      left: 41.3,
      top: 35,
      width: 92.4,
      height: 105
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 39.012 65.715 L 78.696 65.715 L 65.666 65.715 L 65.666 78.614 L 78.696 78.614 L 78.696 105 L 92.319 105 L 92.319 52.229 L 39.012 52.229 L 39.012 65.715 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 85.885 12.9 C 81.146 12.9 79.369 10.554 79.369 6.45 L 79.369 0 L 13.031 0 L 13.031 6.45 C 13.031 11.141 10.662 12.9 6.515 12.9 L 0 12.9 L 0 91.471 L 6.515 91.471 C 11.254 91.471 13.031 93.816 13.031 97.92 L 13.031 104.37 L 52.715 104.37 L 52.715 97.92 C 52.715 93.23 55.085 91.471 59.231 91.471 L 65.746 91.471 L 65.746 78.571 L 52.715 78.571 L 52.715 85.021 C 52.715 89.712 50.346 91.471 46.2 91.471 L 20.138 91.471 C 15.4 91.471 13.623 89.125 13.623 85.021 L 13.623 19.936 C 13.623 15.245 15.992 13.486 20.138 13.486 L 72.854 13.486 C 77.592 13.486 79.369 15.831 79.369 19.936 L 79.369 39.872 L 92.4 39.872 L 92.4 12.9 L 85.885 12.9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 100,
      height: 100,
      borderRadius: 12,
      backgroundColor: "var(--color-2)",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 52.800,
    height: 60,
    viewBox: "0 0 52.800 60",
    fill: "none",
    style: {
      position: "absolute",
      left: 23.6,
      top: 20,
      width: 52.8,
      height: 60
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 22.292 37.551 L 44.969 37.551 L 37.523 37.551 L 37.523 44.922 L 44.969 44.922 L 44.969 60 L 52.754 60 L 52.754 29.845 L 22.292 29.845 L 22.292 37.551 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 49.077 7.371 C 46.369 7.371 45.354 6.031 45.354 3.686 L 45.354 0 L 7.446 0 L 7.446 3.686 C 7.446 6.366 6.092 7.371 3.723 7.371 L 0 7.371 L 0 52.269 L 3.723 52.269 C 6.431 52.269 7.446 53.609 7.446 55.955 L 7.446 59.64 L 30.123 59.64 L 30.123 55.955 C 30.123 53.274 31.477 52.269 33.846 52.269 L 37.569 52.269 L 37.569 44.898 L 30.123 44.898 L 30.123 48.583 C 30.123 51.264 28.769 52.269 26.4 52.269 L 11.508 52.269 C 8.8 52.269 7.785 50.929 7.785 48.583 L 7.785 11.392 C 7.785 8.711 9.138 7.706 11.508 7.706 L 41.631 7.706 C 44.338 7.706 45.354 9.047 45.354 11.392 L 45.354 22.784 L 52.8 22.784 L 52.8 7.371 L 49.077 7.371 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 75,
      height: 75,
      borderRadius: 10,
      backgroundColor: "var(--color-2)",
      position: "relative",
      color: "rgb(255,255,255)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 39.600,
    height: 45,
    viewBox: "0 0 39.600 45",
    fill: "none",
    style: {
      position: "absolute",
      left: 17.7,
      top: 15,
      width: 39.6,
      height: 45
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 16.719 28.163 L 33.727 28.163 L 28.142 28.163 L 28.142 33.692 L 33.727 33.692 L 33.727 45 L 39.565 45 L 39.565 22.384 L 16.719 22.384 L 16.719 28.163 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 36.808 5.528 C 34.777 5.528 34.015 4.523 34.015 2.764 L 34.015 0 L 5.585 0 L 5.585 2.764 C 5.585 4.775 4.569 5.528 2.792 5.528 L 0 5.528 L 0 39.202 L 2.792 39.202 C 4.823 39.202 5.585 40.207 5.585 41.966 L 5.585 44.73 L 22.592 44.73 L 22.592 41.966 C 22.592 39.956 23.608 39.202 25.385 39.202 L 28.177 39.202 L 28.177 33.673 L 22.592 33.673 L 22.592 36.437 C 22.592 38.448 21.577 39.202 19.8 39.202 L 8.631 39.202 C 6.6 39.202 5.838 38.197 5.838 36.437 L 5.838 8.544 C 5.838 6.534 6.854 5.78 8.631 5.78 L 31.223 5.78 C 33.254 5.78 34.015 6.785 34.015 8.544 L 34.015 17.088 L 39.6 17.088 L 39.6 5.528 L 36.808 5.528 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __impls = {
    // figma: Size=L
    "size=l": __body0,
    // figma: Size=M
    "size=m": __body1,
    // figma: Size=S
    "size=s": __body2,
    // figma: Size=XS
    "size=xs": __body3
  };
  return (__impls[__vkey_Logomark(props)] ?? __body0)();
}

// figma node: 2778:3103 icon / bootstrap / outline & logos / question-square
function IconBootstrapOutlineLogosQuestion6(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 14 1 C 14.265 1 14.52 1.105 14.707 1.293 C 14.895 1.48 15 1.735 15 2 L 15 14 C 15 14.265 14.895 14.52 14.707 14.707 C 14.52 14.895 14.265 15 14 15 L 2 15 C 1.735 15 1.48 14.895 1.293 14.707 C 1.105 14.52 1 14.265 1 14 L 1 2 C 1 1.735 1.105 1.48 1.293 1.293 C 1.48 1.105 1.735 1 2 1 L 14 1 Z M 2 0 C 1.47 0 0.961 0.211 0.586 0.586 C 0.211 0.961 0 1.47 0 2 L 0 14 C 0 14.53 0.211 15.039 0.586 15.414 C 0.961 15.789 1.47 16 2 16 L 14 16 C 14.53 16 15.039 15.789 15.414 15.414 C 15.789 15.039 16 14.53 16 14 L 16 2 C 16 1.47 15.789 0.961 15.414 0.586 C 15.039 0.211 14.53 0 14 0 L 2 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 5.423,
    height: 8.976,
    viewBox: "0 0 5.423 8.976",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.255,
      top: 3.5,
      width: 5.423,
      height: 8.976
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 2.286 C -0.001 2.318 0.004 2.351 0.016 2.381 C 0.027 2.411 0.045 2.438 0.067 2.462 C 0.09 2.485 0.117 2.503 0.147 2.515 C 0.177 2.528 0.209 2.534 0.241 2.533 L 1.066 2.533 C 1.204 2.533 1.314 2.42 1.332 2.283 C 1.422 1.627 1.872 1.149 2.674 1.149 C 3.36 1.149 3.988 1.492 3.988 2.317 C 3.988 2.952 3.614 3.244 3.023 3.688 C 2.35 4.177 1.817 4.748 1.855 5.675 L 1.858 5.892 C 1.859 5.958 1.886 6.02 1.933 6.066 C 1.98 6.112 2.043 6.138 2.108 6.138 L 2.919 6.138 C 2.986 6.138 3.049 6.112 3.096 6.065 C 3.143 6.018 3.169 5.954 3.169 5.888 L 3.169 5.783 C 3.169 5.065 3.442 4.856 4.179 4.297 C 4.788 3.834 5.423 3.32 5.423 2.241 C 5.423 0.73 4.147 0 2.75 0 C 1.483 0 0.095 0.59 0 2.286 L 0 2.286 Z M 1.557 8.049 C 1.557 8.582 1.982 8.976 2.567 8.976 C 3.176 8.976 3.595 8.582 3.595 8.049 C 3.595 7.497 3.175 7.109 2.566 7.109 C 1.982 7.109 1.557 7.497 1.557 8.049 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 3857:5793 massage (3 variants)
const __venc_Massage = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Massage = p => "shorten=" + __venc_Massage(p.shorten) + '|' + "state=" + __venc_Massage(p.state);
function Massage(_p = {}) {
  const props = {
    ..._p,
    shorten: _p.shorten ?? false,
    state: _p.state ?? "default"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 235,
      borderRadius: 12,
      backgroundColor: "var(--surface-secondary)",
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosQuestion6, {
    style: {
      transform: "scale(1.250, 1.250)",
      transformOrigin: "0 0"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 656,
      fontSize: 18,
      lineHeight: "20px",
      color: "var(--text-primary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Поддержка")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 12,
      lineHeight: "12px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 35,
      borderRadius: 4,
      backgroundColor: "var(--surface-tetriary)",
      borderTop: "1px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "1px solid var(--brand-default)",
      borderLeft: "1px solid var(--brand-default)",
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 14,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "100%",
      color: "var(--text-secondary)",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, "\u0427\u0442\u043E \u0441\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C?"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 15.705,
    height: 15.703,
    viewBox: "0 0 15.705 15.703",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.295,
      top: 0.001,
      width: 15.705,
      height: 15.703,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 15.559 0.145 C 15.628 0.215 15.676 0.303 15.695 0.399 C 15.715 0.495 15.706 0.594 15.669 0.685 L 9.85 15.232 C 9.799 15.36 9.713 15.472 9.603 15.554 C 9.492 15.637 9.361 15.687 9.224 15.7 C 9.086 15.713 8.948 15.688 8.824 15.627 C 8.7 15.566 8.595 15.473 8.521 15.356 L 5.343 10.361 L 0.348 7.183 C 0.232 7.109 0.138 7.004 0.077 6.88 C 0.016 6.756 -0.01 6.618 0.003 6.48 C 0.016 6.343 0.067 6.211 0.149 6.101 C 0.232 5.99 0.344 5.904 0.472 5.853 L 15.019 0.036 C 15.11 0 15.21 -0.009 15.306 0.01 C 15.402 0.03 15.49 0.077 15.559 0.146 L 15.559 0.145 Z M 6.341 10.069 L 9.102 14.407 L 13.835 2.575 L 6.341 10.069 Z M 13.128 1.868 L 1.296 6.601 L 5.635 9.361 L 13.129 1.868 L 13.128 1.868 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      height: 78,
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      padding: "24px 24px 24px 24px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-lg) * 1px)",
      paddingTop: "calc(var(--spacing-lg) * 1px)",
      paddingRight: "calc(var(--spacing-lg) * 1px)",
      paddingBottom: "calc(var(--spacing-lg) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 24,
      height: 24,
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosQuestion6, {
    style: {
      transform: "scale(1.500, 1.500)",
      transformOrigin: "0 0"
    }
  })))));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 12,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      paddingLeft: "calc(var(--spacing-0) * 1px)",
      paddingTop: "calc(var(--spacing-0) * 1px)",
      paddingRight: "calc(var(--spacing-0) * 1px)",
      paddingBottom: "calc(var(--spacing-0) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 78,
      height: 78,
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      padding: "24px 24px 24px 24px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-lg) * 1px)",
      paddingTop: "calc(var(--spacing-lg) * 1px)",
      paddingRight: "calc(var(--spacing-lg) * 1px)",
      paddingBottom: "calc(var(--spacing-lg) * 1px)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 24,
      height: 24,
      flexShrink: 0,
      color: "var(--brand-default)"
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosQuestion6, {
    style: {
      transform: "scale(1.500, 1.500)",
      transformOrigin: "0 0"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 180,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "23px",
      color: "var(--text-primary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Поддержка"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться.")));
  const __impls = {
    // figma: shorten=no, State=Default
    "shorten=false|state=default": __body0,
    // figma: shorten=yes, State=Default
    "shorten=true|state=default": __body1,
    // figma: shorten=yes, State=Hover
    "shorten=true|state=hover": __body2
  };
  return (__impls[__vkey_Massage(props)] ?? __body0)();
}

// figma node: 2801:2907 menupage (6 variants)
const __venc_Menupage = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Menupage = p => "shorten=" + __venc_Menupage(p.shorten) + '|' + "state=" + __venc_Menupage(p.state);
function Menupage(_p = {}) {
  const props = {
    ..._p,
    shorten: _p.shorten ?? true,
    page: _p.page ?? "Проекты",
    state: _p.state ?? "default",
    icon: _p.icon ?? true,
    counter: _p.counter ?? true
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 304,
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, props.page)), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "6"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 304,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.page)), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "6"));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 304,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, props.page)), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "6"));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, null)), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "6"));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, null)), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "6"));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "var(--text-primary)"
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, null)), props.counter && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "6"));
  const __impls = {
    // figma: shorten=no, State=Default
    "shorten=false|state=default": __body0,
    // figma: shorten=no, State=Hover
    "shorten=false|state=hover": __body1,
    // figma: shorten=no, State=Active
    "shorten=false|state=active": __body2,
    // figma: shorten=yes, State=Default
    "shorten=true|state=default": __body3,
    // figma: shorten=yes, State=Hover
    "shorten=true|state=hover": __body4,
    // figma: shorten=yes, State=Active
    "shorten=true|state=active": __body5
  };
  return (__impls[__vkey_Menupage(props)] ?? __body3)();
}

// figma node: 2802:3444 Menu (14 variants)
const __venc_Menu = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Menu = p => "shorten=" + __venc_Menu(p.shorten) + '|' + "activeTab=" + __venc_Menu(p.activeTab);
function Menu(_p = {}) {
  const props = {
    ..._p,
    shorten: _p.shorten ?? false,
    activeTab: _p.activeTab ?? "0"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosJournals, {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "5",
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0"))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "5",
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0"))));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "5",
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0"))));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    page: "Мои гиги",
    shorten: false,
    state: "active"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0"))));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "5",
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0"))));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "5",
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0"))));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 6 1 L 1 1 L 1 15 L 6 15 L 6 1 Z M 15 1 L 10 1 L 10 6 L 15 6 L 15 1 Z M 15 10 L 15 15 L 10 15 L 10 10 L 15 10 Z M 0 1 C 0 0.735 0.105 0.48 0.293 0.293 C 0.48 0.105 0.735 0 1 0 L 6 0 C 6.265 0 6.52 0.105 6.707 0.293 C 6.895 0.48 7 0.735 7 1 L 7 15 C 7 15.265 6.895 15.52 6.707 15.707 C 6.52 15.895 6.265 16 6 16 L 1 16 C 0.735 16 0.48 15.895 0.293 15.707 C 0.105 15.52 0 15.265 0 15 L 0 1 Z M 9 1 C 9 0.735 9.105 0.48 9.293 0.293 C 9.48 0.105 9.735 0 10 0 L 15 0 C 15.265 0 15.52 0.105 15.707 0.293 C 15.895 0.48 16 0.735 16 1 L 16 6 C 16 6.265 15.895 6.52 15.707 6.707 C 15.52 6.895 15.265 7 15 7 L 10 7 C 9.735 7 9.48 6.895 9.293 6.707 C 9.105 6.52 9 6.265 9 6 L 9 1 Z M 10 9 C 9.735 9 9.48 9.105 9.293 9.293 C 9.105 9.48 9 9.735 9 10 L 9 15 C 9 15.265 9.105 15.52 9.293 15.707 C 9.48 15.895 9.735 16 10 16 L 15 16 C 15.265 16 15.52 15.895 15.707 15.707 C 15.895 15.52 16 15.265 16 15 L 16 10 C 16 9.735 15.895 9.48 15.707 9.293 C 15.52 9.105 15.265 9 15 9 L 10 9 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0414\u0430\u0448\u0431\u043E\u0440\u0434")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16.001,
    height: 15.998,
    viewBox: "0 0 16.001 15.998",
    fill: "none",
    style: {
      position: "absolute",
      left: -0.001,
      top: 0.002,
      width: 16.001,
      height: 15.998,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.743 10.342 C 12.711 9.021 13.145 7.383 12.957 5.755 C 12.77 4.128 11.974 2.631 10.731 1.565 C 9.487 0.499 7.887 -0.058 6.25 0.005 C 4.613 0.068 3.06 0.747 1.902 1.905 C 0.744 3.064 0.067 4.617 0.005 6.254 C -0.057 7.891 0.501 9.491 1.568 10.734 C 2.635 11.977 4.132 12.771 5.76 12.958 C 7.387 13.144 9.025 12.709 10.346 11.74 L 10.345 11.74 C 10.375 11.78 10.407 11.818 10.443 11.855 L 14.293 15.705 C 14.48 15.893 14.735 15.998 15 15.998 C 15.265 15.998 15.52 15.893 15.707 15.706 C 15.895 15.518 16.001 15.264 16.001 14.999 C 16.001 14.733 15.895 14.479 15.708 14.291 L 11.858 10.441 C 11.822 10.405 11.784 10.372 11.743 10.341 L 11.743 10.342 Z M 12.001 6.498 C 12.001 7.22 11.859 7.936 11.582 8.603 C 11.306 9.27 10.901 9.877 10.39 10.387 C 9.879 10.898 9.273 11.303 8.606 11.579 C 7.938 11.856 7.223 11.998 6.501 11.998 C 5.779 11.998 5.063 11.856 4.396 11.579 C 3.729 11.303 3.123 10.898 2.612 10.387 C 2.101 9.877 1.696 9.27 1.42 8.603 C 1.143 7.936 1.001 7.22 1.001 6.498 C 1.001 5.039 1.58 3.641 2.612 2.609 C 3.643 1.578 5.042 0.998 6.501 0.998 C 7.96 0.998 9.359 1.578 10.39 2.609 C 11.421 3.641 12.001 5.039 12.001 6.498 L 12.001 6.498 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u041F\u043E\u0438\u0441\u043A")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "5",
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.931,
    viewBox: "0 0 16 14.931",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 1,
      width: 16,
      height: 14.931,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 2.678 10.894 C 2.782 10.998 2.861 11.124 2.911 11.262 C 2.961 11.401 2.979 11.549 2.965 11.695 C 2.895 12.373 2.761 13.042 2.567 13.695 C 3.962 13.372 4.814 12.998 5.201 12.802 C 5.421 12.691 5.673 12.664 5.911 12.728 C 6.592 12.91 7.295 13.001 8 13 C 11.996 13 15 10.193 15 7 C 15 3.808 11.996 1 8 1 C 4.004 1 1 3.808 1 7 C 1 8.468 1.617 9.83 2.678 10.894 Z M 2.185 14.799 C 1.948 14.846 1.71 14.889 1.472 14.928 C 1.272 14.96 1.12 14.752 1.199 14.566 C 1.288 14.357 1.369 14.144 1.443 13.929 L 1.446 13.919 C 1.694 13.199 1.896 12.371 1.97 11.6 C 0.743 10.37 0 8.76 0 7 C 0 3.134 3.582 0 8 0 C 12.418 0 16 3.134 16 7 C 16 10.866 12.418 14 8 14 C 7.208 14.001 6.419 13.898 5.653 13.694 C 5.133 13.957 4.014 14.436 2.185 14.799 L 2.185 14.799 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0427\u0430\u0442\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 14.719,
    viewBox: "0 0 16 14.719",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0.281,
      width: 16,
      height: 14.719,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.136 0.045 C 12.357 -0.01 12.588 -0.015 12.811 0.033 C 13.034 0.08 13.243 0.177 13.423 0.317 C 13.602 0.457 13.748 0.637 13.848 0.841 C 13.948 1.046 14 1.271 14 1.499 L 14 2.719 L 14.5 2.719 C 14.898 2.719 15.279 2.877 15.561 3.158 C 15.842 3.439 16 3.821 16 4.219 L 16 13.219 C 16 13.617 15.842 13.998 15.561 14.279 C 15.279 14.561 14.898 14.719 14.5 14.719 L 1.5 14.719 C 1.102 14.719 0.721 14.561 0.439 14.279 C 0.158 13.998 0 13.617 0 13.219 L 0 4.219 C 0 3.833 0.149 3.461 0.415 3.182 C 0.682 2.903 1.046 2.737 1.432 2.72 L 12.136 0.045 Z M 5.562 2.719 L 13 2.719 L 13 1.499 C 13 1.423 12.982 1.348 12.949 1.28 C 12.916 1.212 12.867 1.152 12.807 1.106 C 12.748 1.059 12.678 1.027 12.604 1.011 C 12.529 0.995 12.453 0.996 12.379 1.015 L 5.562 2.719 Z M 1.5 3.719 C 1.367 3.719 1.24 3.772 1.146 3.865 C 1.053 3.959 1 4.086 1 4.219 L 1 13.219 C 1 13.351 1.053 13.479 1.146 13.572 C 1.24 13.666 1.367 13.719 1.5 13.719 L 14.5 13.719 C 14.633 13.719 14.76 13.666 14.854 13.572 C 14.947 13.479 15 13.351 15 13.219 L 15 4.219 C 15 4.086 14.947 3.959 14.854 3.865 C 14.76 3.772 14.633 3.719 14.5 3.719 L 1.5 3.719 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 18,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "\u0424\u0438\u043D\u0430\u043D\u0441\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-default)",
      borderRight: "2px solid var(--brand-default)",
      borderBottom: "4px solid var(--brand-default)",
      borderLeft: "4px solid var(--brand-default)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 L 7 14.933 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0
    }
  }, "\u0421\u043F\u043E\u0440\u044B")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6"))));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))));
  const __body8 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))));
  const __body9 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))));
  const __body10 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "active"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))));
  const __body11 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))));
  const __body12 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))));
  const __body13 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 78,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-md) * 1px)",
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Menupage, {
    style: {
      position: "relative",
      height: 32,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--text-secondary)",
      flexShrink: 0
    }
  }, "6")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32,
      borderRadius: 4,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "2px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "2px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "4px 16px 4px 16px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4 0 L 12 0 C 12.53 0 13.039 0.211 13.414 0.586 C 13.789 0.961 14 1.47 14 2 L 14 12 C 14 12.53 13.789 13.039 13.414 13.414 C 13.039 13.789 12.53 14 12 14 C 12 14.53 11.789 15.039 11.414 15.414 C 11.039 15.789 10.53 16 10 16 L 2 16 C 1.47 16 0.961 15.789 0.586 15.414 C 0.211 15.039 0 14.53 0 14 L 1 14 C 1 14.265 1.105 14.52 1.293 14.707 C 1.48 14.895 1.735 15 2 15 L 10 15 C 10.265 15 10.52 14.895 10.707 14.707 C 10.895 14.52 11 14.265 11 14 L 11 4 C 11 3.735 10.895 3.48 10.707 3.293 C 10.52 3.105 10.265 3 10 3 L 2 3 C 1.735 3 1.48 3.105 1.293 3.293 C 1.105 3.48 1 3.735 1 4 L 0 4 C 0 3.47 0.211 2.961 0.586 2.586 C 0.961 2.211 1.47 2 2 2 L 10 2 C 10.53 2 11.039 2.211 11.414 2.586 C 11.789 2.961 12 3.47 12 4 L 12 13 C 12.265 13 12.52 12.895 12.707 12.707 C 12.895 12.52 13 12.265 13 12 L 13 2 C 13 1.735 12.895 1.48 12.707 1.293 C 12.52 1.105 12.265 1 12 1 L 4 1 C 3.735 1 3.48 1.105 3.293 1.293 C 3.105 1.48 3 1.735 3 2 L 2 2 C 2 1.47 2.211 0.961 2.586 0.586 C 2.961 0.211 3.47 0 4 0 L 4 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 8,
    viewBox: "0 0 3 8",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 5,
      width: 3,
      height: 8,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1 1 L 1 0.5 C 1 0.367 1.053 0.24 1.146 0.146 C 1.24 0.053 1.367 0 1.5 0 C 1.633 0 1.76 0.053 1.854 0.146 C 1.947 0.24 2 0.367 2 0.5 L 2 1 L 2.5 1 C 2.633 1 2.76 1.053 2.854 1.146 C 2.947 1.24 3 1.367 3 1.5 C 3 1.633 2.947 1.76 2.854 1.854 C 2.76 1.947 2.633 2 2.5 2 L 0.5 2 C 0.367 2 0.24 1.947 0.146 1.854 C 0.053 1.76 0 1.633 0 1.5 C 0 1.367 0.053 1.24 0.146 1.146 C 0.24 1.053 0.367 1 0.5 1 L 1 1 Z M 1 4 L 1 3.5 C 1 3.367 1.053 3.24 1.146 3.146 C 1.24 3.053 1.367 3 1.5 3 C 1.633 3 1.76 3.053 1.854 3.146 C 1.947 3.24 2 3.367 2 3.5 L 2 4 L 2.5 4 C 2.633 4 2.76 4.053 2.854 4.146 C 2.947 4.24 3 4.367 3 4.5 C 3 4.633 2.947 4.76 2.854 4.854 C 2.76 4.947 2.633 5 2.5 5 L 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 C 0 4.367 0.053 4.24 0.146 4.146 C 0.24 4.053 0.367 4 0.5 4 L 1 4 Z M 1 6.5 L 1 7 L 0.5 7 C 0.367 7 0.24 7.053 0.146 7.146 C 0.053 7.24 0 7.367 0 7.5 C 0 7.633 0.053 7.76 0.146 7.854 C 0.24 7.947 0.367 8 0.5 8 L 2.5 8 C 2.633 8 2.76 7.947 2.854 7.854 C 2.947 7.76 3 7.633 3 7.5 C 3 7.367 2.947 7.24 2.854 7.146 C 2.76 7.053 2.633 7 2.5 7 L 2 7 L 2 6.5 C 2 6.367 1.947 6.24 1.854 6.146 C 1.76 6.053 1.633 6 1.5 6 C 1.367 6 1.24 6.053 1.146 6.146 C 1.053 6.24 1 6.367 1 6.5 L 1 6.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "17px",
      color: "var(--brand-default)",
      flexShrink: 0
    }
  }, "6"))));
  const __impls = {
    // figma: shorten=no, Active tab=0
    "shorten=false|activeTab=0": __body0,
    // figma: shorten=no, Active tab=1
    "shorten=false|activeTab=1": __body1,
    // figma: shorten=no, Active tab=2
    "shorten=false|activeTab=2": __body2,
    // figma: shorten=no, Active tab=3
    "shorten=false|activeTab=3": __body3,
    // figma: shorten=no, Active tab=4
    "shorten=false|activeTab=4": __body4,
    // figma: shorten=no, Active tab=5
    "shorten=false|activeTab=5": __body5,
    // figma: shorten=no, Active tab=6
    "shorten=false|activeTab=6": __body6,
    // figma: shorten=yes, Active tab=0
    "shorten=true|activeTab=0": __body7,
    // figma: shorten=yes, Active tab=1
    "shorten=true|activeTab=1": __body8,
    // figma: shorten=yes, Active tab=2
    "shorten=true|activeTab=2": __body9,
    // figma: shorten=yes, Active tab=3
    "shorten=true|activeTab=3": __body10,
    // figma: shorten=yes, Active tab=4
    "shorten=true|activeTab=4": __body11,
    // figma: shorten=yes, Active tab=5
    "shorten=true|activeTab=5": __body12,
    // figma: shorten=yes, Active tab=6
    "shorten=true|activeTab=6": __body13
  };
  return (__impls[__vkey_Menu(props)] ?? __body0)();
}

// figma node: 2931:2366 bio/message/COMPANY
function BioMessageCOMPANY(_p = {}) {
  const props = {
    ..._p,
    prop: _p.prop ?? true,
    verificationMark: _p.verificationMark ?? true,
    profile: _p.profile ?? true,
    stars: _p.stars ?? "",
    info: _p.info ?? true,
    text: _p.text ?? "был(-а) недавно",
    text2: _p.text2 ?? true
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 370,
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 26,
      borderRadius: 666,
      backgroundColor: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      color: "rgb(0,0,0)"
    }
  }, "V")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "Vercel"), props.verificationMark && /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPatch, {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0,
      color: "rgb(255,255,255)"
    }
  })), props.prop && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 2,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 12,
      height: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    style: {
      transform: "scale(0.750, 0.750)",
      transformOrigin: "0 0"
    },
    property1: "bootstrap",
    property2: "filled",
    property3: "star"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 300,
      fontSize: 10,
      lineHeight: "10px",
      letterSpacing: "-0.020em",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "45")));
}

// figma node: 2866:2507 Message (2 variants)
const __venc_Message = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Message = p => "view=" + __venc_Message(p.view);
function Message(_p = {}) {
  const props = {
    ..._p,
    counter: _p.counter ?? true,
    view: _p.view ?? "dashboard"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 275,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--gig-bg)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px 12px 12px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(BioMessageCOMPANY, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    verificationMark: false,
    info: false,
    prop: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 22,
      height: 22,
      borderRadius: 666,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "3px 3px 3px 3px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      overflow: "hidden",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? "), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "Кристина"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "2 мин"))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 275,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--gig-bg)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px 12px 12px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Bio, {
    style: {
      position: "relative",
      flexGrow: 1,
      width: "auto"
    },
    sizeFor: "gig",
    uSER: "company"
  }), /*#__PURE__*/React.createElement(Status, {
    style: {
      position: "relative",
      flexShrink: 0
    },
    status: "отклонён"
  }), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 22,
      height: 22,
      borderRadius: 666,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "3px 3px 3px 3px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "5"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexGrow: 1,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Миграция аналитического дашборда на Next.js 14")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text3 ?? "Кристина"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "09:41")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      overflow: "hidden",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ")));
  const __impls = {
    // figma: view=dashboard
    "view=dashboard": __body0,
    // figma: view=chat
    "view=chat": __body1
  };
  return (__impls[__vkey_Message(props)] ?? __body0)();
}

// figma node: 2962:3883 profile frame (8 variants)
const __venc_ProfileFrame = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_ProfileFrame = p => "view=" + __venc_ProfileFrame(p.view) + '|' + "state=" + __venc_ProfileFrame(p.state);
function ProfileFrame(_p = {}) {
  const props = {
    ..._p,
    view: _p.view ?? "full",
    state: _p.state ?? "default"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      position: "relative",
      width: 48,
      height: 48,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "14px",
      color: "var(--text-primary)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Тимур Камальтдинов"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"JetBrains Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 457,
      fontSize: 12,
      lineHeight: "12px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Специалист")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      position: "relative",
      width: 48,
      height: 48,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "16px",
      letterSpacing: "-0.010em",
      color: "var(--text-primary)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Тимур Камальтдинов"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 12,
      lineHeight: "12px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Специалист")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      position: "relative",
      width: 48,
      height: 48,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Тимур Камальтдинов"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "13px",
      letterSpacing: "0.200px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Специалист")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 280,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "4px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "4px solid var(--brand-active)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none",
    style: {
      position: "relative",
      width: 48,
      height: 48,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 24 C 0 10.745 10.745 0 24 0 L 24 0 C 37.255 0 48 10.745 48 24 L 48 24 C 48 37.255 37.255 48 24 48 L 24 48 C 10.745 48 0 37.255 0 24 L 0 24 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xs) * 1px)",
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 13,
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
      lineHeight: "15px",
      letterSpacing: "0.300px",
      color: "var(--text-primary)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Тимур Камальтдинов"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"SF Compact\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 457,
      fontSize: 11,
      lineHeight: "11px",
      letterSpacing: "0.200px",
      color: "var(--text-secondary)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Специалист")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    height: 46,
    viewBox: "0 0 46 46",
    fill: "none",
    style: {
      position: "relative",
      height: 46,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body5 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-tetriary)",
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    height: 46,
    viewBox: "0 0 46 46",
    fill: "none",
    style: {
      position: "relative",
      height: 46,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body6 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      boxShadow: "0px 0px 0px 2px rgba(0,136,255,0.4)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    height: 46,
    viewBox: "0 0 46 46",
    fill: "none",
    style: {
      position: "relative",
      height: 46,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __body7 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      height: 158,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "var(--surface-elevated)",
      borderTop: "4px solid var(--brand-active)",
      borderRight: "4px solid var(--brand-active)",
      borderBottom: "4px solid var(--brand-active)",
      borderLeft: "4px solid var(--brand-active)",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-sm2) * 1px)",
      padding: "12px 16px 12px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm2) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm2) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    height: 46,
    viewBox: "0 0 46 46",
    fill: "none",
    style: {
      position: "relative",
      height: 46,
      overflow: "hidden",
      borderRadius: 6666,
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 23 C 0 10.297 10.297 0 23 0 L 23 0 C 35.703 0 46 10.297 46 23 L 46 23 C 46 35.703 35.703 46 23 46 L 23 46 C 10.297 46 0 35.703 0 23 L 0 23 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "calc(var(--spacing-0) * 1px)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 20.001,
    viewBox: "0 0 17.500 20.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: -0.001,
      width: 17.5,
      height: 20.001,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.75 20.001 C 9.413 20.001 10.049 19.738 10.518 19.269 C 10.987 18.8 11.25 18.164 11.25 17.501 L 6.25 17.501 C 6.25 18.164 6.513 18.8 6.982 19.269 C 7.451 19.738 8.087 20.001 8.75 20.001 Z M 8.75 2.399 L 7.754 2.6 C 6.624 2.83 5.608 3.444 4.878 4.337 C 4.149 5.23 3.75 6.348 3.75 7.501 C 3.75 8.286 3.582 10.247 3.176 12.179 C 2.976 13.137 2.706 14.136 2.348 15.001 L 15.153 15.001 C 14.794 14.136 14.525 13.139 14.324 12.179 C 13.917 10.247 13.75 8.286 13.75 7.501 C 13.75 6.348 13.351 5.231 12.621 4.338 C 11.892 3.445 10.876 2.831 9.746 2.601 L 8.75 2.399 Z M 16.525 15.001 C 16.804 15.56 17.126 16.002 17.5 16.251 L 0 16.251 C 0.374 16.002 0.696 15.56 0.975 15.001 C 2.1 12.751 2.5 8.601 2.5 7.501 C 2.5 4.476 4.65 1.951 7.506 1.375 C 7.489 1.201 7.508 1.026 7.563 0.86 C 7.617 0.694 7.706 0.541 7.823 0.411 C 7.94 0.282 8.083 0.178 8.243 0.107 C 8.403 0.037 8.575 0 8.75 0 C 8.925 0 9.097 0.037 9.257 0.107 C 9.417 0.178 9.56 0.282 9.677 0.411 C 9.794 0.541 9.883 0.694 9.937 0.86 C 9.992 1.026 10.011 1.201 9.994 1.375 C 11.407 1.662 12.677 2.429 13.589 3.545 C 14.501 4.662 15 6.059 15 7.501 C 15 8.601 15.4 12.751 16.525 15.001 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 2,
      width: 16,
      height: 16,
      borderRadius: 484.3636169433594,
      backgroundColor: "var(--color-2)",
      display: "flex",
      flexDirection: "column",
      gap: 7.272727012634277,
      padding: "2.182px 2.182px 2.182px 2.182px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 8.727272033691406,
      textAlign: "center",
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, "7"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.115,
    height: 8.115,
    viewBox: "0 0 8.115 8.115",
    fill: "none",
    style: {
      position: "absolute",
      left: 5.942,
      top: 5.943,
      width: 8.115,
      height: 8.115,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.058 0 C 3.525 0 2.997 0.105 2.505 0.309 C 2.012 0.513 1.565 0.812 1.188 1.188 C 0.812 1.565 0.513 2.012 0.309 2.505 C 0.105 2.997 0 3.525 0 4.057 C 0 4.59 0.105 5.118 0.309 5.61 C 0.513 6.103 0.812 6.55 1.188 6.927 C 1.565 7.303 2.012 7.602 2.505 7.806 C 2.997 8.01 3.525 8.115 4.058 8.115 C 5.134 8.115 6.166 7.688 6.927 6.927 C 7.688 6.166 8.115 5.134 8.115 4.057 C 8.115 2.981 7.688 1.949 6.927 1.188 C 6.166 0.427 5.134 0 4.058 0 L 4.058 0 Z M 1.25 4.057 C 1.25 3.313 1.546 2.599 2.072 2.072 C 2.599 1.546 3.313 1.25 4.058 1.25 C 4.802 1.25 5.516 1.546 6.043 2.072 C 6.569 2.599 6.865 3.313 6.865 4.057 C 6.865 4.802 6.569 5.516 6.043 6.043 C 5.516 6.569 4.802 6.865 4.058 6.865 C 3.313 6.865 2.599 6.569 2.072 6.043 C 1.546 5.516 1.25 4.802 1.25 4.057 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 19.999,
    height: 19.999,
    viewBox: "0 0 19.999 19.999",
    fill: "none",
    style: {
      position: "absolute",
      left: 0.001,
      top: 0.001,
      width: 19.999,
      height: 19.999,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.244 1.678 C 11.586 -0.559 8.413 -0.559 7.754 1.678 L 7.637 2.077 C 7.591 2.233 7.51 2.377 7.402 2.498 C 7.293 2.619 7.158 2.714 7.008 2.777 C 6.857 2.839 6.695 2.867 6.532 2.858 C 6.37 2.85 6.211 2.805 6.068 2.727 L 5.703 2.527 C 3.653 1.412 1.412 3.654 2.528 5.703 L 2.727 6.068 C 2.805 6.211 2.85 6.37 2.858 6.532 C 2.867 6.695 2.839 6.857 2.777 7.008 C 2.714 7.158 2.619 7.293 2.498 7.402 C 2.377 7.51 2.233 7.591 2.077 7.637 L 1.678 7.754 C -0.559 8.413 -0.559 11.586 1.678 12.244 L 2.077 12.362 C 2.233 12.408 2.377 12.488 2.498 12.597 C 2.619 12.706 2.714 12.841 2.777 12.991 C 2.839 13.141 2.867 13.304 2.858 13.466 C 2.85 13.629 2.805 13.788 2.727 13.931 L 2.527 14.296 C 1.412 16.346 3.653 18.588 5.703 17.471 L 6.068 17.272 C 6.211 17.194 6.37 17.149 6.532 17.14 C 6.695 17.132 6.857 17.16 7.008 17.222 C 7.158 17.284 7.293 17.38 7.402 17.501 C 7.51 17.622 7.591 17.766 7.637 17.922 L 7.754 18.321 C 8.413 20.558 11.586 20.558 12.244 18.321 L 12.362 17.922 C 12.408 17.766 12.488 17.622 12.597 17.501 C 12.706 17.38 12.841 17.284 12.991 17.222 C 13.141 17.16 13.304 17.132 13.466 17.14 C 13.629 17.149 13.788 17.194 13.931 17.272 L 14.296 17.472 C 16.346 18.588 18.588 16.344 17.471 14.296 L 17.272 13.931 C 17.194 13.788 17.149 13.629 17.14 13.466 C 17.132 13.304 17.16 13.141 17.222 12.991 C 17.284 12.841 17.38 12.706 17.501 12.597 C 17.622 12.488 17.766 12.408 17.922 12.362 L 18.321 12.244 C 20.558 11.586 20.558 8.413 18.321 7.754 L 17.922 7.637 C 17.766 7.591 17.622 7.51 17.501 7.402 C 17.38 7.293 17.284 7.158 17.222 7.008 C 17.16 6.857 17.132 6.695 17.14 6.532 C 17.149 6.37 17.194 6.211 17.272 6.068 L 17.472 5.703 C 18.588 3.653 16.344 1.412 14.296 2.528 L 13.931 2.727 C 13.788 2.805 13.629 2.85 13.466 2.858 C 13.304 2.867 13.141 2.839 12.991 2.777 C 12.841 2.714 12.706 2.619 12.597 2.498 C 12.488 2.377 12.408 2.233 12.362 2.077 L 12.244 1.678 L 12.244 1.678 Z M 8.953 2.032 C 9.261 0.988 10.738 0.988 11.046 2.032 L 11.163 2.431 C 11.262 2.766 11.434 3.074 11.668 3.334 C 11.902 3.594 12.19 3.798 12.513 3.932 C 12.836 4.065 13.185 4.125 13.533 4.107 C 13.882 4.088 14.223 3.992 14.529 3.824 L 14.893 3.624 C 15.848 3.106 16.893 4.149 16.373 5.106 L 16.174 5.471 C 16.007 5.777 15.911 6.118 15.893 6.466 C 15.874 6.815 15.934 7.164 16.068 7.486 C 16.202 7.809 16.406 8.098 16.666 8.331 C 16.926 8.565 17.234 8.737 17.569 8.836 L 17.967 8.953 C 19.011 9.261 19.011 10.738 17.967 11.046 L 17.568 11.163 C 17.233 11.262 16.924 11.434 16.665 11.668 C 16.405 11.902 16.201 12.19 16.067 12.513 C 15.933 12.836 15.874 13.185 15.892 13.533 C 15.911 13.882 16.007 14.223 16.174 14.529 L 16.374 14.893 C 16.893 15.848 15.849 16.893 14.893 16.373 L 14.529 16.174 C 14.223 16.007 13.882 15.911 13.533 15.892 C 13.184 15.874 12.836 15.934 12.513 16.067 C 12.19 16.201 11.901 16.405 11.668 16.665 C 11.434 16.925 11.262 17.234 11.163 17.569 L 11.046 17.967 C 10.738 19.011 9.261 19.011 8.953 17.967 L 8.836 17.568 C 8.737 17.233 8.564 16.925 8.331 16.665 C 8.097 16.405 7.809 16.201 7.486 16.068 C 7.163 15.934 6.815 15.874 6.466 15.893 C 6.117 15.911 5.777 16.007 5.471 16.174 L 5.106 16.374 C 4.151 16.893 3.106 15.849 3.626 14.893 L 3.824 14.529 C 3.992 14.223 4.088 13.882 4.107 13.533 C 4.126 13.184 4.066 12.835 3.933 12.512 C 3.799 12.189 3.595 11.901 3.335 11.667 C 3.075 11.433 2.766 11.261 2.431 11.162 L 2.032 11.044 C 0.988 10.737 0.988 9.259 2.032 8.952 L 2.431 8.834 C 2.765 8.736 3.074 8.563 3.333 8.33 C 3.593 8.096 3.797 7.808 3.93 7.485 C 4.064 7.163 4.124 6.814 4.106 6.466 C 4.087 6.117 3.991 5.777 3.824 5.471 L 3.624 5.106 C 3.106 4.151 4.149 3.106 5.106 3.626 L 5.471 3.824 C 5.777 3.991 6.117 4.088 6.466 4.106 C 6.815 4.125 7.163 4.065 7.486 3.931 C 7.809 3.798 8.097 3.593 8.331 3.334 C 8.564 3.074 8.737 2.766 8.836 2.431 L 8.953 2.032 L 8.953 2.032 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))));
  const __impls = {
    // figma: view=Full, State=Default
    "view=full|state=default": __body0,
    // figma: view=Full, State=Hover
    "view=full|state=hover": __body1,
    // figma: view=Full, State=Focus
    "view=full|state=focus": __body2,
    // figma: view=Full, State=Active
    "view=full|state=active": __body3,
    // figma: view=short, State=Default
    "view=short|state=default": __body4,
    // figma: view=short, State=Hover
    "view=short|state=hover": __body5,
    // figma: view=short, State=Focus
    "view=short|state=focus": __body6,
    // figma: view=short, State=Active
    "view=short|state=active": __body7
  };
  return (__impls[__vkey_ProfileFrame(props)] ?? __body0)();
}

// figma node: 2778:2949 icon / bootstrap / outline & logos / person-bounding-box
function IconBootstrapOutlineLogosPerson3(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 1.5 1 C 1.367 1 1.24 1.053 1.146 1.146 C 1.053 1.24 1 1.367 1 1.5 L 1 4.5 C 1 4.633 0.947 4.76 0.854 4.854 C 0.76 4.947 0.633 5 0.5 5 C 0.367 5 0.24 4.947 0.146 4.854 C 0.053 4.76 0 4.633 0 4.5 L 0 1.5 C 0 1.102 0.158 0.721 0.439 0.439 C 0.721 0.158 1.102 0 1.5 0 L 4.5 0 C 4.633 0 4.76 0.053 4.854 0.146 C 4.947 0.24 5 0.367 5 0.5 C 5 0.633 4.947 0.76 4.854 0.854 C 4.76 0.947 4.633 1 4.5 1 L 1.5 1 Z M 11 0.5 C 11 0.367 11.053 0.24 11.146 0.146 C 11.24 0.053 11.367 0 11.5 0 L 14.5 0 C 14.898 0 15.279 0.158 15.561 0.439 C 15.842 0.721 16 1.102 16 1.5 L 16 4.5 C 16 4.633 15.947 4.76 15.854 4.854 C 15.76 4.947 15.633 5 15.5 5 C 15.367 5 15.24 4.947 15.146 4.854 C 15.053 4.76 15 4.633 15 4.5 L 15 1.5 C 15 1.367 14.947 1.24 14.854 1.146 C 14.76 1.053 14.633 1 14.5 1 L 11.5 1 C 11.367 1 11.24 0.947 11.146 0.854 C 11.053 0.76 11 0.633 11 0.5 L 11 0.5 Z M 0.5 11 C 0.633 11 0.76 11.053 0.854 11.146 C 0.947 11.24 1 11.367 1 11.5 L 1 14.5 C 1 14.633 1.053 14.76 1.146 14.854 C 1.24 14.947 1.367 15 1.5 15 L 4.5 15 C 4.633 15 4.76 15.053 4.854 15.146 C 4.947 15.24 5 15.367 5 15.5 C 5 15.633 4.947 15.76 4.854 15.854 C 4.76 15.947 4.633 16 4.5 16 L 1.5 16 C 1.102 16 0.721 15.842 0.439 15.561 C 0.158 15.279 0 14.898 0 14.5 L 0 11.5 C 0 11.367 0.053 11.24 0.146 11.146 C 0.24 11.053 0.367 11 0.5 11 L 0.5 11 Z M 15.5 11 C 15.633 11 15.76 11.053 15.854 11.146 C 15.947 11.24 16 11.367 16 11.5 L 16 14.5 C 16 14.898 15.842 15.279 15.561 15.561 C 15.279 15.842 14.898 16 14.5 16 L 11.5 16 C 11.367 16 11.24 15.947 11.146 15.854 C 11.053 15.76 11 15.633 11 15.5 C 11 15.367 11.053 15.24 11.146 15.146 C 11.24 15.053 11.367 15 11.5 15 L 14.5 15 C 14.633 15 14.76 14.947 14.854 14.854 C 14.947 14.76 15 14.633 15 14.5 L 15 11.5 C 15 11.367 15.053 11.24 15.146 11.146 C 15.24 11.053 15.367 11 15.5 11 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 10,
    height: 10,
    viewBox: "0 0 10 10",
    fill: "none",
    style: {
      position: "absolute",
      left: 3,
      top: 3,
      width: 10,
      height: 10
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0.833 10 C 0.833 10 0 10 0 9.167 C 0 8.333 0.833 5.833 5 5.833 C 9.167 5.833 10 8.333 10 9.167 C 10 10 9.167 10 9.167 10 L 0.833 10 Z M 7.5 2.5 C 7.5 3.163 7.237 3.799 6.768 4.268 C 6.299 4.737 5.663 5 5 5 C 4.337 5 3.701 4.737 3.232 4.268 C 2.763 3.799 2.5 3.163 2.5 2.5 C 2.5 1.837 2.763 1.201 3.232 0.732 C 3.701 0.263 4.337 0 5 0 C 5.663 0 6.299 0.263 6.768 0.732 C 7.237 1.201 7.5 1.837 7.5 2.5 L 7.5 2.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 3179:3687 roleplay (2 variants)
const __venc_Roleplay = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Roleplay = p => "state=" + __venc_Roleplay(p.state);
function Roleplay(_p = {}) {
  const props = {
    ..._p,
    state: _p.state ?? "default"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1296,
      height: 40,
      overflow: "hidden",
      borderRadius: 4,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPerson3, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexGrow: 1
    }
  }, props.text1 ?? "Специалист")));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1296,
      height: 40,
      overflow: "hidden",
      borderRadius: 4,
      background: "linear-gradient(rgba(19,121,243,0.3),rgba(19,121,243,0.3)), linear-gradient(rgb(1,3,14),rgb(1,3,14))",
      boxShadow: "inset 0 0 0 1px var(--color-2)",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderTop: "1px solid rgb(255,255,255)",
      borderRight: "1px solid rgb(255,255,255)",
      borderBottom: "1px solid rgb(255,255,255)",
      borderLeft: "1px solid rgb(255,255,255)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosPerson3, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexGrow: 1
    }
  }, props.text1 ?? "Специалист")));
  const __impls = {
    // figma: State=Default
    "state=default": __body0,
    // figma: State=hover
    "state=hover": __body1
  };
  return (__impls[__vkey_Roleplay(props)] ?? __body0)();
}

// figma node: 2728:1263 section (2 variants)
const __venc_Section = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Section = p => "property1=" + __venc_Section(p.property1);
function Section(_p = {}) {
  const props = {
    ..._p,
    property1: _p.property1 ?? "content"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 21,
      padding: "20px 20px 20px 20px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 20,
      lineHeight: "28px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Мои заказы"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "4px 5px 4px 5px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 14,
      height: 14,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 1.167,
      top: 1.167,
      width: 11.667,
      height: 11.667,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 11.667,
    height: 11.667,
    viewBox: "0 0 11.667 11.667",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 11.667,
      height: 11.667
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.667 5.833 L 11.167 5.833 C 11.167 8.779 8.779 11.167 5.833 11.167 L 5.833 11.667 L 5.833 12.167 C 9.331 12.167 12.167 9.331 12.167 5.833 L 11.667 5.833 Z M 5.833 11.667 L 5.833 11.167 C 2.888 11.167 0.5 8.779 0.5 5.833 L 0 5.833 L -0.5 5.833 C -0.5 9.331 2.336 12.167 5.833 12.167 L 5.833 11.667 Z M 0 5.833 L 0.5 5.833 C 0.5 2.888 2.888 0.5 5.833 0.5 L 5.833 0 L 5.833 -0.5 C 2.336 -0.5 -0.5 2.336 -0.5 5.833 L 0 5.833 Z M 5.833 0 L 5.833 0.5 C 8.779 0.5 11.167 2.888 11.167 5.833 L 11.667 5.833 L 12.167 5.833 C 12.167 2.336 9.331 -0.5 5.833 -0.5 L 5.833 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3.500,
    height: 3.500,
    viewBox: "0 0 3.500 3.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 4.083,
      top: 4.083,
      width: 3.5,
      height: 3.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3.5 2.25 C 3.776 2.25 4 2.026 4 1.75 C 4 1.474 3.776 1.25 3.5 1.25 L 3.5 1.75 L 3.5 2.25 Z M 0 1.25 C -0.276 1.25 -0.5 1.474 -0.5 1.75 C -0.5 2.026 -0.276 2.25 0 2.25 L 0 1.75 L 0 1.25 Z M 2.25 0 C 2.25 -0.276 2.026 -0.5 1.75 -0.5 C 1.474 -0.5 1.25 -0.276 1.25 0 L 1.75 0 L 2.25 0 Z M 1.25 3.5 C 1.25 3.776 1.474 4 1.75 4 C 2.026 4 2.25 3.776 2.25 3.5 L 1.75 3.5 L 1.25 3.5 Z M 3.5 1.75 L 3.5 1.25 L 1.75 1.25 L 1.75 1.75 L 1.75 2.25 L 3.5 2.25 L 3.5 1.75 Z M 1.75 1.75 L 1.75 1.25 L 0 1.25 L 0 1.75 L 0 2.25 L 1.75 2.25 L 1.75 1.75 Z M 1.75 1.75 L 2.25 1.75 L 2.25 0 L 1.75 0 L 1.25 0 L 1.25 1.75 L 1.75 1.75 Z M 1.75 1.75 L 1.25 1.75 L 1.25 3.5 L 1.75 3.5 L 2.25 3.5 L 2.25 1.75 L 1.75 1.75 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "100%",
      color: "rgb(0,136,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Добавить"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "20px 0px 20px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text3 ?? "«Создание веб-страницы с использованием HTML и CSS»"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "150 000₽")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(181,181,181)",
      flexShrink: 0
    }
  }, "\u0421\u043E\u0437\u0434\u0430\u043D")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "12.11.2002")))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "20px 0px 20px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\xAB\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0432\u0435\u0431 HTML \u0438 CSS\xBB"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "150 000\u20BD")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "var(--text-success-default)",
      flexShrink: 0
    }
  }, "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "12.11.2002")))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "20px 0px 20px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\xAB\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B "), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "150 000\u20BD")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(181,181,181)",
      flexShrink: 0
    }
  }, "\u0421\u043E\u0437\u0434\u0430\u043D")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "12.11.2002"))))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
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
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 21,
      padding: "20px 20px 20px 20px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 20,
      lineHeight: "28px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Мои заказы"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "4px 5px 4px 5px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 14,
      height: 14,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 1.167,
      top: 1.167,
      width: 11.667,
      height: 11.667,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 11.667,
    height: 11.667,
    viewBox: "0 0 11.667 11.667",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 11.667,
      height: 11.667
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 11.667 5.833 L 11.167 5.833 C 11.167 8.779 8.779 11.167 5.833 11.167 L 5.833 11.667 L 5.833 12.167 C 9.331 12.167 12.167 9.331 12.167 5.833 L 11.667 5.833 Z M 5.833 11.667 L 5.833 11.167 C 2.888 11.167 0.5 8.779 0.5 5.833 L 0 5.833 L -0.5 5.833 C -0.5 9.331 2.336 12.167 5.833 12.167 L 5.833 11.667 Z M 0 5.833 L 0.5 5.833 C 0.5 2.888 2.888 0.5 5.833 0.5 L 5.833 0 L 5.833 -0.5 C 2.336 -0.5 -0.5 2.336 -0.5 5.833 L 0 5.833 Z M 5.833 0 L 5.833 0.5 C 8.779 0.5 11.167 2.888 11.167 5.833 L 11.667 5.833 L 12.167 5.833 C 12.167 2.336 9.331 -0.5 5.833 -0.5 L 5.833 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3.500,
    height: 3.500,
    viewBox: "0 0 3.500 3.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 4.083,
      top: 4.083,
      width: 3.5,
      height: 3.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3.5 2.25 C 3.776 2.25 4 2.026 4 1.75 C 4 1.474 3.776 1.25 3.5 1.25 L 3.5 1.75 L 3.5 2.25 Z M 0 1.25 C -0.276 1.25 -0.5 1.474 -0.5 1.75 C -0.5 2.026 -0.276 2.25 0 2.25 L 0 1.75 L 0 1.25 Z M 2.25 0 C 2.25 -0.276 2.026 -0.5 1.75 -0.5 C 1.474 -0.5 1.25 -0.276 1.25 0 L 1.75 0 L 2.25 0 Z M 1.25 3.5 C 1.25 3.776 1.474 4 1.75 4 C 2.026 4 2.25 3.776 2.25 3.5 L 1.75 3.5 L 1.25 3.5 Z M 3.5 1.75 L 3.5 1.25 L 1.75 1.25 L 1.75 1.75 L 1.75 2.25 L 3.5 2.25 L 3.5 1.75 Z M 1.75 1.75 L 1.75 1.25 L 0 1.25 L 0 1.75 L 0 2.25 L 1.75 2.25 L 1.75 1.75 Z M 1.75 1.75 L 2.25 1.75 L 2.25 0 L 1.75 0 L 1.25 0 L 1.25 1.75 L 1.75 1.75 Z M 1.75 1.75 L 1.25 1.75 L 1.25 3.5 L 1.75 3.5 L 2.25 3.5 L 2.25 1.75 L 1.75 1.75 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Manrope, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "100%",
      color: "rgb(0,136,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Добавить"))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "20px 0px 20px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text3 ?? "«Создание веб-страницы с использованием HTML и CSS»"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text4 ?? "150 000₽")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(181,181,181)",
      flexShrink: 0
    }
  }, "\u0421\u043E\u0437\u0434\u0430\u043D")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "12.11.2002")))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "20px 0px 20px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\xAB\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0432\u0435\u0431 HTML \u0438 CSS\xBB"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "150 000\u20BD")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "var(--text-success-default)",
      flexShrink: 0
    }
  }, "\u0412 \u0440\u0430\u0431\u043E\u0442\u0435")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "12.11.2002")))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "20px 0px 20px 0px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "\xAB\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0432\u0435\u0431-\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B "), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "150 000\u20BD")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      lineHeight: "24px",
      color: "rgb(181,181,181)",
      flexShrink: 0
    }
  }, "\u0421\u043E\u0437\u0434\u0430\u043D")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"LINE Seed JP\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "24px",
      color: "rgba(255,255,255,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, "12.11.2002"))))));
  const __impls = {
    // figma: Property 1=content
    "property1=content": __body0,
    // figma: Property 1=Variant2
    "property1=variant2": __body1
  };
  return (__impls[__vkey_Section(props)] ?? __body0)();
}

// figma node: 3195:4537 select (2 variants)
const __venc_Select = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Select = p => "state=" + __venc_Select(p.state);
function Select(_p = {}) {
  const props = {
    ..._p,
    label: _p.label ?? false,
    state: _p.state ?? "default",
    labelTxt: _p.labelTxt ?? "Label"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1296,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, props.label && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      padding: "2px 12px 2px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.labelTxt)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 40,
      borderRadius: 4,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 14,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "16px",
      color: "rgba(159,160,164,0.7)",
      flexGrow: 1
    }
  }, props.text1 ?? "Русский"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1296,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, props.label && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      padding: "2px 12px 2px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 14,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0
    }
  }, props.labelTxt)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 40,
      borderRadius: 4,
      boxShadow: "inset 0 0 0 1px var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexGrow: 1
    }
  }, props.text1 ?? "Русский"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosChevron16, null))));
  const __impls = {
    // figma: State=Default
    "state=default": __body0,
    // figma: State=chosen
    "state=chosen": __body1
  };
  return (__impls[__vkey_Select(props)] ?? __body0)();
}

// figma node: 3149:2657 status
function Status2(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 666,
      backgroundColor: "rgba(0,136,255,0.1)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-xs) * 1px)",
      padding: "4px 8px 4px 8px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "rgb(0,136,255)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgb(0,136,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Текущий"));
}

// figma node: 3149:2645 session (3 variants)
const __venc_Session = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Session = p => "state=" + __venc_Session(p.state);
function Session(_p = {}) {
  const props = {
    ..._p,
    state: _p.state ?? "default"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1244,
      borderRadius: 4,
      backgroundColor: "rgb(1,3,14)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Категория уведомлений"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Описание ")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosX2, null)));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1244,
      borderRadius: 4,
      backgroundColor: "rgb(1,3,14)",
      boxShadow: "inset 0 0 0 1px var(--color-2)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Категория уведомлений"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "Описание ")), /*#__PURE__*/React.createElement(Status2, {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1244,
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: "12px 12px 12px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Удалить аккаунт"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgb(159,160,164)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text2 ?? "Удаление аккаунта необратимо. Все данные будут стёрты.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 40,
      maxWidth: null,
      maxHeight: 40,
      borderRadius: 8,
      backgroundColor: "rgba(255,56,60,0.2)",
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 556,
      fontSize: 16,
      lineHeight: "100%",
      flexShrink: 0
    }
  }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 20,
      height: 20,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 18.75 2.5 C 18.75 2.168 18.618 1.851 18.384 1.616 C 18.149 1.382 17.832 1.25 17.5 1.25 L 2.5 1.25 C 2.168 1.25 1.851 1.382 1.616 1.616 C 1.382 1.851 1.25 2.168 1.25 2.5 L 1.25 17.5 C 1.25 17.832 1.382 18.149 1.616 18.384 C 1.851 18.618 2.168 18.75 2.5 18.75 L 17.5 18.75 C 17.832 18.75 18.149 18.618 18.384 18.384 C 18.618 18.149 18.75 17.832 18.75 17.5 L 18.75 2.5 Z M 0 2.5 C 0 1.837 0.263 1.201 0.732 0.732 C 1.201 0.263 1.837 0 2.5 0 L 17.5 0 C 18.163 0 18.799 0.263 19.268 0.732 C 19.737 1.201 20 1.837 20 2.5 L 20 17.5 C 20 18.163 19.737 18.799 19.268 19.268 C 18.799 19.737 18.163 20 17.5 20 L 2.5 20 C 1.837 20 1.201 19.737 0.732 19.268 C 0.263 18.799 0 18.163 0 17.5 L 0 2.5 Z M 7.318 6.432 C 7.2 6.315 7.041 6.249 6.875 6.249 C 6.709 6.249 6.55 6.315 6.432 6.432 C 6.315 6.55 6.249 6.709 6.249 6.875 C 6.249 7.041 6.315 7.2 6.432 7.318 L 11.554 12.438 L 8.094 12.438 C 7.928 12.438 7.769 12.503 7.652 12.621 C 7.535 12.738 7.469 12.897 7.469 13.063 C 7.469 13.228 7.535 13.387 7.652 13.504 C 7.769 13.622 7.928 13.688 8.094 13.688 L 13.063 13.688 C 13.228 13.688 13.387 13.622 13.504 13.504 C 13.622 13.387 13.688 13.228 13.688 13.063 L 13.688 8.094 C 13.688 7.928 13.622 7.769 13.504 7.652 C 13.387 7.535 13.228 7.469 13.063 7.469 C 12.897 7.469 12.738 7.535 12.621 7.652 C 12.503 7.769 12.438 7.928 12.438 8.094 L 12.438 11.554 L 7.318 6.432 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })))));
  const __impls = {
    // figma: state=Default
    "state=default": __body0,
    // figma: state=active
    "state=active": __body1,
    // figma: state=delete
    "state=delete": __body2
  };
  return (__impls[__vkey_Session(props)] ?? __body0)();
}

// figma node: 2778:3242 icon / bootstrap / outline & logos / shield-lock
function IconBootstrapOutlineLogosShield4(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-primary)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14,
    height: 16,
    viewBox: "0 0 14 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 1,
      top: 0,
      width: 14,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 4.338 1.59 C 3.386 1.852 2.44 2.138 1.501 2.446 C 1.415 2.474 1.339 2.525 1.281 2.594 C 1.223 2.663 1.186 2.747 1.173 2.836 C 0.619 6.993 1.899 10.026 3.426 12.024 C 4.073 12.878 4.843 13.631 5.713 14.257 C 6.059 14.501 6.365 14.677 6.606 14.79 C 6.726 14.847 6.824 14.885 6.899 14.908 C 6.932 14.92 6.966 14.928 7 14.933 C 7.034 14.927 7.067 14.919 7.1 14.908 C 7.176 14.885 7.274 14.847 7.394 14.79 C 7.634 14.677 7.941 14.5 8.287 14.257 C 9.157 13.631 9.927 12.878 10.574 12.024 C 12.101 10.027 13.381 6.993 12.827 2.836 C 12.814 2.747 12.777 2.663 12.719 2.594 C 12.661 2.525 12.585 2.474 12.499 2.446 C 11.848 2.233 10.749 1.886 9.662 1.591 C 8.552 1.29 7.531 1.067 7 1.067 C 6.47 1.067 5.448 1.29 4.338 1.591 L 4.338 1.59 Z M 4.072 0.56 C 5.157 0.265 6.31 0 7 0 C 7.69 0 8.843 0.265 9.928 0.56 C 11.038 0.86 12.157 1.215 12.815 1.43 C 13.09 1.521 13.334 1.687 13.519 1.911 C 13.703 2.134 13.821 2.405 13.859 2.692 C 14.455 7.169 13.072 10.487 11.394 12.682 C 10.682 13.621 9.834 14.448 8.877 15.135 C 8.546 15.373 8.195 15.582 7.829 15.76 C 7.549 15.892 7.248 16 7 16 C 6.752 16 6.452 15.892 6.171 15.76 C 5.805 15.582 5.454 15.373 5.123 15.135 C 4.166 14.448 3.318 13.621 2.606 12.682 C 0.928 10.487 -0.455 7.169 0.141 2.692 C 0.179 2.405 0.297 2.134 0.481 1.911 C 0.666 1.687 0.91 1.521 1.185 1.43 C 2.14 1.117 3.103 0.827 4.072 0.56 L 4.072 0.56 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 3,
    height: 5.499,
    viewBox: "0 0 3 5.499",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.5,
      top: 5.001,
      width: 3,
      height: 5.499
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3 1.499 C 3 1.81 2.904 2.112 2.725 2.366 C 2.546 2.619 2.293 2.811 2 2.914 L 2.385 4.904 C 2.399 4.977 2.397 5.051 2.379 5.123 C 2.36 5.194 2.327 5.261 2.28 5.317 C 2.233 5.374 2.174 5.42 2.107 5.452 C 2.041 5.483 1.968 5.499 1.894 5.499 L 1.106 5.499 C 1.032 5.499 0.96 5.483 0.893 5.451 C 0.827 5.42 0.768 5.374 0.721 5.317 C 0.674 5.26 0.64 5.194 0.622 5.122 C 0.604 5.051 0.602 4.977 0.616 4.904 L 1 2.914 C 0.741 2.823 0.512 2.661 0.338 2.448 C 0.164 2.235 0.052 1.979 0.014 1.706 C -0.024 1.434 0.014 1.156 0.123 0.904 C 0.233 0.652 0.409 0.434 0.634 0.275 C 0.858 0.117 1.122 0.023 1.396 0.004 C 1.671 -0.015 1.945 0.041 2.189 0.168 C 2.433 0.294 2.638 0.485 2.781 0.72 C 2.924 0.955 3 1.224 3 1.499 L 3 1.499 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
}

// figma node: 2862:3696 H/H1/BLOCK
function HH1BLOCK(_p = {}) {
  const props = {
    ..._p,
    counter: _p.counter ?? true,
    icon: _p.icon ?? false
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 300,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "8px 16px 8px 16px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-md) * 1px)",
      paddingTop: "calc(var(--spacing-sm) * 1px)",
      paddingRight: "calc(var(--spacing-md) * 1px)",
      paddingBottom: "calc(var(--spacing-sm) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 500,
      fontSize: 22,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Активные проекты"), props.counter && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 22,
      backgroundColor: "var(--brand-default)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "3px 3px 3px 3px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 16,
      textAlign: "center",
      lineHeight: "100%",
      color: "var(--color-2-2)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "5"))), props.icon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 22,
      height: 22,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosShield4, {
    style: {
      transform: "scale(1.375, 1.375)",
      transformOrigin: "0 0"
    }
  })));
}

// figma node: 3112:2712 Notification
function Notification(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 636,
      overflow: "hidden",
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: "16px 12px 16px 12px",
      alignItems: "flex-start",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      flexGrow: 1
    }
  }, props.text1 ?? "Миграция аналитического дашборда на Next.js 14"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 12,
      textAlign: "right",
      lineHeight: "100%",
      color: "rgba(159,160,164,0.7)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "09:41"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosX2, null))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Manrope\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      color: "rgba(159,160,164,0.6)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, props.text3 ?? "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tincidunt. Can you send the file of Martins UX case study and the link toV wireframe  ? ")));
}

// figma node: 2802:4051 Side bar (4 variants)
const __venc_SideBar = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_SideBar = p => "property1=" + __venc_SideBar(p.property1) + '|' + "noti=" + __venc_SideBar(p.noti);
function SideBar(_p = {}) {
  const props = {
    ..._p,
    property1: _p.property1 ?? "full",
    noti: _p.noti ?? false
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 283,
      height: 982,
      overflow: "hidden",
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      paddingBottom: "calc(var(--spacing-xl) * 1px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-3xl) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 235,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      padding: "0px 12px 0px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 136,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 25.658,
      height: 29,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14.708,
    height: 14.581,
    viewBox: "0 0 14.708 14.581",
    fill: "none",
    style: {
      position: "absolute",
      left: 10.949,
      top: 14.419,
      width: 14.708,
      height: 14.581
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.494,
    height: 28.838,
    viewBox: "0 0 25.494 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 25.494,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 96.747,
      height: 29,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 18.304,
    height: 28.838,
    viewBox: "0 0 18.304 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 18.304,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 25.436 L 7.354 25.436 L 7.354 3.564 L 0 3.564 L 0 0 L 18.304 0 L 18.304 3.564 L 10.949 3.564 L 10.949 25.274 L 18.304 25.274 L 18.304 28.838 L 0 28.838 L 0 25.436 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.658,
    height: 28.838,
    viewBox: "0 0 25.658 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 21.899,
      top: 0,
      width: 25.658,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 3.564 L 1.798 3.564 C 3.105 3.564 3.595 2.916 3.595 1.782 L 3.595 0 L 21.899 0 L 21.899 1.782 C 21.899 3.078 22.553 3.564 23.696 3.564 L 25.658 3.564 L 25.658 10.855 L 22.062 10.855 L 22.062 5.508 C 22.062 4.212 21.409 3.726 20.265 3.726 L 5.72 3.726 C 4.412 3.726 3.922 4.374 3.922 5.508 L 3.922 23.654 C 3.922 24.95 4.576 25.436 5.72 25.436 L 16.669 25.436 C 17.977 25.436 18.467 24.788 18.467 23.654 L 18.467 21.872 L 22.062 21.872 L 22.062 18.307 L 10.949 18.307 L 10.949 14.419 L 25.658 14.419 L 25.658 28.838 L 22.062 28.838 L 22.062 25.274 L 20.265 25.274 C 18.957 25.274 18.467 25.922 18.467 27.056 L 18.467 28.838 L 3.922 28.838 L 3.922 27.056 C 3.922 25.76 3.268 25.274 2.125 25.274 L 0.327 25.274 L 0.327 3.564 L 0 3.564 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 18.140,
    height: 29,
    viewBox: "0 0 18.140 29",
    fill: "none",
    style: {
      position: "absolute",
      left: 52.949,
      top: 0,
      width: 18.14,
      height: 29
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 3.595 0 L 3.595 25.436 L 18.14 25.436 L 18.14 29 L 0 29 L 0 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.494,
    height: 29,
    viewBox: "0 0 25.494 29",
    fill: "none",
    style: {
      position: "absolute",
      left: 71.253,
      top: 0,
      width: 25.494,
      height: 29
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 3.595 0 L 3.595 5.508 C 3.595 6.804 4.249 7.291 5.393 7.291 L 7.354 7.291 L 7.354 12.799 C 7.354 14.095 8.008 14.581 9.152 14.581 L 16.506 14.581 C 17.813 14.581 18.303 13.933 18.303 12.799 L 18.303 7.291 L 20.101 7.291 C 21.409 7.291 21.899 6.642 21.899 5.508 L 21.899 0 L 25.494 0 L 25.494 7.291 L 23.696 7.291 C 22.389 7.291 21.899 7.939 21.899 9.073 L 21.899 14.581 L 20.101 14.581 C 18.794 14.581 18.303 15.229 18.303 16.363 L 18.303 18.145 L 14.708 18.145 L 14.708 29 L 11.113 29 L 11.113 18.145 L 7.354 18.145 L 7.354 16.363 C 7.354 15.067 6.7 14.581 5.556 14.581 L 3.759 14.581 L 3.759 9.073 C 3.759 7.777 3.105 7.291 1.961 7.291 L 0.163 7.291 L 0.163 0 L 0 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 235,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xl) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(ProfileFrame, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    view: "full",
    state: "default"
  }), /*#__PURE__*/React.createElement(Menu, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: false,
    activeTab: "0"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(Massage, {
    style: {
      position: "relative",
      width: 235,
      flexShrink: 0
    },
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13.750,
    height: 15,
    viewBox: "0 0 13.750 15",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 2.5,
      width: 13.75,
      height: 15,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 13.751,
    height: 8.752,
    viewBox: "0 0 13.751 8.752",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.25,
      top: 5.624,
      width: 13.751,
      height: 8.752,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })))))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 126,
      height: 982,
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      paddingBottom: "calc(var(--spacing-xl) * 1px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-3xl) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 85.658,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 12px 0px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 25.658,
      height: 29,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14.708,
    height: 14.581,
    viewBox: "0 0 14.708 14.581",
    fill: "none",
    style: {
      position: "absolute",
      left: 10.949,
      top: 14.419,
      width: 14.708,
      height: 14.581
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.494,
    height: 28.838,
    viewBox: "0 0 25.494 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 25.494,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xl) * 1px)",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(ProfileFrame, {
    style: {
      position: "relative",
      height: 158,
      flexShrink: 0
    },
    view: "short",
    state: "default"
  }), /*#__PURE__*/React.createElement(Menu, {
    style: {
      position: "relative",
      width: 78,
      flexShrink: 0
    },
    shorten: true,
    activeTab: "0"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Massage, {
    style: {
      position: "relative",
      height: 78,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13.750,
    height: 15,
    viewBox: "0 0 13.750 15",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 2.5,
      width: 13.75,
      height: 15,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 13.751,
    height: 8.752,
    viewBox: "0 0 13.751 8.752",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.25,
      top: 5.624,
      width: 13.751,
      height: 8.752,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })))))));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 283,
      height: 982,
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 627,
      height: 982,
      overflow: "hidden",
      backgroundColor: "var(--surface-secondary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      paddingRight: "calc(var(--spacing-lg) * 1px)"
    }
  }, /*#__PURE__*/React.createElement(HH1BLOCK, {
    style: {
      position: "relative",
      width: 234,
      flexShrink: 0,
      alignSelf: "stretch",
      height: "auto"
    },
    text1: "Уведомления",
    text2: "7"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 12.001,
    height: 12.001,
    viewBox: "0 0 12.001 12.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.999,
      top: 1.999,
      width: 12.001,
      height: 12.001,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0.147 0.855 C 0.1 0.808 0.063 0.753 0.038 0.692 C 0.013 0.631 0 0.566 0 0.501 C 0 0.435 0.013 0.37 0.038 0.309 C 0.063 0.248 0.1 0.193 0.147 0.147 C 0.193 0.1 0.248 0.063 0.309 0.038 C 0.37 0.013 0.435 0 0.501 0 C 0.566 0 0.631 0.013 0.692 0.038 C 0.753 0.063 0.808 0.1 0.855 0.147 L 6.001 5.294 L 11.147 0.147 C 11.193 0.1 11.248 0.063 11.309 0.038 C 11.37 0.013 11.435 0 11.501 0 C 11.566 0 11.631 0.013 11.692 0.038 C 11.753 0.063 11.808 0.1 11.855 0.147 C 11.901 0.193 11.938 0.248 11.963 0.309 C 11.988 0.37 12.001 0.435 12.001 0.501 C 12.001 0.566 11.988 0.631 11.963 0.692 C 11.938 0.753 11.901 0.808 11.855 0.855 L 6.708 6.001 L 11.855 11.147 C 11.901 11.193 11.938 11.248 11.963 11.309 C 11.988 11.37 12.001 11.435 12.001 11.501 C 12.001 11.566 11.988 11.631 11.963 11.692 C 11.938 11.753 11.901 11.808 11.855 11.855 C 11.808 11.901 11.753 11.938 11.692 11.963 C 11.631 11.988 11.566 12.001 11.501 12.001 C 11.435 12.001 11.37 11.988 11.309 11.963 C 11.248 11.938 11.193 11.901 11.147 11.855 L 6.001 6.708 L 0.855 11.855 C 0.808 11.901 0.753 11.938 0.692 11.963 C 0.631 11.988 0.566 12.001 0.501 12.001 C 0.435 12.001 0.37 11.988 0.309 11.963 C 0.248 11.938 0.193 11.901 0.147 11.855 C 0.1 11.808 0.063 11.753 0.038 11.692 C 0.013 11.631 0 11.566 0 11.501 C 0 11.435 0.013 11.37 0.038 11.309 C 0.063 11.248 0.1 11.193 0.147 11.147 L 5.294 6.001 L 0.147 0.855 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      paddingRight: "calc(var(--spacing-lg) * 1px)"
    }
  }, /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Добро пожаловать в Gigly",
    text3: "Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Экспертиза всё ещё ждёт вас",
    text2: "11:00",
    text3: "Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Новый проект: Рефакторинг API на Go",
    text2: "13:15",
    text3: "Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Заявка принята! Начинайте работу",
    text2: "14:30",
    text3: "Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 126,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Заявка отклонена",
    text2: "14:30",
    text3: "Клиент выбрал другого специалиста на гиг «Рефакторинг API на Go». Не расстраивайтесь — подходящие задачи появляются регулярно."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 126,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Клиент ждёт результаты",
    text2: "18:00",
    text3: "По проекту «Рефакторинг API на Go» ещё не сдана работа. Уточните статус у клиента или отправьте результат на проверку."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Работа принята, деньги зачислены",
    text2: "16:20",
    text3: "Клиент подтвердил выполнение проекта «Рефакторинг API на Go». Средства переведены на ваш счёт. Ждём вас на следующих проектах!"
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Добро пожаловать в Gigly",
    text3: "Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Экспертиза всё ещё ждёт вас",
    text2: "11:00",
    text3: "Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Новый проект: Рефакторинг API на Go",
    text2: "13:15",
    text3: "Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Заявка принята! Начинайте работу",
    text2: "14:30",
    text3: "Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      paddingBottom: "calc(var(--spacing-xl) * 1px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-3xl) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 235,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      padding: "0px 12px 0px 12px",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 136,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 25.658,
      height: 29,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14.708,
    height: 14.581,
    viewBox: "0 0 14.708 14.581",
    fill: "none",
    style: {
      position: "absolute",
      left: 10.949,
      top: 14.419,
      width: 14.708,
      height: 14.581
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.494,
    height: 28.838,
    viewBox: "0 0 25.494 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 25.494,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 96.747,
      height: 29,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 18.304,
    height: 28.838,
    viewBox: "0 0 18.304 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 18.304,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 25.436 L 7.354 25.436 L 7.354 3.564 L 0 3.564 L 0 0 L 18.304 0 L 18.304 3.564 L 10.949 3.564 L 10.949 25.274 L 18.304 25.274 L 18.304 28.838 L 0 28.838 L 0 25.436 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.658,
    height: 28.838,
    viewBox: "0 0 25.658 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 21.899,
      top: 0,
      width: 25.658,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 3.564 L 1.798 3.564 C 3.105 3.564 3.595 2.916 3.595 1.782 L 3.595 0 L 21.899 0 L 21.899 1.782 C 21.899 3.078 22.553 3.564 23.696 3.564 L 25.658 3.564 L 25.658 10.855 L 22.062 10.855 L 22.062 5.508 C 22.062 4.212 21.409 3.726 20.265 3.726 L 5.72 3.726 C 4.412 3.726 3.922 4.374 3.922 5.508 L 3.922 23.654 C 3.922 24.95 4.576 25.436 5.72 25.436 L 16.669 25.436 C 17.977 25.436 18.467 24.788 18.467 23.654 L 18.467 21.872 L 22.062 21.872 L 22.062 18.307 L 10.949 18.307 L 10.949 14.419 L 25.658 14.419 L 25.658 28.838 L 22.062 28.838 L 22.062 25.274 L 20.265 25.274 C 18.957 25.274 18.467 25.922 18.467 27.056 L 18.467 28.838 L 3.922 28.838 L 3.922 27.056 C 3.922 25.76 3.268 25.274 2.125 25.274 L 0.327 25.274 L 0.327 3.564 L 0 3.564 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 18.140,
    height: 29,
    viewBox: "0 0 18.140 29",
    fill: "none",
    style: {
      position: "absolute",
      left: 52.949,
      top: 0,
      width: 18.14,
      height: 29
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 3.595 0 L 3.595 25.436 L 18.14 25.436 L 18.14 29 L 0 29 L 0 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.494,
    height: 29,
    viewBox: "0 0 25.494 29",
    fill: "none",
    style: {
      position: "absolute",
      left: 71.253,
      top: 0,
      width: 25.494,
      height: 29
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 3.595 0 L 3.595 5.508 C 3.595 6.804 4.249 7.291 5.393 7.291 L 7.354 7.291 L 7.354 12.799 C 7.354 14.095 8.008 14.581 9.152 14.581 L 16.506 14.581 C 17.813 14.581 18.303 13.933 18.303 12.799 L 18.303 7.291 L 20.101 7.291 C 21.409 7.291 21.899 6.642 21.899 5.508 L 21.899 0 L 25.494 0 L 25.494 7.291 L 23.696 7.291 C 22.389 7.291 21.899 7.939 21.899 9.073 L 21.899 14.581 L 20.101 14.581 C 18.794 14.581 18.303 15.229 18.303 16.363 L 18.303 18.145 L 14.708 18.145 L 14.708 29 L 11.113 29 L 11.113 18.145 L 7.354 18.145 L 7.354 16.363 C 7.354 15.067 6.7 14.581 5.556 14.581 L 3.759 14.581 L 3.759 9.073 C 3.759 7.777 3.105 7.291 1.961 7.291 L 0.163 7.291 L 0.163 0 L 0 0 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 235,
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xl) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(ProfileFrame, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    view: "full",
    state: "default"
  }), /*#__PURE__*/React.createElement(Menu, {
    style: {
      position: "relative",
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: false,
    activeTab: "0"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(Massage, {
    style: {
      position: "relative",
      width: 235,
      flexShrink: 0
    },
    shorten: false,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13.750,
    height: 15,
    viewBox: "0 0 13.750 15",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 2.5,
      width: 13.75,
      height: 15,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 13.751,
    height: 8.752,
    viewBox: "0 0 13.751 8.752",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.25,
      top: 5.624,
      width: 13.751,
      height: 8.752,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })))))));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 117,
      height: 982,
      backgroundColor: "var(--surface-primary)",
      position: "relative",
      color: "var(--text-neutral-strong)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 470,
      height: 982,
      overflow: "hidden",
      backgroundColor: "var(--surface-secondary)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Добро пожаловать в Gigly",
    text3: "Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Экспертиза всё ещё ждёт вас",
    text2: "11:00",
    text3: "Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 146,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Новый проект: Рефакторинг API на Go",
    text2: "13:15",
    text3: "Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Заявка принята! Начинайте работу",
    text2: "14:30",
    text3: "Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 126,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Заявка отклонена",
    text2: "14:30",
    text3: "Клиент выбрал другого специалиста на гиг «Рефакторинг API на Go». Не расстраивайтесь — подходящие задачи появляются регулярно."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Клиент ждёт результаты",
    text2: "18:00",
    text3: "По проекту «Рефакторинг API на Go» ещё не сдана работа. Уточните статус у клиента или отправьте результат на проверку."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Работа принята, деньги зачислены",
    text2: "16:20",
    text3: "Клиент подтвердил выполнение проекта «Рефакторинг API на Go». Средства переведены на ваш счёт. Ждём вас на следующих проектах!"
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Добро пожаловать в Gigly",
    text3: "Вы зарегистрированы как специалист. Заполните экспертизу — это увеличит шансы на подходящие проекты."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 128,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Экспертиза всё ещё ждёт вас",
    text2: "11:00",
    text3: "Клиенты смотрят на стек и опыт. Добавьте технологии и проекты, чтобы получать отклики."
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 146,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Новый проект: Рефакторинг API на Go",
    text2: "13:15",
    text3: "Бюджет: 150 000 ₽. Ознакомьтесь с требованиями и оставьте заявку, если проект вам подходит.\r"
  }), /*#__PURE__*/React.createElement(Notification, {
    style: {
      position: "relative",
      height: 144,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    text1: "Заявка принята! Начинайте работу",
    text2: "14:30",
    text3: "Клиент выбрал вас на проект «Рефакторинг API на Go». Свяжитесь с ним в чате, уточните детали и приступайте."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
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
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(HH1BLOCK, {
    style: {
      position: "relative",
      width: 234,
      flexShrink: 0
    },
    text1: "Уведомления",
    text2: "7"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 12.001,
    height: 12.001,
    viewBox: "0 0 12.001 12.001",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.999,
      top: 1.999,
      width: 12.001,
      height: 12.001,
      color: "var(--text-primary)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0.147 0.855 C 0.1 0.808 0.063 0.753 0.038 0.692 C 0.013 0.631 0 0.566 0 0.501 C 0 0.435 0.013 0.37 0.038 0.309 C 0.063 0.248 0.1 0.193 0.147 0.147 C 0.193 0.1 0.248 0.063 0.309 0.038 C 0.37 0.013 0.435 0 0.501 0 C 0.566 0 0.631 0.013 0.692 0.038 C 0.753 0.063 0.808 0.1 0.855 0.147 L 6.001 5.294 L 11.147 0.147 C 11.193 0.1 11.248 0.063 11.309 0.038 C 11.37 0.013 11.435 0 11.501 0 C 11.566 0 11.631 0.013 11.692 0.038 C 11.753 0.063 11.808 0.1 11.855 0.147 C 11.901 0.193 11.938 0.248 11.963 0.309 C 11.988 0.37 12.001 0.435 12.001 0.501 C 12.001 0.566 11.988 0.631 11.963 0.692 C 11.938 0.753 11.901 0.808 11.855 0.855 L 6.708 6.001 L 11.855 11.147 C 11.901 11.193 11.938 11.248 11.963 11.309 C 11.988 11.37 12.001 11.435 12.001 11.501 C 12.001 11.566 11.988 11.631 11.963 11.692 C 11.938 11.753 11.901 11.808 11.855 11.855 C 11.808 11.901 11.753 11.938 11.692 11.963 C 11.631 11.988 11.566 12.001 11.501 12.001 C 11.435 12.001 11.37 11.988 11.309 11.963 C 11.248 11.938 11.193 11.901 11.147 11.855 L 6.001 6.708 L 0.855 11.855 C 0.808 11.901 0.753 11.938 0.692 11.963 C 0.631 11.988 0.566 12.001 0.501 12.001 C 0.435 12.001 0.37 11.988 0.309 11.963 C 0.248 11.938 0.193 11.901 0.147 11.855 C 0.1 11.808 0.063 11.753 0.038 11.692 C 0.013 11.631 0 11.566 0 11.501 C 0 11.435 0.013 11.37 0.038 11.309 C 0.063 11.248 0.1 11.193 0.147 11.147 L 5.294 6.001 L 0.147 0.855 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      paddingBottom: "calc(var(--spacing-xl) * 1px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-3xl) * 1px)",
      alignItems: "flex-start",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 85.658,
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-sm) * 1px)",
      padding: "0px 12px 0px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 25.658,
      height: 29,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 14.708,
    height: 14.581,
    viewBox: "0 0 14.708 14.581",
    fill: "none",
    style: {
      position: "absolute",
      left: 10.949,
      top: 14.419,
      width: 14.708,
      height: 14.581
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 3.726 L 10.949 3.726 L 7.354 3.726 L 7.354 7.291 L 10.949 7.291 L 10.949 14.581 L 14.708 14.581 L 14.708 0 L 0 0 L 0 3.726 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 25.494,
    height: 28.838,
    viewBox: "0 0 25.494 28.838",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 25.494,
      height: 28.838
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 23.696 3.564 C 22.389 3.564 21.899 2.916 21.899 1.782 L 21.899 0 L 3.595 0 L 3.595 1.782 C 3.595 3.078 2.942 3.564 1.798 3.564 L 0 3.564 L 0 25.274 L 1.798 25.274 C 3.105 25.274 3.595 25.922 3.595 27.056 L 3.595 28.838 L 14.545 28.838 L 14.545 27.056 C 14.545 25.76 15.198 25.274 16.342 25.274 L 18.14 25.274 L 18.14 21.709 L 14.545 21.709 L 14.545 23.492 C 14.545 24.788 13.891 25.274 12.747 25.274 L 5.556 25.274 C 4.249 25.274 3.759 24.626 3.759 23.492 L 3.759 5.508 C 3.759 4.212 4.412 3.726 5.556 3.726 L 20.101 3.726 C 21.409 3.726 21.899 4.374 21.899 5.508 L 21.899 11.017 L 25.494 11.017 L 25.494 3.564 L 23.696 3.564 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.686 15.301 8.752 15.46 8.752 15.626 C 8.752 15.792 8.686 15.951 8.569 16.069 C 8.451 16.186 8.292 16.252 8.126 16.252 C 7.96 16.252 7.801 16.186 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 8.752,
    height: 16.252,
    viewBox: "0 0 8.752 16.252",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.874,
      top: 1.874,
      width: 8.752,
      height: 16.252,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8.569 0.184 C 8.627 0.242 8.673 0.311 8.705 0.387 C 8.736 0.463 8.752 0.544 8.752 0.626 C 8.752 0.708 8.736 0.79 8.705 0.866 C 8.673 0.942 8.627 1.011 8.569 1.069 L 1.51 8.126 L 8.569 15.184 C 8.627 15.242 8.673 15.311 8.704 15.387 C 8.736 15.463 8.752 15.544 8.752 15.626 C 8.752 15.708 8.736 15.79 8.704 15.866 C 8.673 15.942 8.627 16.011 8.569 16.069 C 8.511 16.127 8.442 16.173 8.366 16.204 C 8.29 16.236 8.208 16.252 8.126 16.252 C 8.044 16.252 7.963 16.236 7.887 16.204 C 7.811 16.173 7.742 16.127 7.684 16.069 L 0.184 8.569 C 0.125 8.511 0.079 8.442 0.048 8.366 C 0.016 8.29 0 8.208 0 8.126 C 0 8.044 0.016 7.963 0.048 7.887 C 0.079 7.811 0.125 7.742 0.184 7.684 L 7.684 0.184 C 7.742 0.125 7.811 0.079 7.887 0.048 C 7.963 0.016 8.044 0 8.126 0 C 8.208 0 8.29 0.016 8.366 0.048 C 8.442 0.079 8.511 0.125 8.569 0.184 L 8.569 0.184 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "calc(var(--spacing-xl) * 1px)",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(ProfileFrame, {
    style: {
      position: "relative",
      height: 158,
      flexShrink: 0
    },
    view: "short",
    state: "default"
  }), /*#__PURE__*/React.createElement(Menu, {
    style: {
      position: "relative",
      width: 78,
      flexShrink: 0
    },
    shorten: true,
    activeTab: "0"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement(Massage, {
    style: {
      position: "relative",
      height: 78,
      flexShrink: 0,
      alignSelf: "stretch",
      width: "auto"
    },
    shorten: true,
    state: "default"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
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
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 13.750,
    height: 15,
    viewBox: "0 0 13.750 15",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 2.5,
      width: 13.75,
      height: 15,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 12.5 13.125 C 12.5 13.291 12.434 13.45 12.317 13.567 C 12.2 13.684 12.041 13.75 11.875 13.75 L 1.875 13.75 C 1.709 13.75 1.55 13.684 1.433 13.567 C 1.316 13.45 1.25 13.291 1.25 13.125 L 1.25 1.875 C 1.25 1.709 1.316 1.55 1.433 1.433 C 1.55 1.316 1.709 1.25 1.875 1.25 L 11.875 1.25 C 12.041 1.25 12.2 1.316 12.317 1.433 C 12.434 1.55 12.5 1.709 12.5 1.875 L 12.5 4.375 C 12.5 4.541 12.566 4.7 12.683 4.817 C 12.8 4.934 12.959 5 13.125 5 C 13.291 5 13.45 4.934 13.567 4.817 C 13.684 4.7 13.75 4.541 13.75 4.375 L 13.75 1.875 C 13.75 1.378 13.552 0.901 13.201 0.549 C 12.849 0.198 12.372 0 11.875 0 L 1.875 0 C 1.378 0 0.901 0.198 0.549 0.549 C 0.198 0.901 0 1.378 0 1.875 L 0 13.125 C 0 13.622 0.198 14.099 0.549 14.451 C 0.901 14.802 1.378 15 1.875 15 L 11.875 15 C 12.372 15 12.849 14.802 13.201 14.451 C 13.552 14.099 13.75 13.622 13.75 13.125 L 13.75 10.625 C 13.75 10.459 13.684 10.3 13.567 10.183 C 13.45 10.066 13.291 10 13.125 10 C 12.959 10 12.8 10.066 12.683 10.183 C 12.566 10.3 12.5 10.459 12.5 10.625 L 12.5 13.125 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })), /*#__PURE__*/React.createElement("svg", {
    width: 13.751,
    height: 8.752,
    viewBox: "0 0 13.751 8.752",
    fill: "none",
    style: {
      position: "absolute",
      left: 6.25,
      top: 5.624,
      width: 13.751,
      height: 8.752,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 13.568 4.818 C 13.626 4.76 13.672 4.691 13.703 4.615 C 13.735 4.539 13.751 4.458 13.751 4.376 C 13.751 4.294 13.735 4.212 13.703 4.136 C 13.672 4.06 13.626 3.991 13.568 3.933 L 9.818 0.183 C 9.7 0.066 9.541 0 9.375 0 C 9.209 0 9.05 0.066 8.932 0.183 C 8.815 0.301 8.749 0.46 8.749 0.626 C 8.749 0.792 8.815 0.951 8.932 1.068 L 11.616 3.751 L 0.625 3.751 C 0.459 3.751 0.3 3.817 0.183 3.934 C 0.066 4.051 0 4.21 0 4.376 C 0 4.542 0.066 4.701 0.183 4.818 C 0.3 4.935 0.459 5.001 0.625 5.001 L 11.616 5.001 L 8.932 7.683 C 8.815 7.801 8.749 7.96 8.749 8.126 C 8.749 8.292 8.815 8.451 8.932 8.568 C 9.05 8.686 9.209 8.752 9.375 8.752 C 9.541 8.752 9.7 8.686 9.818 8.568 L 13.568 4.818 L 13.568 4.818 Z",
    fill: "currentColor",
    fillRule: "evenodd"
  })))))));
  const __impls = {
    // figma: Property 1=full, noti=no
    "property1=full|noti=false": __body0,
    // figma: Property 1=short, noti=no
    "property1=short|noti=false": __body1,
    // figma: Property 1=full, noti=yes
    "property1=full|noti=true": __body2,
    // figma: Property 1=short, noti=yes
    "property1=short|noti=true": __body3
  };
  return (__impls[__vkey_SideBar(props)] ?? __body0)();
}

// figma node: 3807:6008 switcher (2 variants)
const __venc_Switcher = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Switcher = p => "activeTab=" + __venc_Switcher(p.activeTab);
function Switcher(_p = {}) {
  const props = {
    ..._p,
    activeTab: _p.activeTab ?? "l"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 60,
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-xs) * 1px)",
      padding: "4px 4px 4px 4px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-xs) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-xs) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "var(--surface-tetriary)",
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
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 17.500,
    viewBox: "0 0 17.500 17.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: 1.25,
      width: 17.5,
      height: 17.5,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3.75 1.25 L 3.75 3.75 L 1.25 3.75 L 1.25 1.25 L 3.75 1.25 Z M 5 16.25 L 5 13.75 C 5 13.418 4.868 13.101 4.634 12.866 C 4.399 12.632 4.082 12.5 3.75 12.5 L 1.25 12.5 C 0.918 12.5 0.601 12.632 0.366 12.866 C 0.132 13.101 0 13.418 0 13.75 L 0 16.25 C 0 16.582 0.132 16.899 0.366 17.134 C 0.601 17.368 0.918 17.5 1.25 17.5 L 3.75 17.5 C 4.082 17.5 4.399 17.368 4.634 17.134 C 4.868 16.899 5 16.582 5 16.25 Z M 5 10 L 5 7.5 C 5 7.168 4.868 6.851 4.634 6.616 C 4.399 6.382 4.082 6.25 3.75 6.25 L 1.25 6.25 C 0.918 6.25 0.601 6.382 0.366 6.616 C 0.132 6.851 0 7.168 0 7.5 L 0 10 C 0 10.332 0.132 10.649 0.366 10.884 C 0.601 11.118 0.918 11.25 1.25 11.25 L 3.75 11.25 C 4.082 11.25 4.399 11.118 4.634 10.884 C 4.868 10.649 5 10.332 5 10 Z M 5 3.75 L 5 1.25 C 5 0.918 4.868 0.601 4.634 0.366 C 4.399 0.132 4.082 0 3.75 0 L 1.25 0 C 0.918 0 0.601 0.132 0.366 0.366 C 0.132 0.601 0 0.918 0 1.25 L 0 3.75 C 0 4.082 0.132 4.399 0.366 4.634 C 0.601 4.868 0.918 5 1.25 5 L 3.75 5 C 4.082 5 4.399 4.868 4.634 4.634 C 4.868 4.399 5 4.082 5 3.75 Z M 11.25 16.25 L 11.25 13.75 C 11.25 13.418 11.118 13.101 10.884 12.866 C 10.649 12.632 10.332 12.5 10 12.5 L 7.5 12.5 C 7.168 12.5 6.851 12.632 6.616 12.866 C 6.382 13.101 6.25 13.418 6.25 13.75 L 6.25 16.25 C 6.25 16.582 6.382 16.899 6.616 17.134 C 6.851 17.368 7.168 17.5 7.5 17.5 L 10 17.5 C 10.332 17.5 10.649 17.368 10.884 17.134 C 11.118 16.899 11.25 16.582 11.25 16.25 Z M 11.25 10 L 11.25 7.5 C 11.25 7.168 11.118 6.851 10.884 6.616 C 10.649 6.382 10.332 6.25 10 6.25 L 7.5 6.25 C 7.168 6.25 6.851 6.382 6.616 6.616 C 6.382 6.851 6.25 7.168 6.25 7.5 L 6.25 10 C 6.25 10.332 6.382 10.649 6.616 10.884 C 6.851 11.118 7.168 11.25 7.5 11.25 L 10 11.25 C 10.332 11.25 10.649 11.118 10.884 10.884 C 11.118 10.649 11.25 10.332 11.25 10 Z M 11.25 3.75 L 11.25 1.25 C 11.25 0.918 11.118 0.601 10.884 0.366 C 10.649 0.132 10.332 0 10 0 L 7.5 0 C 7.168 0 6.851 0.132 6.616 0.366 C 6.382 0.601 6.25 0.918 6.25 1.25 L 6.25 3.75 C 6.25 4.082 6.382 4.399 6.616 4.634 C 6.851 4.868 7.168 5 7.5 5 L 10 5 C 10.332 5 10.649 4.868 10.884 4.634 C 11.118 4.399 11.25 4.082 11.25 3.75 Z M 10 1.25 L 10 3.75 L 7.5 3.75 L 7.5 1.25 L 10 1.25 Z M 16.25 1.25 L 16.25 3.75 L 13.75 3.75 L 13.75 1.25 L 16.25 1.25 Z M 3.75 7.5 L 3.75 10 L 1.25 10 L 1.25 7.5 L 3.75 7.5 Z M 10 7.5 L 10 10 L 7.5 10 L 7.5 7.5 L 10 7.5 Z M 16.25 7.5 L 13.75 7.5 L 13.75 10 L 16.25 10 L 16.25 7.5 Z M 3.75 13.75 L 3.75 16.25 L 1.25 16.25 L 1.25 13.75 L 3.75 13.75 Z M 10 13.75 L 10 16.25 L 7.5 16.25 L 7.5 13.75 L 10 13.75 Z M 16.25 13.75 L 16.25 16.25 L 13.75 16.25 L 13.75 13.75 L 16.25 13.75 Z M 13.75 0 C 13.418 0 13.101 0.132 12.866 0.366 C 12.632 0.601 12.5 0.918 12.5 1.25 L 12.5 3.75 C 12.5 4.082 12.632 4.399 12.866 4.634 C 13.101 4.868 13.418 5 13.75 5 L 16.25 5 C 16.582 5 16.899 4.868 17.134 4.634 C 17.368 4.399 17.5 4.082 17.5 3.75 L 17.5 1.25 C 17.5 0.918 17.368 0.601 17.134 0.366 C 16.899 0.132 16.582 0 16.25 0 L 13.75 0 Z M 12.5 7.5 C 12.5 7.168 12.632 6.851 12.866 6.616 C 13.101 6.382 13.418 6.25 13.75 6.25 L 16.25 6.25 C 16.582 6.25 16.899 6.382 17.134 6.616 C 17.368 6.851 17.5 7.168 17.5 7.5 L 17.5 10 C 17.5 10.332 17.368 10.649 17.134 10.884 C 16.899 11.118 16.582 11.25 16.25 11.25 L 13.75 11.25 C 13.418 11.25 13.101 11.118 12.866 10.884 C 12.632 10.649 12.5 10.332 12.5 10 L 12.5 7.5 Z M 13.75 12.5 C 13.418 12.5 13.101 12.632 12.866 12.866 C 12.632 13.101 12.5 13.418 12.5 13.75 L 12.5 16.25 C 12.5 16.582 12.632 16.899 12.866 17.134 C 13.101 17.368 13.418 17.5 13.75 17.5 L 16.25 17.5 C 16.582 17.5 16.899 17.368 17.134 17.134 C 17.368 16.899 17.5 16.582 17.5 16.25 L 17.5 13.75 C 17.5 13.418 17.368 13.101 17.134 12.866 C 16.899 12.632 16.582 12.5 16.25 12.5 L 13.75 12.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
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
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 17.500,
    viewBox: "0 0 17.500 17.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: 1.25,
      width: 17.5,
      height: 17.5,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 1.875 C 0 1.378 0.198 0.901 0.549 0.549 C 0.901 0.198 1.378 0 1.875 0 L 5.625 0 C 6.122 0 6.599 0.198 6.951 0.549 C 7.302 0.901 7.5 1.378 7.5 1.875 L 7.5 5.625 C 7.5 6.122 7.302 6.599 6.951 6.951 C 6.599 7.302 6.122 7.5 5.625 7.5 L 1.875 7.5 C 1.378 7.5 0.901 7.302 0.549 6.951 C 0.198 6.599 0 6.122 0 5.625 L 0 1.875 Z M 1.875 1.25 C 1.709 1.25 1.55 1.316 1.433 1.433 C 1.316 1.55 1.25 1.709 1.25 1.875 L 1.25 5.625 C 1.25 5.791 1.316 5.95 1.433 6.067 C 1.55 6.184 1.709 6.25 1.875 6.25 L 5.625 6.25 C 5.791 6.25 5.95 6.184 6.067 6.067 C 6.184 5.95 6.25 5.791 6.25 5.625 L 6.25 1.875 C 6.25 1.709 6.184 1.55 6.067 1.433 C 5.95 1.316 5.791 1.25 5.625 1.25 L 1.875 1.25 Z M 10 1.875 C 10 1.378 10.198 0.901 10.549 0.549 C 10.901 0.198 11.378 0 11.875 0 L 15.625 0 C 16.122 0 16.599 0.198 16.951 0.549 C 17.302 0.901 17.5 1.378 17.5 1.875 L 17.5 5.625 C 17.5 6.122 17.302 6.599 16.951 6.951 C 16.599 7.302 16.122 7.5 15.625 7.5 L 11.875 7.5 C 11.378 7.5 10.901 7.302 10.549 6.951 C 10.198 6.599 10 6.122 10 5.625 L 10 1.875 Z M 11.875 1.25 C 11.709 1.25 11.55 1.316 11.433 1.433 C 11.316 1.55 11.25 1.709 11.25 1.875 L 11.25 5.625 C 11.25 5.791 11.316 5.95 11.433 6.067 C 11.55 6.184 11.709 6.25 11.875 6.25 L 15.625 6.25 C 15.791 6.25 15.95 6.184 16.067 6.067 C 16.184 5.95 16.25 5.791 16.25 5.625 L 16.25 1.875 C 16.25 1.709 16.184 1.55 16.067 1.433 C 15.95 1.316 15.791 1.25 15.625 1.25 L 11.875 1.25 Z M 0 11.875 C 0 11.378 0.198 10.901 0.549 10.549 C 0.901 10.198 1.378 10 1.875 10 L 5.625 10 C 6.122 10 6.599 10.198 6.951 10.549 C 7.302 10.901 7.5 11.378 7.5 11.875 L 7.5 15.625 C 7.5 16.122 7.302 16.599 6.951 16.951 C 6.599 17.302 6.122 17.5 5.625 17.5 L 1.875 17.5 C 1.378 17.5 0.901 17.302 0.549 16.951 C 0.198 16.599 0 16.122 0 15.625 L 0 11.875 Z M 1.875 11.25 C 1.709 11.25 1.55 11.316 1.433 11.433 C 1.316 11.55 1.25 11.709 1.25 11.875 L 1.25 15.625 C 1.25 15.791 1.316 15.95 1.433 16.067 C 1.55 16.184 1.709 16.25 1.875 16.25 L 5.625 16.25 C 5.791 16.25 5.95 16.184 6.067 16.067 C 6.184 15.95 6.25 15.791 6.25 15.625 L 6.25 11.875 C 6.25 11.709 6.184 11.55 6.067 11.433 C 5.95 11.316 5.791 11.25 5.625 11.25 L 1.875 11.25 Z M 10 11.875 C 10 11.378 10.198 10.901 10.549 10.549 C 10.901 10.198 11.378 10 11.875 10 L 15.625 10 C 16.122 10 16.599 10.198 16.951 10.549 C 17.302 10.901 17.5 11.378 17.5 11.875 L 17.5 15.625 C 17.5 16.122 17.302 16.599 16.951 16.951 C 16.599 17.302 16.122 17.5 15.625 17.5 L 11.875 17.5 C 11.378 17.5 10.901 17.302 10.549 16.951 C 10.198 16.599 10 16.122 10 15.625 L 10 11.875 Z M 11.875 11.25 C 11.709 11.25 11.55 11.316 11.433 11.433 C 11.316 11.55 11.25 11.709 11.25 11.875 L 11.25 15.625 C 11.25 15.791 11.316 15.95 11.433 16.067 C 11.55 16.184 11.709 16.25 11.875 16.25 L 15.625 16.25 C 15.791 16.25 15.95 16.184 16.067 16.067 C 16.184 15.95 16.25 15.791 16.25 15.625 L 16.25 11.875 C 16.25 11.709 16.184 11.55 16.067 11.433 C 15.95 11.316 15.791 11.25 15.625 11.25 L 11.875 11.25 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 60,
      borderRadius: 8,
      backgroundColor: "var(--surface-secondary)",
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-xs) * 1px)",
      padding: "4px 4px 4px 4px",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-xs) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-xs) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
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
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 17.500,
    viewBox: "0 0 17.500 17.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: 1.25,
      width: 17.5,
      height: 17.5,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 3.75 1.25 L 3.75 3.75 L 1.25 3.75 L 1.25 1.25 L 3.75 1.25 Z M 5 16.25 L 5 13.75 C 5 13.418 4.868 13.101 4.634 12.866 C 4.399 12.632 4.082 12.5 3.75 12.5 L 1.25 12.5 C 0.918 12.5 0.601 12.632 0.366 12.866 C 0.132 13.101 0 13.418 0 13.75 L 0 16.25 C 0 16.582 0.132 16.899 0.366 17.134 C 0.601 17.368 0.918 17.5 1.25 17.5 L 3.75 17.5 C 4.082 17.5 4.399 17.368 4.634 17.134 C 4.868 16.899 5 16.582 5 16.25 Z M 5 10 L 5 7.5 C 5 7.168 4.868 6.851 4.634 6.616 C 4.399 6.382 4.082 6.25 3.75 6.25 L 1.25 6.25 C 0.918 6.25 0.601 6.382 0.366 6.616 C 0.132 6.851 0 7.168 0 7.5 L 0 10 C 0 10.332 0.132 10.649 0.366 10.884 C 0.601 11.118 0.918 11.25 1.25 11.25 L 3.75 11.25 C 4.082 11.25 4.399 11.118 4.634 10.884 C 4.868 10.649 5 10.332 5 10 Z M 5 3.75 L 5 1.25 C 5 0.918 4.868 0.601 4.634 0.366 C 4.399 0.132 4.082 0 3.75 0 L 1.25 0 C 0.918 0 0.601 0.132 0.366 0.366 C 0.132 0.601 0 0.918 0 1.25 L 0 3.75 C 0 4.082 0.132 4.399 0.366 4.634 C 0.601 4.868 0.918 5 1.25 5 L 3.75 5 C 4.082 5 4.399 4.868 4.634 4.634 C 4.868 4.399 5 4.082 5 3.75 Z M 11.25 16.25 L 11.25 13.75 C 11.25 13.418 11.118 13.101 10.884 12.866 C 10.649 12.632 10.332 12.5 10 12.5 L 7.5 12.5 C 7.168 12.5 6.851 12.632 6.616 12.866 C 6.382 13.101 6.25 13.418 6.25 13.75 L 6.25 16.25 C 6.25 16.582 6.382 16.899 6.616 17.134 C 6.851 17.368 7.168 17.5 7.5 17.5 L 10 17.5 C 10.332 17.5 10.649 17.368 10.884 17.134 C 11.118 16.899 11.25 16.582 11.25 16.25 Z M 11.25 10 L 11.25 7.5 C 11.25 7.168 11.118 6.851 10.884 6.616 C 10.649 6.382 10.332 6.25 10 6.25 L 7.5 6.25 C 7.168 6.25 6.851 6.382 6.616 6.616 C 6.382 6.851 6.25 7.168 6.25 7.5 L 6.25 10 C 6.25 10.332 6.382 10.649 6.616 10.884 C 6.851 11.118 7.168 11.25 7.5 11.25 L 10 11.25 C 10.332 11.25 10.649 11.118 10.884 10.884 C 11.118 10.649 11.25 10.332 11.25 10 Z M 11.25 3.75 L 11.25 1.25 C 11.25 0.918 11.118 0.601 10.884 0.366 C 10.649 0.132 10.332 0 10 0 L 7.5 0 C 7.168 0 6.851 0.132 6.616 0.366 C 6.382 0.601 6.25 0.918 6.25 1.25 L 6.25 3.75 C 6.25 4.082 6.382 4.399 6.616 4.634 C 6.851 4.868 7.168 5 7.5 5 L 10 5 C 10.332 5 10.649 4.868 10.884 4.634 C 11.118 4.399 11.25 4.082 11.25 3.75 Z M 10 1.25 L 10 3.75 L 7.5 3.75 L 7.5 1.25 L 10 1.25 Z M 16.25 1.25 L 16.25 3.75 L 13.75 3.75 L 13.75 1.25 L 16.25 1.25 Z M 3.75 7.5 L 3.75 10 L 1.25 10 L 1.25 7.5 L 3.75 7.5 Z M 10 7.5 L 10 10 L 7.5 10 L 7.5 7.5 L 10 7.5 Z M 16.25 7.5 L 13.75 7.5 L 13.75 10 L 16.25 10 L 16.25 7.5 Z M 3.75 13.75 L 3.75 16.25 L 1.25 16.25 L 1.25 13.75 L 3.75 13.75 Z M 10 13.75 L 10 16.25 L 7.5 16.25 L 7.5 13.75 L 10 13.75 Z M 16.25 13.75 L 16.25 16.25 L 13.75 16.25 L 13.75 13.75 L 16.25 13.75 Z M 13.75 0 C 13.418 0 13.101 0.132 12.866 0.366 C 12.632 0.601 12.5 0.918 12.5 1.25 L 12.5 3.75 C 12.5 4.082 12.632 4.399 12.866 4.634 C 13.101 4.868 13.418 5 13.75 5 L 16.25 5 C 16.582 5 16.899 4.868 17.134 4.634 C 17.368 4.399 17.5 4.082 17.5 3.75 L 17.5 1.25 C 17.5 0.918 17.368 0.601 17.134 0.366 C 16.899 0.132 16.582 0 16.25 0 L 13.75 0 Z M 12.5 7.5 C 12.5 7.168 12.632 6.851 12.866 6.616 C 13.101 6.382 13.418 6.25 13.75 6.25 L 16.25 6.25 C 16.582 6.25 16.899 6.382 17.134 6.616 C 17.368 6.851 17.5 7.168 17.5 7.5 L 17.5 10 C 17.5 10.332 17.368 10.649 17.134 10.884 C 16.899 11.118 16.582 11.25 16.25 11.25 L 13.75 11.25 C 13.418 11.25 13.101 11.118 12.866 10.884 C 12.632 10.649 12.5 10.332 12.5 10 L 12.5 7.5 Z M 13.75 12.5 C 13.418 12.5 13.101 12.632 12.866 12.866 C 12.632 13.101 12.5 13.418 12.5 13.75 L 12.5 16.25 C 12.5 16.582 12.632 16.899 12.866 17.134 C 13.101 17.368 13.418 17.5 13.75 17.5 L 16.25 17.5 C 16.582 17.5 16.899 17.368 17.134 17.134 C 17.368 16.899 17.5 16.582 17.5 16.25 L 17.5 13.75 C 17.5 13.418 17.368 13.101 17.134 12.866 C 16.899 12.632 16.582 12.5 16.25 12.5 L 13.75 12.5 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "var(--surface-tetriary)",
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
      flexGrow: 1,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 20,
      height: 20,
      overflow: "hidden",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 17.500,
    height: 17.500,
    viewBox: "0 0 17.500 17.500",
    fill: "none",
    style: {
      position: "absolute",
      left: 1.25,
      top: 1.25,
      width: 17.5,
      height: 17.5,
      color: "rgb(255,255,255)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 1.875 C 0 1.378 0.198 0.901 0.549 0.549 C 0.901 0.198 1.378 0 1.875 0 L 5.625 0 C 6.122 0 6.599 0.198 6.951 0.549 C 7.302 0.901 7.5 1.378 7.5 1.875 L 7.5 5.625 C 7.5 6.122 7.302 6.599 6.951 6.951 C 6.599 7.302 6.122 7.5 5.625 7.5 L 1.875 7.5 C 1.378 7.5 0.901 7.302 0.549 6.951 C 0.198 6.599 0 6.122 0 5.625 L 0 1.875 Z M 1.875 1.25 C 1.709 1.25 1.55 1.316 1.433 1.433 C 1.316 1.55 1.25 1.709 1.25 1.875 L 1.25 5.625 C 1.25 5.791 1.316 5.95 1.433 6.067 C 1.55 6.184 1.709 6.25 1.875 6.25 L 5.625 6.25 C 5.791 6.25 5.95 6.184 6.067 6.067 C 6.184 5.95 6.25 5.791 6.25 5.625 L 6.25 1.875 C 6.25 1.709 6.184 1.55 6.067 1.433 C 5.95 1.316 5.791 1.25 5.625 1.25 L 1.875 1.25 Z M 10 1.875 C 10 1.378 10.198 0.901 10.549 0.549 C 10.901 0.198 11.378 0 11.875 0 L 15.625 0 C 16.122 0 16.599 0.198 16.951 0.549 C 17.302 0.901 17.5 1.378 17.5 1.875 L 17.5 5.625 C 17.5 6.122 17.302 6.599 16.951 6.951 C 16.599 7.302 16.122 7.5 15.625 7.5 L 11.875 7.5 C 11.378 7.5 10.901 7.302 10.549 6.951 C 10.198 6.599 10 6.122 10 5.625 L 10 1.875 Z M 11.875 1.25 C 11.709 1.25 11.55 1.316 11.433 1.433 C 11.316 1.55 11.25 1.709 11.25 1.875 L 11.25 5.625 C 11.25 5.791 11.316 5.95 11.433 6.067 C 11.55 6.184 11.709 6.25 11.875 6.25 L 15.625 6.25 C 15.791 6.25 15.95 6.184 16.067 6.067 C 16.184 5.95 16.25 5.791 16.25 5.625 L 16.25 1.875 C 16.25 1.709 16.184 1.55 16.067 1.433 C 15.95 1.316 15.791 1.25 15.625 1.25 L 11.875 1.25 Z M 0 11.875 C 0 11.378 0.198 10.901 0.549 10.549 C 0.901 10.198 1.378 10 1.875 10 L 5.625 10 C 6.122 10 6.599 10.198 6.951 10.549 C 7.302 10.901 7.5 11.378 7.5 11.875 L 7.5 15.625 C 7.5 16.122 7.302 16.599 6.951 16.951 C 6.599 17.302 6.122 17.5 5.625 17.5 L 1.875 17.5 C 1.378 17.5 0.901 17.302 0.549 16.951 C 0.198 16.599 0 16.122 0 15.625 L 0 11.875 Z M 1.875 11.25 C 1.709 11.25 1.55 11.316 1.433 11.433 C 1.316 11.55 1.25 11.709 1.25 11.875 L 1.25 15.625 C 1.25 15.791 1.316 15.95 1.433 16.067 C 1.55 16.184 1.709 16.25 1.875 16.25 L 5.625 16.25 C 5.791 16.25 5.95 16.184 6.067 16.067 C 6.184 15.95 6.25 15.791 6.25 15.625 L 6.25 11.875 C 6.25 11.709 6.184 11.55 6.067 11.433 C 5.95 11.316 5.791 11.25 5.625 11.25 L 1.875 11.25 Z M 10 11.875 C 10 11.378 10.198 10.901 10.549 10.549 C 10.901 10.198 11.378 10 11.875 10 L 15.625 10 C 16.122 10 16.599 10.198 16.951 10.549 C 17.302 10.901 17.5 11.378 17.5 11.875 L 17.5 15.625 C 17.5 16.122 17.302 16.599 16.951 16.951 C 16.599 17.302 16.122 17.5 15.625 17.5 L 11.875 17.5 C 11.378 17.5 10.901 17.302 10.549 16.951 C 10.198 16.599 10 16.122 10 15.625 L 10 11.875 Z M 11.875 11.25 C 11.709 11.25 11.55 11.316 11.433 11.433 C 11.316 11.55 11.25 11.709 11.25 11.875 L 11.25 15.625 C 11.25 15.791 11.316 15.95 11.433 16.067 C 11.55 16.184 11.709 16.25 11.875 16.25 L 15.625 16.25 C 15.791 16.25 15.95 16.184 16.067 16.067 C 16.184 15.95 16.25 15.791 16.25 15.625 L 16.25 11.875 C 16.25 11.709 16.184 11.55 16.067 11.433 C 15.95 11.316 15.791 11.25 15.625 11.25 L 11.875 11.25 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })))));
  const __impls = {
    // figma: Active tab=L
    "activeTab=l": __body0,
    // figma: Active tab=R
    "activeTab=r": __body1
  };
  return (__impls[__vkey_Switcher(props)] ?? __body0)();
}

// figma node: 2802:3300 tag (5 variants)
const __venc_Tag = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Tag = p => "color=" + __venc_Tag(p.color) + '|' + "size=" + __venc_Tag(p.size);
function Tag(_p = {}) {
  const props = {
    ..._p,
    color: _p.color ?? "blue",
    size: _p.size ?? "s"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgba(0,136,255,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "var(--color-primary-hover)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "React"));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgba(244,95,177,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "rgb(244,95,177)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "React"));
  const __body2 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgba(12,198,113,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "rgb(12,198,113)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "React"));
  const __body3 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgba(5,201,230,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "rgb(5,201,230)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "React"));
  const __body4 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      backgroundColor: "rgba(242,124,13,0.15)",
      display: "flex",
      flexDirection: "row",
      padding: "4px 12px 4px 12px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      paddingLeft: "calc(var(--spacing-sm2) * 1px)",
      paddingTop: "calc(var(--spacing-xs) * 1px)",
      paddingRight: "calc(var(--spacing-sm2) * 1px)",
      paddingBottom: "calc(var(--spacing-xs) * 1px)",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "Handjet, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 556,
      fontSize: 14,
      lineHeight: "100%",
      letterSpacing: "0.010em",
      color: "rgb(242,124,13)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "React"));
  const __impls = {
    // figma: Color=Blue, Size=S
    "color=blue|size=s": __body0,
    // figma: Color=rose, Size=S
    "color=rose|size=s": __body1,
    // figma: Color=green, Size=S
    "color=green|size=s": __body2,
    // figma: Color=teal, Size=S
    "color=teal|size=s": __body3,
    // figma: Color=orange, Size=S
    "color=orange|size=s": __body4
  };
  return (__impls[__vkey_Tag(props)] ?? __body0)();
}

// figma node: 3138:3082 icon (2 variants)
const __venc_Icon2 = v => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey_Icon2 = p => "property1=" + __venc_Icon2(p.property1) + '|' + "property2=" + __venc_Icon2(p.property2) + '|' + "property3=" + __venc_Icon2(p.property3);
function Icon2(_p = {}) {
  const props = {
    ..._p,
    property1: _p.property1 ?? "bootstrap",
    property2: _p.property2 ?? "outline & logos",
    property3: _p.property3 ?? "check-circle"
  };
  const __body0 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-disabled)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })));
  const __body1 = () => /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--color-2)",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 Z",
    fill: "currentColor",
    fillRule: "nonzero"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 4,
      top: 4,
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "var(--color-2)"
    }
  }));
  const __impls = {
    // figma: Property 1=bootstrap, Property 2=outline & logos, Property 3=circle
    "property1=bootstrap|property2=outline & logos|property3=circle": __body0,
    // figma: Property 1=bootstrap, Property 2=outline & logos, Property 3=check-circle
    "property1=bootstrap|property2=outline & logos|property3=check-circle": __body1
  };
  return (__impls[__vkey_Icon2(props)] ?? __body1)();
}

// figma node: 3138:3148 check field
function CheckField(_p = {}) {
  const props = {
    ..._p,
    list1Txt: _p.list1Txt ?? "list 1 txt",
    list2: _p.list2 ?? true,
    list2Txt: _p.list2Txt ?? "list 2 txt"
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 1296,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      justifyContent: "center",
      alignItems: "flex-start",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.icon1 ?? /*#__PURE__*/React.createElement(Icon2, {
    property1: "bootstrap",
    property2: "outline & logos",
    property3: "circle"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexGrow: 1
    }
  }, props.list1Txt)), props.list2 && /*#__PURE__*/React.createElement("div", {
    style: {
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
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 16,
      height: 16,
      flexShrink: 0
    }
  }, props.icon2 ?? /*#__PURE__*/React.createElement(Icon2, {
    property1: "bootstrap",
    property2: "outline & logos",
    property3: "check-circle"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 500,
      fontSize: 16,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "16px",
      color: "rgb(255,255,255)",
      flexGrow: 1
    }
  }, props.list2Txt)));
}

// figma node: 3179:3997 counter
function Counter(_p = {}) {
  const props = {
    ..._p,
    points: _p.points ?? ""
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 360,
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 8,
      borderRadius: 2,
      backgroundColor: "var(--color-2)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 6,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.3)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 6,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.3)",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  })));
}

// figma node: 3600:5262 file
function File(_p = {}) {
  const props = _p;
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: "fit-content",
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 24,
      height: 24,
      flexShrink: 0
    }
  }, props.iconType ?? /*#__PURE__*/React.createElement(IconBootstrapOutlineLogosFile21, {
    style: {
      transform: "scale(1.500, 1.500)",
      transformOrigin: "0 0"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      justifyContent: "center",
      alignItems: "flex-start",
      flexShrink: 0,
      alignSelf: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 11,
      lineHeight: "100%",
      color: "rgb(255,255,255)",
      textDecoration: "underline",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "ТЗ.doc"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"IBM Plex Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "16px",
      letterSpacing: "-0.010em",
      color: "rgb(255,255,255)",
      flexShrink: 0,
      whiteSpace: "nowrap"
    }
  }, props.text2 ?? "15 MB")));
}

// figma node: 2952:2823 H/H2/ЗАДАЧА
function HH2(_p = {}) {
  const props = {
    ..._p,
    counter: _p.counter ?? true,
    icon: _p.icon ?? false
  };
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: {
      width: 653,
      display: "flex",
      flexDirection: "row",
      gap: 10,
      padding: "6px 12px 6px 12px",
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative",
      ...props.style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: "\"Handjet\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      fontWeight: 400,
      fontSize: 18,
      lineHeight: "100%",
      color: "var(--color-2-2)",
      flexShrink: 0,
      alignSelf: "stretch",
      whiteSpace: "nowrap"
    }
  }, props.text1 ?? "Задача"));
}

// Globals for scripts loaded after this file.
window.Component = Component;
window.Icon = Icon;
window.IconBootstrapOutlineLogosPatch = IconBootstrapOutlineLogosPatch;
window.Bio = Bio;
window.IconBootstrapOutlineLogosArrow18 = IconBootstrapOutlineLogosArrow18;
window.Button = Button;
window.GigFull4 = GigFull4;
window.CategoryBlueXS = CategoryBlueXS;
window.StatusSPECIALISTXS = StatusSPECIALISTXS;
window.GigSPECIALISTAttentionBlock = GigSPECIALISTAttentionBlock;
window.IconBootstrapOutlineLogosPencil = IconBootstrapOutlineLogosPencil;
window.MessageAttentionBlock = MessageAttentionBlock;
window.AttentionCard = AttentionCard;
window.Bag = Bag;
window.ButtonDefault = ButtonDefault;
window.IconBootstrapOutlineLogosJournals = IconBootstrapOutlineLogosJournals;
window.ButtonIcon = ButtonIcon;
window.Category = Category;
window.Component4 = Component4;
window.Component5 = Component5;
window.DropdownItem = DropdownItem;
window.Dropdown = Dropdown;
window.IconBootstrapOutlineLogosChevron16 = IconBootstrapOutlineLogosChevron16;
window.IconBootstrapOutlineLogosFilter2 = IconBootstrapOutlineLogosFilter2;
window.Filter = Filter;
window.Status = Status;
window.TagBlueXS = TagBlueXS;
window.Gig = Gig;
window.IconBootstrapOutlineLogosFile21 = IconBootstrapOutlineLogosFile21;
window.H3 = H3;
window.IconBootstrapOutlineLogosSearch = IconBootstrapOutlineLogosSearch;
window.IconBootstrapOutlineLogosX2 = IconBootstrapOutlineLogosX2;
window.InputField = InputField;
window.SearchFilters = SearchFilters;
window.SwitchBar = SwitchBar;
window.Switcher2 = Switcher2;
window.HEADER = HEADER;
window.Logomark = Logomark;
window.IconBootstrapOutlineLogosQuestion6 = IconBootstrapOutlineLogosQuestion6;
window.Massage = Massage;
window.Menupage = Menupage;
window.Menu = Menu;
window.BioMessageCOMPANY = BioMessageCOMPANY;
window.Message = Message;
window.ProfileFrame = ProfileFrame;
window.IconBootstrapOutlineLogosPerson3 = IconBootstrapOutlineLogosPerson3;
window.Roleplay = Roleplay;
window.Section = Section;
window.Select = Select;
window.Status2 = Status2;
window.Session = Session;
window.IconBootstrapOutlineLogosShield4 = IconBootstrapOutlineLogosShield4;
window.HH1BLOCK = HH1BLOCK;
window.Notification = Notification;
window.SideBar = SideBar;
window.Switcher = Switcher;
window.Tag = Tag;
window.Icon2 = Icon2;
window.CheckField = CheckField;
window.Counter = Counter;
window.File = File;
window.HH2 = HH2;