import { useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

export function ImageInput({
  label, value, onChange, required,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const onFile = (file: File) => {
    const ok = /\.(png|jpe?g)$/i.test(file.name) || ["image/png", "image/jpeg"].includes(file.type);
    if (!ok) {
      alert("仅支持 png/jpeg 格式的图片");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小不能超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ? (
            <img src={value} alt="预览" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-5 h-5 text-gray-300" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <input
            ref={ref}
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
          />
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="flex items-center gap-1.5 text-xs text-[#1890ff] border border-[#1890ff] px-2.5 py-1.5 rounded hover:bg-blue-50 transition-colors w-fit"
          >
            <Upload className="w-3 h-3" /> 上传图片
          </button>
          <input
            type="text"
            value={value.startsWith("data:") ? "" : value}
            onChange={e => onChange(e.target.value)}
            placeholder="或粘贴图片 URL"
            className="text-xs border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#1890ff]"
          />
        </div>
      </div>
    </div>
  );
}
