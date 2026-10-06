// Lightweight dependency-free bar chart — plain CSS, no charting library.
const MiniBarChart = ({ data, labelKey, valueKey, formatValue = (v) => v }) => {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => {
        const heightPct = Math.max((d[valueKey] / max) * 100, 2);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <p className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {formatValue(d[valueKey])}
            </p>
            <div
              className="w-full rounded-t-lg bg-accent-400 hover:bg-accent-500 transition-colors duration-150"
              style={{ height: `${heightPct}%` }}
            />
            <p className="text-[10px] text-gray-400 truncate w-full text-center">{d[labelKey]}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MiniBarChart;
