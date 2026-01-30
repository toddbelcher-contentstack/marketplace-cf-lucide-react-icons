import ContentstackAppSDK, { PluginBuilder } from "@contentstack/app-sdk";
import React from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import ReactDOM from "react-dom";
import { IconPickerGrid } from "./rte-icon-picker";

const ELEMENT_TYPE = "lucide-icon";

const ToolbarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const LucideIconPlugin = new PluginBuilder(ELEMENT_TYPE)
  .title("Insert Icon")
  .icon(<ToolbarIcon />)
  .display(["toolbar"])
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
    // Save the current selection before the modal steals focus
    const savedSelection = rte.selection.get();

    let modalRoot: HTMLDivElement | null = null;
    let modalContent: HTMLDivElement | null = null;

    const cleanup = () => {
      if (modalContent) {
        ReactDOM.unmountComponentAtNode(modalContent);
        modalContent = null;
      }
      if (modalRoot) {
        modalRoot.remove();
        modalRoot = null;
      }
    };

    const handleSelect = (name: string) => {
      cleanup();
      // Restore selection so the node is inserted at the cursor position
      if (savedSelection) {
        rte.selection.set(savedSelection);
      }
      const uid = Math.random().toString(36).slice(2, 11);
      rte.insertNode(
        {
          uid,
          type: ELEMENT_TYPE,
          attrs: { "icon-name": name },
          children: [{ text: "" }],
        } as any,
        { select: true }
      );
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

    modalContent = document.createElement("div");
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

    ReactDOM.render(<IconPickerGrid onSelect={handleSelect} inline />, modalContent);
  })
  .build();

export default ContentstackAppSDK.registerRTEPlugins(LucideIconPlugin);
