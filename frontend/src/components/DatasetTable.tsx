import type { Row } from "../types/data";

interface Props {
  data: Row[];
}

export default function DatasetTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-5">
        Belum ada dataset.
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-5 overflow-auto">

      <table className="w-full">

        <thead>

          <tr>

            {columns.map((col) => (
              <th
                key={col}
                className="border p-3 bg-gray-100"
              >
                {col}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {data.map((row, index) => (

            <tr key={index}>

              {columns.map((col) => (

                <td
                  key={col}
                  className="border p-3"
                >
                  {(() => {
                    const v = row[col];
                    if (v === null || v === undefined) return '';
                    if (typeof v === 'object') {
                      try {
                        return JSON.stringify(v);
                      } catch {
                        return String(v);
                      }
                    }
                    return String(v);
                  })()}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}