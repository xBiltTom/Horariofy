import { useState, useCallback } from "react";
import { DEFAULT_EXPORT_OPTIONS, type ExportOptions } from "./exportTypes";
import { generateTheme } from "./exportThemes";

export function useExportOptions() {
  const [options, setOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);

  const update = useCallback(
    <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const generateRandomTheme = useCallback(() => {
    setOptions((prev) => ({ ...prev, theme: generateTheme() }));
  }, []);

  const reset = useCallback(() => {
    setOptions(DEFAULT_EXPORT_OPTIONS);
  }, []);

  return { options, update, generateRandomTheme, reset };
}
