// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Record<string, string>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(parseEmail(req.query.email as string));
}

function parseEmail(text: string) {
  const data: Record<string, string> = {};

  let forData = text
    .split("\n \n")[1]
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

  let body = text.split("\n \n")[2];

  body
    .split("\n")
    .filter((x) => x.trim() != "" && x.includes(":"))
    .forEach((x) => {
      data[x.split(":")[0].trim()] = x.split(":")[1].trim();
    });

  data["סכום"] = data["סכום"]?.replace("₪", "");

  return data;
}
