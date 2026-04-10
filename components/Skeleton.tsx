export function SkeletonRow({ cols = 8 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-7 w-32 rounded" />
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-10 w-full rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 10, cols = 8 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <table className="w-full data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}><div className="skeleton h-3 w-16 rounded" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
