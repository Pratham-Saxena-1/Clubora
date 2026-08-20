import { Inbox } from 'lucide-react';

function HostDataTable({ columns, data, emptyMessage, renderRow }) {
  return (
    <div className="host-data-table__wrapper">
      <table className="host-data-table">
        <thead className="host-data-table__head">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="host-data-table__th">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="host-data-table__body">
          {data.length > 0 ? (
            data.map((item, idx) => renderRow(item, idx))
          ) : (
            <tr className="host-data-table__empty-row">
              <td colSpan={columns.length} className="host-data-table__empty-cell">
                <div className="host-data-table__empty">
                  <Inbox className="host-data-table__empty-icon" size={40} strokeWidth={1.2} />
                  <p className="host-data-table__empty-text">
                    {emptyMessage || 'No records found.'}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HostDataTable;
