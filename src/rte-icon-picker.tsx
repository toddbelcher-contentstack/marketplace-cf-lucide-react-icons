import { useCallback, useEffect, useMemo, useState } from "react";
import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic";
import "./rte-icon-picker.css";

const ICONS_PER_PAGE = 100;
const allIconNames = Array.from(iconNames) as IconName[];

export interface IconPickerGridProps {
  selectedIcon?: string | null;
  onSelect: (name: string) => void;
}

export const IconPickerGrid = ({
  selectedIcon,
  onSelect,
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
