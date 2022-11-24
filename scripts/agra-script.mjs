import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { exec, spawn } from "child_process";
import util from "util";
async function createParagraphs() {
  const json = JSON.parse(
    fs.readFileSync("./data/agra-index-data.json").toString()
  );

  const pdf = await PDFDocument.load(fs.readFileSync("./files/agra.pdf"));

  await json.forEach(async (x) => {
    const slice = await PDFDocument.create();
    const newPdfs = await slice.copyPages(
      pdf,
      new Array(x.pages.page2 - x.pages.page1 + 1)
        .fill()
        .map((_, i) => x.pages.page1 + i + 1)
    );

    newPdfs.forEach(async (x) => {
      slice.addPage(x);
    });

    fs.writeFileSync(`./files/${x.number}.pdf`, await slice.save(), {
      encoding: "base64",
    });
  });
}

(async () => {
  //await createParagraphs();
  await compressPdfs();
})();

async function compressPdfs() {
  const execPromise = util.promisify(exec);
  for (let i = 1; i <= 42; i++) {
    await execPromise(
      `gs \ -q -dNOPAUSE -dBATCH -dSAFER \ -sDEVICE=pdfwrite \ -dCompatibilityLevel=1.4 \ -dPDFSETTINGS=/ebook \ -dEmbedAllFonts=true \ -dSubsetFonts=true \ -dAutoRotatePages=/None \ -dColorImageDownsampleType=/Bicubic  \ -dGrayImageDownsampleType=/Bicubic \ -sOutputFile=pdfs/${i}.pdf \ files/${i}.pdf`
    );
  }
}

function hebrewLetter2number(letter) {
  const letters = {
    א: 1,
    ב: 2,
    ג: 3,
    ד: 4,
    ה: 5,
    ו: 6,
    ז: 7,
    ח: 8,
    ט: 9,
    י: 10,
    כ: 20,
    ל: 30,
    מ: 40,
    נ: 50,
    ס: 60,
    ע: 70,
    פ: 80,
    צ: 90,
    ק: 100,
    ר: 200,
    ש: 300,
    ת: 400,
  };
  return letters[letter];
}

function createJson() {
  const json = JSON.parse(fs.readFileSync("./data/agra-index.json").toString());
  const paragraphs = [];

  json.forEach((x) => {
    const number = x.number
      .split("סימן")[1]
      .trim()
      .split("")
      .map((x) => hebrewLetter2number(x))
      .reduce((a, b) => a + b);

    const pages = x.pages.split("-");

    const page1 = pages[0]
      .trim()
      .split("")
      .map((x) => hebrewLetter2number(x))
      .reduce((a, b) => a + b);
    const page2 = pages[1]
      .trim()
      .split("")
      .map((x) => hebrewLetter2number(x))
      .reduce((a, b) => a + b);

    paragraphs.push({
      number,
      paragraph: {
        number: x.number,
        title: x.title,
      },
      pages: {
        page1,
        page2,
      },
    });
  });

  fs.writeFileSync("./data/agra-index-data.json", JSON.stringify(paragraphs));
}
