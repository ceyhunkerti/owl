import "@components/Editor/styles.css";
import { IEditorTabState } from "@hooks/editorStore";
import { IMacroFile } from "@ts/interfaces/interfaces";
import { useEffect, useState } from "react";
import {
  PanelGroup,
  PanelResizeHandle,
  Panel as ResizablePanel,
} from "react-resizable-panels";
import { StoreApi, UseBoundStore, useStore } from "zustand";
import MacroCode from "./MacroCode";
import MacroFilePanel from "./MacroFilePanel";

interface IMacroFileProps {
  store: UseBoundStore<StoreApi<IEditorTabState<IMacroFile>>>;
}

const MacroFile: React.FC<IMacroFileProps> = ({ store }) => {
  const { content } = useStore(store, (state) => ({
    content: state.content,
  }));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Script.index");
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <PanelGroup direction="vertical">
        <ResizablePanel defaultSize={60}>
          <div style={{ flex: 1, overflow: "hidden", height: "100%" }}>
            <MacroCode store={store} />
          </div>
        </ResizablePanel>
        <PanelResizeHandle className="panel-resize-handle" />
        <ResizablePanel maxSize={90} minSize={10}>
          <MacroFilePanel store={store} />
        </ResizablePanel>
      </PanelGroup>
    </div>
  );
};

export default MacroFile;
