import { toPng } from "html-to-image";

export async function exportToPng(
  node: HTMLElement,
  backgroundColor: string,
  fileName = "mi-horario.png",
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const dataUrl = await toPng(node, {
    cacheBust: true,
    backgroundColor,
    pixelRatio: 2,
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
