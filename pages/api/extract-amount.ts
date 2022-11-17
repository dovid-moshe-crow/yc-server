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
  const values: Record<string, string> = {};
  text
    .split("\n")
    .filter((x) => x.startsWith("> *") && x.includes(":"))
    .forEach((x) => {
      const a = x.split("*")[2].trim();
      const b = x.split("*")[1].trim();

      if (a.includes(":")) {
        values[a.replace(":", "")] = b;
      } else {
        values[b.replace(":", "")] = a;
      }
    });

  return {
    "שם הלקוח": values["שם הלקוח"],
    סכום: values["סכום"].replace("₪", ""),
  };
}
