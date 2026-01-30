import { useCallback, useEffect, useMemo, useState } from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useCustomField } from "../../common/hooks/useCustomField";
import { useAppLocation } from "../../common/hooks/useAppLocation";
import { useAppConfig } from "../../common/hooks/useAppConfig";
import { IconPickerGrid } from "../../rte-icon-picker";
import "../../rte-icon-picker.css";
import "./CustomField.css";

type IconFormat = "kebab" | "camel" | "json";

function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Extract the kebab-case icon name from any stored format */
function parseIconName(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") {
    // Could be kebab or camel — normalize isn't needed for display, just return as-is
    return data;
  }
  if (typeof data === "object" && data !== null && "name" in data) {
    return (data as { name: string }).name;
  }
  return null;
}

function formatValue(kebabName: string, format: IconFormat): unknown {
  switch (format) {
    case "camel":
      return toCamelCase(kebabName);
    case "json":
      return { name: kebabName };
    case "kebab":
    default:
      return kebabName;
  }
}

const CustomFieldExtension = () => {
  const { customField, setFieldData, loading } = useCustomField();
  const { location } = useAppLocation();
  const appConfig = useAppConfig();
  const iconFormat: IconFormat = (appConfig as any)?.iconFormat ?? "kebab";

  const [localData, setLocalData] = useState<unknown>(null);
  const [expanded, setExpanded] = useState(true);

  const isDevMode = !location;
  const fieldData = isDevMode ? localData : customField;
  const selectedIcon = useMemo(() => parseIconName(fieldData), [fieldData]);

  // Collapse picker when an icon is already selected on load
  useEffect(() => {
    if (selectedIcon) {
      setExpanded(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetFieldData = useCallback(
    (data: unknown) => {
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

  const handleSelect = useCallback(
    (name: string) => {
      handleSetFieldData(formatValue(name, iconFormat));
      setExpanded(false);
    },
    [handleSetFieldData, iconFormat]
  );

  const handleClear = useCallback(() => {
    handleSetFieldData(null);
    setExpanded(true);
  }, [handleSetFieldData]);

  const handleChange = useCallback(() => {
    setExpanded(true);
  }, []);

  return (
    <div className="icon-picker">
      {!expanded && selectedIcon ? (
        <div className="icon-picker-compact">
          <DynamicIcon name={selectedIcon as IconName} size={24} />
          <span className="icon-picker-selected-name">{selectedIcon}</span>
          <button className="icon-picker-change" onClick={handleChange} type="button">
            Change
          </button>
          <button className="icon-picker-clear" onClick={handleClear} type="button">
            Clear
          </button>
        </div>
      ) : (
        <>
          <div className="icon-picker-topbar">
            <div className="icon-picker-selected">
              {selectedIcon ? (
                <>
                  <DynamicIcon name={selectedIcon as IconName} size={24} />
                  <span className="icon-picker-selected-name">{selectedIcon}</span>
                  <button className="icon-picker-clear" onClick={handleClear} type="button">
                    Clear
                  </button>
                </>
              ) : (
                <span className="icon-picker-no-selection">No icon selected</span>
              )}
            </div>
          </div>
          <IconPickerGrid selectedIcon={selectedIcon} onSelect={handleSelect} />
        </>
      )}
    </div>
  );
};

export default CustomFieldExtension;
