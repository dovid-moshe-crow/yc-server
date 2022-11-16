// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = number;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(parseEmail(req.query.email as string));
}

function parseEmail(text: string) {
  return parseInt(
    text
      .split(/\s+/)
      .filter((x) => x.includes("$"))[0]
      .replace("$", "")
  );
}
