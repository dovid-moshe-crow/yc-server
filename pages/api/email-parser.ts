// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";

type Data = Record<string, string>;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(getData(req.query.email as string));
}

function getData(text: string) {
  const $ = load(text);

  const html = $("div").children().first().html()?.split("&nbsp;");

  if (!html) throw new Error("email is in incorrect format");

  const forData = load(html[1]).text().split("עבור")[1].replace(":", "");

  const data: Record<string, string> = {};
  html[2]
    .split("<br>")
    .filter((x) => x.trim() != "" && x.includes(":"))
    .forEach((x) => {
      data[x.split(":")[0].trim()] = x
        .split(":")[1]
        .trim()
        .replace("<strong>", "")
        .replace("</strong>", "")
        .trim();
    });

  data["סכום"] = data["סכום"]?.replace("₪", "").trim();
  data["עבור"] = forData;
  
  let forId = "";

  if (forData.includes("יפה")) {
    forId = "9c82dc70-172c-4325-aa40-62682fe55803";
  } else if (forData.includes("חכמי")) {
    forId = "6843c96d-6c75-4229-b62e-7a2a640e11ef";
  } else if (forData.includes("אור אפרים")) {
    forId = "3b57b079-684c-443c-9c2f-535b3a8d341e";
  } else if (forData.includes("סומך")) {
    forId = "ba86845e-50fd-4a19-890e-201e1668e1c9";
  }

  data["מזהה הארגון"] = forId;

  console.log(data);
  return data;
}

function parseEmail(text: string) {
  const data: Record<string, string> = {};

  const $ = load(text);

  const html = $("div").children().first().html()?.split("&nbsp;");

  if (!html) throw new Error("email is in incorrect format");

  console.log(html);

  let forData = load(html[1])
    .text()[1]
    .split("עבור")[1]
    .replace(":", "")
    .replace("\n", " ")
    .trim();

  data["עבור"] = forData;

  let forId = "";

  if (forData.includes("יפה")) {
    forId = "9c82dc70-172c-4325-aa40-62682fe55803";
  } else if (forData.includes("חכמי")) {
    forId = "6843c96d-6c75-4229-b62e-7a2a640e11ef";
  } else if (forData.includes("אור אפרים")) {
    forId = "3b57b079-684c-443c-9c2f-535b3a8d341e";
  } else if (forData.includes("סומך")) {
    forId = "ba86845e-50fd-4a19-890e-201e1668e1c9";
  }

  data["מזהה הארגון"] = forId;

  let body = html[2];

  body
    .split("\n")
    .filter((x) => x.trim() != "" && x.includes(":"))
    .forEach((x) => {
      data[x.split(":")[0].trim()] = x.split(":")[1].trim();
    });

  data["סכום"] = data["סכום"]?.replace("₪", "");

  return data;
}
