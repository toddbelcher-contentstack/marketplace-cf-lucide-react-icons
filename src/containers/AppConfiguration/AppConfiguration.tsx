import { useCallback, useEffect, useState } from "react";
import { useAppLocation } from "../../common/hooks/useAppLocation";
import "./AppConfiguration.css";

type IconFormat = "kebab" | "camel" | "pascal" | "json";

const FORMAT_OPTIONS: { value: IconFormat; label: string; example: string }[] = [
  { value: "kebab", label: "kebab-case", example: '"credit-card"' },
  { value: "camel", label: "camelCase", example: '"creditCard"' },
  { value: "pascal", label: "PascalCase", example: '"CreditCard"' },
  { value: "json", label: "JSON", example: '{ "name": "credit-card" }' },
];

const AppConfiguration = () => {
  const { location } = useAppLocation();
  const [iconFormat, setIconFormat] = useState<IconFormat>("kebab");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (location && "getConfig" in location) {
      (location as any).getConfig().then((config: any) => {
        if (config?.iconFormat) {
          setIconFormat(config.iconFormat);
        }
      });
    }
  }, [location]);

  const handleSave = useCallback(async () => {
    if (location && "setConfig" in location) {
      await (location as any).setConfig({ iconFormat });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [location, iconFormat]);

  return (
    <div className="app-configuration">
      <h2>Icon Format</h2>
      <p>Choose how the selected icon name is saved to the custom field.</p>

      <div className="app-configuration-options">
        {FORMAT_OPTIONS.map((opt) => (
          <label key={opt.value} className="app-configuration-option">
            <input
              type="radio"
              name="iconFormat"
              value={opt.value}
              checked={iconFormat === opt.value}
              onChange={() => {
                setIconFormat(opt.value);
                setSaved(false);
              }}
            />
            <div>
              <div className="app-configuration-option-label">{opt.label}</div>
              <div className="app-configuration-option-example">e.g. {opt.example}</div>
            </div>
          </label>
        ))}
      </div>

      <button className="app-configuration-save" onClick={handleSave} type="button">
        Save
      </button>
      {saved && <span className="app-configuration-saved">Saved</span>}
    </div>
  );
};

export default AppConfiguration;
