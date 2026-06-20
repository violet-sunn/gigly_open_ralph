// figma node: 3138:3082 icon (2 variants)
const __venc = (v) => String(v).replace(/[%|=]/g, encodeURIComponent);
const __vkey = (p) => "property1=" + __venc(p.property1) + '|' + "property2=" + __venc(p.property2) + '|' + "property3=" + __venc(p.property3);

export function Icon2(_p = {}) {
  const props = { ..._p, property1: _p.property1 ?? "bootstrap", property2: _p.property2 ?? "outline & logos", property3: _p.property3 ?? "check-circle" };
  const __body0 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--text-disabled)",
      ...props.style,
    }}>
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 16,
        height: 16,
      }}>
        <path d={"M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 L 8 16 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
    </div>
  );
  const __body1 = () => (
    <div className={props.className} style={{
      width: 16,
      height: 16,
      overflow: "hidden",
      position: "relative",
      color: "var(--color-2)",
      ...props.style,
    }}>
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 16,
        height: 16,
      }}>
        <path d={"M 8 15 C 6.143 15 4.363 14.263 3.05 12.95 C 1.737 11.637 1 9.857 1 8 C 1 6.143 1.737 4.363 3.05 3.05 C 4.363 1.737 6.143 1 8 1 C 9.857 1 11.637 1.737 12.95 3.05 C 14.263 4.363 15 6.143 15 8 C 15 9.857 14.263 11.637 12.95 12.95 C 11.637 14.263 9.857 15 8 15 Z M 8 16 C 10.122 16 12.157 15.157 13.657 13.657 C 15.157 12.157 16 10.122 16 8 C 16 5.878 15.157 3.843 13.657 2.343 C 12.157 0.843 10.122 0 8 0 C 5.878 0 3.843 0.843 2.343 2.343 C 0.843 3.843 0 5.878 0 8 C 0 10.122 0.843 12.157 2.343 13.657 C 3.843 15.157 5.878 16 8 16 Z"} fill="currentColor" fillRule="nonzero" />
      </svg>
      <div style={{
        position: "absolute",
        left: 4,
        top: 4,
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--color-2)",
      }} />
    </div>
  );
  const __impls = {
    // figma: Property 1=bootstrap, Property 2=outline & logos, Property 3=circle
    "property1=bootstrap|property2=outline & logos|property3=circle": __body0,
    // figma: Property 1=bootstrap, Property 2=outline & logos, Property 3=check-circle
    "property1=bootstrap|property2=outline & logos|property3=check-circle": __body1,
  };
  return (__impls[__vkey(props)] ?? __body1)();
}
export default Icon2;
