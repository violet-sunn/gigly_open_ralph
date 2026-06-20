import { Filter } from './Filter.jsx';
import { InputField } from './InputField.jsx';

// figma node: 2999:4376 search + filters
export function SearchFilters(_p = {}) {
  const props = { ..._p, filters: _p.filters ?? true };
  return (
    <div className={props.className} style={{
      width: 1149,
      maxWidth: null,
      maxHeight: 40,
      display: "flex",
      flexDirection: "row",
      gap: "calc(var(--spacing-md) * 1px)",
      alignItems: "center",
      position: "relative",
      ...props.style,
    }}>
      <InputField
        style={{
          position: "relative",
          flexGrow: 1,
          alignSelf: "stretch",
          width: "auto",
          height: "auto",
        }}
        iconR={false}
        text={"Поиск чего угодно..."}
        state={"default"}
      />
      {props.filters && (
      <div style={{
        position: "relative",
        maxWidth: null,
        maxHeight: 40,
        display: "flex",
        flexDirection: "row",
        gap: "calc(var(--spacing-sm) * 1px)",
        alignItems: "flex-start",
        flexShrink: 0,
        alignSelf: "stretch",
      }}>
        <Filter
          style={{
            position: "relative",
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}
          state={"default"}
          expand={false}
          selected={false}
        />
        <Filter
          style={{
            position: "relative",
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}
          state={"default"}
          expand={false}
          selected={false}
        />
        <Filter
          style={{
            position: "relative",
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}
          state={"default"}
          expand={false}
          selected={false}
        />
        <Filter
          style={{
            position: "relative",
            flexShrink: 0,
            alignSelf: "stretch",
            height: "auto",
          }}
          state={"default"}
          expand={false}
          selected={false}
        />
      </div>
      )}
    </div>
  );
}
export default SearchFilters;
