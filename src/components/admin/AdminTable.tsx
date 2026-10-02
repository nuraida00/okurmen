import styles from './AdminTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface Props<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onPublish?: (row: T) => void;
  publishLabel?: (row: T) => string;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    true: styles.published, false: styles.draft,
    PENDING: styles.pending, CONFIRMED: styles.confirmed,
    PAID: styles.paid, CANCELLED: styles.cancelled, COMPLETED: styles.paid,
  };
  const labelMap: Record<string, string> = {
    true: 'Жарыяланган', false: 'Жашырылган',
    PENDING: 'Жаңы', CONFIRMED: 'Ырасталган',
    PAID: 'Төлөнгөн', CANCELLED: 'Жокко чыгарылган', COMPLETED: 'Аяктаган',
  };
  return (
    <span className={[styles.badge, map[String(status)] ?? styles.draft].join(' ')}>
      {labelMap[String(status)] ?? String(status)}
    </span>
  );
}

export default function AdminTable<T extends { id: string }>({
  columns, data, onEdit, onDelete, onPublish, publishLabel,
}: Props<T>) {
  const hasActions = onEdit || onDelete || onPublish;

  return (
      <div className={styles.wrap}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {columns.map(c => (
                <th key={c.key} className={styles.th} style={c.width ? { width: c.width } : undefined}>{c.header}</th>
              ))}
              {hasActions && <th className={styles.th} style={{ width: 120 }}>Аракеттер</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className={styles.tr}>
                <td className={styles.td} colSpan={columns.length + (hasActions ? 1 : 0)} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-400)' }}>
                  Маалымат жок
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr key={row.id} className={styles.tr}>
                  {columns.map(c => (
                    <td key={c.key} className={styles.td}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        {onPublish && (
                          <button className={`${styles.iconBtn} ${styles.publishBtn}`} onClick={() => onPublish(row)} title={publishLabel?.(row) ?? 'Жарыялоо'}>
                            {publishLabel?.(row) === 'Жашыруу' ? '👁' : '✓'}
                          </button>
                        )}
                        {onEdit && (
                          <button className={`${styles.iconBtn} ${styles.editBtn}`} onClick={() => onEdit(row)} title="Өзгөртүү">✏️</button>
                        )}
                        {onDelete && (
                          <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => onDelete(row)} title="Жок кылуу">🗑</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
