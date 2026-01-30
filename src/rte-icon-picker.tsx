import { useCallback, useEffect, useMemo, useState } from "react";
import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic";

const ICONS_PER_PAGE = 100;
const allIconNames = Array.from(iconNames) as IconName[];

export interface IconPickerGridProps {
  selectedIcon?: string | null;
  onSelect: (name: string) => void;
  /** When true, uses inline styles instead of CSS classes (for RTE plugin context) */
  inline?: boolean;
}

const styles = {
  search: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "0.875rem",
    marginBottom: "0.75rem",
    boxSizing: "border-box" as const,
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
    gap: "4px",
  },
  item: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
    padding: "8px 4px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "none",
    cursor: "pointer",
  },
  itemSelected: {
    background: "#e8e0ff",
    borderColor: "#6c5ce7",
  },
  itemName: {
    fontSize: "0.625rem",
    color: "#666",
    textAlign: "center" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    maxWidth: "100%",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "0.75rem",
    fontSize: "0.8rem",
  },
  pageButton: {
    padding: "0.25rem 0.75rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "white",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
};

export const IconPickerGrid = ({
  selectedIcon,
  onSelect,
  inline,
}: IconPickerGridProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search.trim()) return allIconNames;
    const q = search.toLowerCase();
    return allIconNames.filter((name) => name.includes(q));
  }, [search]);

  const totalPages = Math.ceil(filtered.length / ICONS_PER_PAGE);
  const pageIcons = filtered.slice(
    page * ICONS_PER_PAGE,
    (page + 1) * ICONS_PER_PAGE
  );

  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleSelect = useCallback(
    (name: string) => {
      onSelect(name);
    },
    [onSelect]
  );

  if (inline) {
    return (
      <>
        <input
          style={styles.search}
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={styles.grid}>
          {pageIcons.map((name) => (
            <button
              key={name}
              style={{
                ...styles.item,
                ...(name === selectedIcon ? styles.itemSelected : {}),
              }}
              onClick={() => handleSelect(name)}
              type="button"
              title={name}
            >
              <DynamicIcon name={name} size={20} />
              <span style={styles.itemName}>{name}</span>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.pageButton,
                ...(page === 0 ? { opacity: 0.4, cursor: "not-allowed" } : {}),
              }}
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              type="button"
            >
              Previous
            </button>
            <span>
              Page {page + 1} of {totalPages} ({filtered.length} icons)
            </span>
            <button
              style={{
                ...styles.pageButton,
                ...(page >= totalPages - 1
                  ? { opacity: 0.4, cursor: "not-allowed" }
                  : {}),
              }}
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <input
        className="icon-picker-search"
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="icon-picker-grid">
        {pageIcons.map((name) => (
          <button
            key={name}
            className={`icon-picker-item${name === selectedIcon ? " selected" : ""}`}
            onClick={() => handleSelect(name)}
            type="button"
            title={name}
          >
            <DynamicIcon name={name} size={20} />
            <span className="icon-picker-item-name">{name}</span>
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="icon-picker-pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            type="button"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages} ({filtered.length} icons)
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            type="button"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};
