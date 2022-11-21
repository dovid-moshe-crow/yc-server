// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
type Data = Buffer;

const json = JSON.parse(
  fs.readFileSync(`${process.cwd()}/data/agra-index-data.json`).toString()
);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //const file = fs.readFileSync(`.../../pdfs/${req.query.id}.pdf`,{encoding:"base64"});
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=${
      encodeURIComponent(json[parseInt(req.query.id as string) - 1].paragraph.number)
    }.pdf`
  );
  
  res.status(200).send(fs.readFileSync(`${process.cwd()}/pdfs/${req.query.id}.pdf`));
}
