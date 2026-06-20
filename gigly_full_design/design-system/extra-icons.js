/* extra-icons.js — supplementary outline icons that the materialized
   Components.bundle.js no longer exposes (grid/chat/folder/shield/logout/
   funnel) plus bell/gear for the sidebar profile controls. Registered as
   window globals so <x-import component-from-global-scope="..."> resolves
   them. Plain JS (no JSX) — React is injected by the DC runtime. */
(function () {
  var R = window.React;
  if (!R) return;
  function svg(children, vb) {
    return function (props) {
      props = props || {};
      var size = props.size || 18;
      return R.createElement('svg', {
        width: size, height: size, viewBox: vb || '0 0 16 16',
        fill: 'none', stroke: 'currentColor', strokeWidth: 1.4,
        strokeLinecap: 'round', strokeLinejoin: 'round', style: props.style,
      }, children.map(function (d, i) {
        if (d.tag) return R.createElement(d.tag, Object.assign({ key: i }, d.attrs));
        return R.createElement('path', { key: i, d: d });
      }));
    };
  }
  var icons = {
    IconBootstrapOutlineLogosGrid2: svg([
      { tag: 'rect', attrs: { x: 2, y: 2, width: 5, height: 5, rx: 1 } },
      { tag: 'rect', attrs: { x: 9, y: 2, width: 5, height: 5, rx: 1 } },
      { tag: 'rect', attrs: { x: 2, y: 9, width: 5, height: 5, rx: 1 } },
      { tag: 'rect', attrs: { x: 9, y: 9, width: 5, height: 5, rx: 1 } },
    ]),
    IconNavSearch: svg([
      { tag: 'circle', attrs: { cx: 7, cy: 7, r: 4.5 } },
      'M10.5 10.5 L14 14',
    ]),
    IconNavGigs: svg([
      { tag: 'rect', attrs: { x: 3.5, y: 2.5, width: 9, height: 11, rx: 1.5 } },
      'M6 6 H10', 'M6 8.5 H10', 'M6 11 H8.5',
    ]),
    IconBootstrapOutlineLogosChat: svg([
      'M2.5 3.5h11a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6.5l-3 2.5V11.5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z',
    ]),
    IconBootstrapOutlineLogosFolder: svg([
      'M2 4.5a1 1 0 0 1 1-1h3l1.5 1.5h5.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z',
    ]),
    IconBootstrapOutlineLogosShield: svg([
      'M8 1.5l5 1.8v3.7c0 3.2-2.1 5.3-5 6.5-2.9-1.2-5-3.3-5-6.5V3.3z',
    ]),
    IconBootstrapOutlineLogosBox14: svg([
      'M6.5 3H3.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3',
      'M10 5l3 3-3 3', 'M13 8H6',
    ]),
    IconBootstrapOutlineLogosFunnel: svg([
      'M2.5 3.5h11l-4.2 5v4l-2.6-1.3v-2.7z',
    ]),
    IconBootstrapOutlineLogosBell: svg([
      'M8 2a3 3 0 0 1 3 3v3.2l1 1.8H4l1-1.8V5a3 3 0 0 1 3-3z',
      'M6.7 12.5a1.4 1.4 0 0 0 2.6 0',
    ]),
    IconBootstrapOutlineLogosGear: svg([
      { tag: 'circle', attrs: { cx: 8, cy: 8, r: 2.2 } },
      'M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7L3.6 3.6',
    ]),
  };
  Object.keys(icons).forEach(function (k) { window[k] = icons[k]; });
})();
