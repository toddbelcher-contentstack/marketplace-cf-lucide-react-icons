import ContentstackAppSDK, { PluginBuilder } from "@contentstack/app-sdk";
import React from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { IconPickerGrid } from "./rte-icon-picker";
import { createRoot } from "react-dom/client";

const ELEMENT_TYPE = "lucide-icon";

const LucideIconPlugin = new PluginBuilder(ELEMENT_TYPE)
  .title("Insert Icon")
  .icon(<DynamicIcon name="smile" size={16} />)
  .display("toolbar")
  .elementType(["inline", "void"])
  .render((_element: React.ReactElement, attrs: { [key: string]: any }) => {
    const iconName = attrs?.["icon-name"];
    if (!iconName) return <span />;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          verticalAlign: "middle",
        }}
        contentEditable={false}
      >
        <DynamicIcon name={iconName as IconName} size={18} />
      </span>
    );
  })
  .on("exec", (rte) => {
    let modalRoot: HTMLDivElement | null = null;
    let root: ReturnType<typeof createRoot> | null = null;

    const cleanup = () => {
      if (root) {
        root.unmount();
        root = null;
      }
      if (modalRoot) {
        modalRoot.remove();
        modalRoot = null;
      }
    };

    const handleSelect = (name: string) => {
      rte.insertNode(
        {
          type: ELEMENT_TYPE,
          attrs: { "icon-name": name },
          children: [{ text: "" }],
        } as any,
        {}
      );
      cleanup();
    };

    modalRoot = document.createElement("div");
    Object.assign(modalRoot.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      zIndex: "10000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.4)",
    });

    const modalContent = document.createElement("div");
    Object.assign(modalContent.style, {
      background: "white",
      borderRadius: "8px",
      width: "700px",
      maxHeight: "80vh",
      overflow: "auto",
      padding: "1rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    });

    modalRoot.appendChild(modalContent);
    modalRoot.addEventListener("click", (e) => {
      if (e.target === modalRoot) cleanup();
    });

    document.body.appendChild(modalRoot);

    root = createRoot(modalContent);
    root.render(<IconPickerGrid onSelect={handleSelect} />);
  })
  .build();

export default ContentstackAppSDK.registerRTEPlugins(LucideIconPlugin);
