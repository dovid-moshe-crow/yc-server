import { PDFDocument } from "pdf-lib";
import fs from "fs";

const pages = [
  [7, 17],
  [18, 21],
  [22, 32],
  [33, 40],
  [41, 47],
  [48, 51],
  [52, 58],
  [59, 64],
  [65, 75],
  [76, 78],
  [79, 130],
  [131, 140],
  [141, 144],
  [145, 149],
  [150, 153],
  [154, 160],
  [161, 168],
  [169, 208],
  [209, 219],
  [220, 234],
];

await bircat("ריז הלוי", pages);

async function bircat(name, pages) {
  const pdf = await PDFDocument.load(
    fs.readFileSync(process.cwd() + "/files/ריז הלוי.pdf")
  );

  pages.forEach(async (x, i) => {
    const slice = await PDFDocument.create();
    const newPdfs = await slice.copyPages(
      pdf,
      new Array(x[1] - x[0] + 1).fill().map((_, _i) => x[0] + _i - 1)
    );

    newPdfs.forEach(async (x) => {
      slice.addPage(x);
    });

    fs.writeFileSync(
      process.cwd() + `/pdfs/${name}/${i + 1}.pdf`,
      await slice.save(),
      {
        encoding: "base64",
      }
    );
  });
}
