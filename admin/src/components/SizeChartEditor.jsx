import { useState } from 'react';

// Produces the same shape ProductInfo.jsx on the storefront expects:
// an array of row objects sharing the same keys, e.g.
// [{ Size: "S", Chest: "36", Length: "27" }, { Size: "M", ... }].
const SizeChartEditor = ({ value, onChange }) => {
  const [columns, setColumns] = useState(value?.length ? Object.keys(value[0]) : ['Size', 'Chest', 'Length']);
  const [rows, setRows] = useState(value?.length ? value.map((row) => columns.map((c) => row[c] ?? '')) : []);
  const [newColumn, setNewColumn] = useState('');

  const emit = (nextColumns, nextRows) => {
    const hasData = nextRows.length > 0 && nextColumns.length > 0;
    onChange(hasData ? nextRows.map((row) => Object.fromEntries(nextColumns.map((c, i) => [c, row[i] ?? '']))) : null);
  };

  const addColumn = () => {
    const name = newColumn.trim();
    if (!name || columns.includes(name)) return;
    const nextColumns = [...columns, name];
    const nextRows = rows.map((row) => [...row, '']);
    setColumns(nextColumns);
    setRows(nextRows);
    setNewColumn('');
    emit(nextColumns, nextRows);
  };

  const removeColumn = (idx) => {
    const nextColumns = columns.filter((_, i) => i !== idx);
    const nextRows = rows.map((row) => row.filter((_, i) => i !== idx));
    setColumns(nextColumns);
    setRows(nextRows);
    emit(nextColumns, nextRows);
  };

  const addRow = () => {
    const nextRows = [...rows, columns.map(() => '')];
    setRows(nextRows);
    emit(columns, nextRows);
  };

  const removeRow = (idx) => {
    const nextRows = rows.filter((_, i) => i !== idx);
    setRows(nextRows);
    emit(columns, nextRows);
  };

  const setCell = (rowIdx, colIdx, val) => {
    const nextRows = rows.map((row, i) => (i === rowIdx ? row.map((c, j) => (j === colIdx ? val : c)) : row));
    setRows(nextRows);
    emit(columns, nextRows);
  };

  const inputClass = 'w-full px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-accent-500 outline-none text-xs';

  return (
    <div className='flex flex-col gap-3'>
      {columns.length > 0 && (
        <div className='overflow-x-auto'>
          <table className='text-xs border-collapse'>
            <thead>
              <tr>
                {columns.map((col, colIdx) => (
                  <th key={col} className='px-2 py-1 text-left'>
                    <div className='flex items-center gap-1'>
                      <span>{col}</span>
                      <button type='button' onClick={() => removeColumn(colIdx)} className='text-gray-400 hover:text-red-500'>×</button>
                    </div>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className='px-1 py-1'>
                      <input value={cell} onChange={(e) => setCell(rowIdx, colIdx, e.target.value)} className={inputClass} />
                    </td>
                  ))}
                  <td>
                    <button type='button' onClick={() => removeRow(rowIdx)} className='text-gray-400 hover:text-red-500 px-2'>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className='flex flex-wrap items-center gap-2'>
        <button type='button' onClick={addRow} disabled={columns.length === 0} className='text-xs px-3 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50'>
          + Add Row
        </button>
        <input
          value={newColumn}
          onChange={(e) => setNewColumn(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColumn(); } }}
          placeholder='New column (e.g. Waist)'
          className={`${inputClass} w-40`}
        />
        <button type='button' onClick={addColumn} className='text-xs px-3 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50'>
          + Add Column
        </button>
      </div>
    </div>
  );
};

export default SizeChartEditor;
