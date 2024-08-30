import useDatabaseStore from "@hooks/databaseStore";
import useEditorStore from "@hooks/editorStore";
import { ActionIcon, Tabs } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import EditorBody from "./Body/EditorBody";
import EditorTab from "./EditorTab";
import ZeroTabs from "./ZeroTabs";

export default function Editor() {
  const { fetchAll } = useDatabaseStore();

  const { addTab, tabs, getTabCount, activeTab, setActiveTab } =
    useEditorStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAddTab = () => {
    // todo: script or text
    addTab();
  };

  if (getTabCount() == 0) {
    return <ZeroTabs onNewTab={handleAddTab} />;
  }

  return (
    <Tabs value={activeTab} onChange={(t) => t && setActiveTab(t)}>
      {/* <ScrollArea scrollbarSize={0} style={{ width: "100%", display: "flex" }}> */}
      <Tabs.List
        className="editor-tab-list"
        style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}
      >
        {Object.entries(tabs).map(([id, store], index) => (
          <EditorTab key={id} index={index} store={store} id={id} />
        ))}
        <ActionIcon variant="transparent" onClick={handleAddTab}>
          <IconPlus size={20} stroke={1} />
        </ActionIcon>
      </Tabs.List>
      {/* </ScrollArea> */}

      {Object.entries(tabs).map(([id, store]) => (
        <Tabs.Panel key={id} value={id}>
          <EditorBody store={store} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
