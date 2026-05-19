import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { useLocale } from "../../context/LocaleContext";

export default function ProofUploader({ files, setFiles, existingImages = [] }) {
  const { t } = useLocale();
  const inputRef = useRef(null);
  const total = files.length + existingImages.length;

  function handleChange(event) {
    const selected = Array.from(event.target.files || []);
    setFiles((current) => [...current, ...selected].slice(0, Math.max(0, 3 - existingImages.length)));
    event.target.value = "";
  }

  function removeFile(index) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="min-w-0">
      <span className="field-label">{t("proofUpload")}</span>
      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <button
          type="button"
          className="focus-ring flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          onClick={() => inputRef.current?.click()}
          disabled={total >= 3}
        >
          <ImagePlus className="mb-2 h-7 w-7" aria-hidden="true" />
          {t("uploadImages")}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
          {existingImages.map((image) => (
            <a
              key={image.url}
              href={image.url}
              target="_blank"
              rel="noreferrer"
              className="block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
            >
              <img src={image.url} alt={image.name || t("proofImage")} className="h-full w-full object-cover" />
            </a>
          ))}
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
            >
              <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
              <button
                type="button"
                className="focus-ring absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white"
                onClick={() => removeFile(index)}
                aria-label={t("removeProofImage")}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {total >= 3 ? <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t("proofLimit")}</p> : null}
    </div>
  );
}
