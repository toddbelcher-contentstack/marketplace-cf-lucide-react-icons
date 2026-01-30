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
  .render((arg0: any, arg1: any, arg2: any, arg3: any) => {
    // Log all args to find where attrs live
    try {
      console.log("[lucide-icon] arg0 type", typeof arg0, arg0?.type, arg0?.props ? Object.keys(arg0.props) : "no props");
      if (arg0?.props?.element) {
        console.log("[lucide-icon] arg0.props.element", JSON.stringify(arg0.props.element));
      }
      console.log("[lucide-icon] arg1", JSON.stringify(arg1));
      console.log("[lucide-icon] arg2", arg2);
      console.log("[lucide-icon] arg3", arg3 ? "exists" : "undefined");
    } catch (e) {
      console.log("[lucide-icon] log error", e);
    }
    const iconName =
      arg1?.["icon-name"] ||
      arg0?.props?.element?.attrs?.["icon-name"] ||
      arg0?.props?.attrs?.["icon-name"];
    if (!iconName) return <span>[no icon]</span>;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          verticalAlign: "middle",
          border: "1px solid #ccc",
          padding: "2px 4px",
          borderRadius: "3px",
          background: "#f9f9f9",
        }}
        contentEditable={false}
      >
        <DynamicIcon name={iconName as IconName} size={18} />
        <span style={{ marginLeft: "4px", fontSize: "12px" }}>{iconName}</span>
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
      console.log("[lucide-icon] handleSelect called", name);
      console.log("[lucide-icon] savedSelection", savedSelection);
      cleanup();

      // Restore selection so the node is inserted at the cursor position
      if (savedSelection) {
        rte.selection.set(savedSelection);
      }

      const uid = Math.random().toString(36).slice(2, 11);
      const node = {
        uid,
        type: ELEMENT_TYPE,
        attrs: { "icon-name": name, "class-name": "lucide-icon-inline" },
        children: [{ text: "" }],
      };
      console.log("[lucide-icon] inserting node", JSON.stringify(node));

      try {
        // Try using the advanced Slate Transforms API directly
        const editor = rte._adv?.editor;
        const Transforms = rte._adv?.Transforms;
        if (editor && Transforms) {
          console.log("[lucide-icon] using Transforms.insertNodes");
          Transforms.insertNodes(editor, node, { select: true });
        } else {
          console.log("[lucide-icon] using rte.insertNode");
          rte.insertNode(node as any, { select: true });
        }
        console.log("[lucide-icon] insert succeeded");
      } catch (err) {
        console.error("[lucide-icon] insert failed", err);
      }
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
