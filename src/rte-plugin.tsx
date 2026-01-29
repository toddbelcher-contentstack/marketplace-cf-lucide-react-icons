import React, { useState, useCallback } from "react";
import ContentstackSDK from "@contentstack/app-sdk";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { IconPickerGrid } from "./rte-icon-picker";

const ELEMENT_TYPE = "lucide-icon";

const IconPickerModal = ({
  onSelect,
}: {
  onSelect: (name: string) => void;
}) => {
  return (
    <div style={{ padding: "1rem", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <IconPickerGrid onSelect={onSelect} />
    </div>
  );
};

const InlineIcon = ({ attrs }: { attrs: Record<string, string> }) => {
  const iconName = attrs?.["icon-name"];
  if (!iconName) return null;
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}
      contentEditable={false}
    >
      <DynamicIcon name={iconName as IconName} size={18} />
    </span>
  );
};

export default ContentstackSDK.init().then((sdk: any) => {
  const RTE = sdk.location?.RTEPlugin;
  if (!RTE) return;

  const plugin = RTE(ELEMENT_TYPE, () => ({
    title: "Insert Icon",
    icon: "insert-icon",
    display: ["toolbar"],
    elementType: ["inline", "void"],
    render: (props: any) => {
      const { attrs } = props;
      return <InlineIcon attrs={attrs} />;
    },
  }));

  plugin.on("exec", (rte: any) => {
    let modalRoot: HTMLDivElement | null = null;

    const cleanup = () => {
      if (modalRoot) {
        const ReactDOM = require("react-dom");
        ReactDOM.unmountComponentAtNode(modalRoot);
        modalRoot.remove();
        modalRoot = null;
      }
    };

    const handleSelect = (name: string) => {
      rte.insertNode({
        type: ELEMENT_TYPE,
        attrs: { "icon-name": name },
        children: [{ text: "" }],
      });
      cleanup();
    };

    // Create modal overlay
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
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    });

    modalRoot.appendChild(modalContent);
    modalRoot.addEventListener("click", (e) => {
      if (e.target === modalRoot) cleanup();
    });

    document.body.appendChild(modalRoot);

    const ReactDOM = require("react-dom");
    ReactDOM.render(
      <IconPickerModal onSelect={handleSelect} />,
      modalContent
    );
  });

  return plugin;
});
