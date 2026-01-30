import { useCallback, useEffect, useState } from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useCustomField } from "../../common/hooks/useCustomField";
import { useAppLocation } from "../../common/hooks/useAppLocation";
import { IconPickerGrid } from "../../rte-icon-picker";
import "../../rte-icon-picker.css";
import "./CustomField.css";

interface FieldData {
  name: string;
}

const CustomFieldExtension = () => {
  const { customField, setFieldData, loading } = useCustomField();
  const { location } = useAppLocation();
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

      <IconPickerGrid selectedIcon={selectedIcon} onSelect={handleSelect} />
    </div>
  );
};

export default CustomFieldExtension;
