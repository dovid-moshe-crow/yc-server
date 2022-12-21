// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { load } from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Record<string, string>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(parseEmailMasof(req.query.email as string));
}

function parseEmailMasof(text: string) {
  const $ = load(text);

  const tbody = $("tbody").first();

  let arr =  tbody
    .children()
    .map(function (_, el) {
      let tds = $(this).children();
      let name = tds.first().children().first().text().replace(":", "").trim();
      let value = tds.eq(1).text().replace("₪", "").trim();
      return { name, value };
    })
    .toArray();

  let data: Record<string,string> = {}

  for(const e of arr){
    data[e.name] = e.value
  }

  return data;
}

