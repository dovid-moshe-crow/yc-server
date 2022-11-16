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

  text
    .split("\n")
    .filter((x) => x.trim() != "" && x.includes(":"))
    .forEach((x) => {
      if (x.includes("עבור")) {
        data["עבור"] = x.split("עבור")[1].trim().replace(":", "");
      } else {
        data[x.split(":")[0]] = x.split(":")[1];
      }
    });

  return data;
}
