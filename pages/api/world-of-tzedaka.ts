// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  amount: number;
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(parseEmail(req.query.email as string));
}

function parseEmail(text: string) {
  const amount = parseInt(
    text
      .split(/\s+/)
      .filter((x) => x.includes("$"))[0]
      .replace("$", "")
  );

  const arr = text.split("\n");

  const name = arr[arr.indexOf("Billing address") + 1];

  return {
    amount,
    name,
  };
}
