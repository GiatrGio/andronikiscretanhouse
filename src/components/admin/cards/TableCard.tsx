interface Column {
  key: string;
  label: string;
  className?: string;
}

interface TableCardProps {
  title: string;
  columns: Column[];
  data: Record<string, any>[];
}

export default function TableCard({ title, columns, data }: TableCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-6 border-b border-[var(--color-cream-dark)]">
        <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--color-cream)]/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-[var(--color-charcoal)] uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-cream-dark)]">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-[var(--color-cream)]/30 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.className || "text-[var(--color-charcoal)]"
                    }`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
