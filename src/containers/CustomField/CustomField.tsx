import { useCallback, useEffect, useMemo, useState } from "react";
import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic";
import { useCustomField } from "../../common/hooks/useCustomField";
import { useAppLocation } from "../../common/hooks/useAppLocation";
import "./CustomField.css";

const ICONS_PER_PAGE = 100;
const allIconNames = Array.from(iconNames) as IconName[];

interface FieldData {
  name: string;
}

const CustomFieldExtension = () => {
  const { customField, setFieldData, loading } = useCustomField();
  const { location } = useAppLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [localData, setLocalData] = useState<FieldData | null>(null);

  // Use SDK data when available, fall back to local state for dev mode
  const isDevMode = !location;
  const fieldData = isDevMode ? localData : (customField as FieldData | null);
  const selectedIcon = fieldData?.name ?? null;

  const handleSetFieldData = useCallback(
    (data: FieldData | null) => {
      if (isDevMode) {
        setLocalData(data);
      } else {
        setFieldData(data);
      }
    },
    [isDevMode, setFieldData]
  );

  useEffect(() => {
    if (location && "enableAutoResizing" in location) {
      (location as any).enableAutoResizing();
    }
  }, [location]);

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
      handleSetFieldData({ name });
    },
    [handleSetFieldData]
  );

  const handleClear = useCallback(() => {
    handleSetFieldData(null);
  }, [handleSetFieldData]);

  return (
    <div className="icon-picker">
      <div className="icon-picker-topbar">
        <div className="icon-picker-selected">
          {selectedIcon ? (
            <>
              <DynamicIcon name={selectedIcon as IconName} size={24} />
              <span className="icon-picker-selected-name">{selectedIcon}</span>
              <button
                className="icon-picker-clear"
                onClick={handleClear}
                type="button"
              >
                Clear
              </button>
            </>
          ) : (
            <span className="icon-picker-no-selection">No icon selected</span>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default CustomFieldExtension;
