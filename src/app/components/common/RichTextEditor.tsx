import { useEffect, useRef } from "react";
import {
  Bold, Italic, Underline, Type, Heading1, Heading2, Heading3,
  Image as ImageIcon, Music, Video, Link, Unlink, Eraser, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";

type Cmd = (cmd: string, val?: string) => void;

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // 初始化内容（仅首次或外部 value 变化且未聚焦时同步）
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec: Cmd = (cmd, val) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    emit();
  };

  const emit = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const insertMedia = (file: File, type: "img" | "audio" | "video") => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      let html = "";
      if (type === "img") {
        html = `<img src="${url}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`;
      } else if (type === "audio") {
        html = `<audio controls src="${url}" style="width:100%;margin:8px 0;"></audio>`;
      } else {
        html = `<video controls src="${url}" style="max-width:100%;border-radius:8px;margin:8px 0;"></video>`;
      }
      editorRef.current?.focus();
      document.execCommand("insertHTML", false, html);
      emit();
    };
    reader.readAsDataURL(file);
  };

  const insertLink = () => {
    const url = prompt("请输入链接地址：", "https://");
    if (url) exec("createLink", url);
  };

  const btn = "p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1890ff]">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-gray-100 bg-gray-50">
        <button type="button" className={btn} onClick={() => exec("bold")} title="加粗"><Bold className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("italic")} title="斜体"><Italic className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("underline")} title="下划线"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button type="button" className={btn} onClick={() => exec("formatBlock", "<H1>")} title="标题1"><Heading1 className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("formatBlock", "<H2>")} title="标题2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("formatBlock", "<H3>")} title="标题3"><Heading3 className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <select
          onChange={e => { e.target.value && exec("fontSize", e.target.value); e.target.value = ""; }}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white focus:outline-none"
          defaultValue=""
          title="字号"
        >
          <option value="" disabled>字号</option>
          <option value="1">小</option>
          <option value="3">正常</option>
          <option value="5">大</option>
          <option value="7">特大</option>
        </select>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="color"
            onChange={e => exec("foreColor", e.target.value)}
            className="w-6 h-6 cursor-pointer border-0 bg-transparent"
            title="字体颜色"
          />
          <Type className="w-4 h-4 text-gray-500" />
        </label>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button type="button" className={btn} onClick={() => exec("justifyLeft")} title="左对齐"><AlignLeft className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("justifyCenter")} title="居中"><AlignCenter className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("justifyRight")} title="右对齐"><AlignRight className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button type="button" className={btn} onClick={() => imgRef.current?.click()} title="插入图片"><ImageIcon className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => audioRef.current?.click()} title="插入音频"><Music className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => videoRef.current?.click()} title="插入视频"><Video className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={insertLink} title="插入链接"><Link className="w-4 h-4" /></button>
        <button type="button" className={btn} onClick={() => exec("unlink")} title="取消链接"><Unlink className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <button type="button" className={btn} onClick={() => exec("removeFormat")} title="清除格式"><Eraser className="w-4 h-4" /></button>

        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) insertMedia(f, "img"); e.target.value = ""; }} />
        <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) insertMedia(f, "audio"); e.target.value = ""; }} />
        <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) insertMedia(f, "video"); e.target.value = ""; }} />
      </div>

      {/* 编辑区 */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        className="min-h-[200px] p-4 text-sm text-gray-700 leading-relaxed outline-none prose-sm"
        style={{ lineHeight: "1.8" }}
      />
    </div>
  );
}
