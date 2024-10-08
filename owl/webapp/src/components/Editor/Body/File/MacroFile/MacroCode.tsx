import { StreamLanguage } from "@codemirror/language";
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2";
import { Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import "@components/Editor/styles.css";
import CodeMirror from "@uiw/react-codemirror";
import { debounce } from "lodash";
import { memo, useCallback, useMemo, useRef } from "react";

interface IMacroCodeProps<T extends IFileModel> {
  store: UseBoundStore<StoreApi<IEditorTabState<T>>>;
}

import { useCreateFileModalStore } from "@components/modals/CreateFileModal/useCreateFileModalStore";
import { IEditorTabState } from "@hooks/editorStore";
import { FileType } from "@ts/enums";
import { IFileModel } from "@ts/interfaces/interfaces";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { StoreApi, UseBoundStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

const MacroCode = <T extends IFileModel>({
  store,
  ...other
}: IMacroCodeProps<T>) => {
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);
  const { fileId, content, setContent, save } = useStore(
    store,
    useShallow((state) => ({
      fileId: state.file.id,
      content: state.content,
      setContent: state.setContent,
      save: state.save,
    }))
  );
  const { showModal: showCreateFileModal } = useCreateFileModalStore();

  const onChange = useMemo(
    () =>
      debounce((newContent: string) => {
        setContent(newContent);
        fileId && save();
      }, 200),
    [setContent]
  );

  const handleSave = useCallback(
    async (name?: string) => {
      if (fileId) {
        await save(name);
      } else {
        showCreateFileModal({
          fileType: FileType.MacroFile,
          onSave: save,
        });
      }
    },
    [fileId]
  );
  const shortCutKeymap = useMemo(
    () => [
      {
        key: "Mod-s",
        run: () => {
          handleSave();
          return true;
        },
      },
    ],
    [handleSave]
  );

  return (
    <div id="code" style={{ height: "100%" }} {...other}>
      <CodeMirror
        ref={codeMirrorRef}
        className="code-mirror"
        value={content}
        height="100%"
        extensions={[
          StreamLanguage.define(jinja2),
          Prec.highest(keymap.of(shortCutKeymap)),
        ]}
        onChange={onChange}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default memo(MacroCode);
