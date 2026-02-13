import { useEffect, useRef, useState } from "react";
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
  const [dirty, setDirty] = useState(false);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (location && "getConfig" in location) {
      (location as any).getConfig().then((config: any) => {
        if (config?.iconFormat) {
          setIconFormat(config.iconFormat);
        }
        initialLoad.current = false;
      });
    }
  }, [location]);

  const handleChange = (value: IconFormat) => {
    setIconFormat(value);
    setDirty(true);
    if (location && "setConfig" in location) {
      (location as any).setConfig({ iconFormat: value });
    }
  };

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
              onChange={() => handleChange(opt.value)}
            />
            <div>
              <div className="app-configuration-option-label">{opt.label}</div>
              <div className="app-configuration-option-example">e.g. {opt.example}</div>
            </div>
          </label>
        ))}
      </div>

      {dirty && (
        <p className="app-configuration-hint">
          Click <strong>Save</strong> in the Contentstack toolbar to apply your changes.
        </p>
      )}
    </div>
  );
};

export default AppConfiguration;
