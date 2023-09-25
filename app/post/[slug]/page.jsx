import React from "react";
import Parse from "@/components/Parse";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import unified from "unified";
import reporter from "vfile-reporter";
import markdown from "remark-parse";
import fs from "fs";
import rehypeReact from "rehype-react";
import remark2rehype from "remark-rehype";
// import obsidianImage from "../../../lib/obsidian-image.js";
import wikiLinkPlugin from "remark-wiki-link-plus";
import Link from "next/link.js";
import externalLinks from "remark-external-links";
import highlight from "remark-highlight.js";

const page = async ({ params }) => {
  let directoryList = fs.readdirSync("memo");
  let fileList = [];

  directoryList.forEach((el) => {
    if (el == ".obsidian") {
      return;
    }
    if (el.split(".")[1] == "md") {
      return;
    }
    let temp = fs.readdirSync(`memo/${el}`);
    console.log(`memo/${el}`);
    fileList.push(temp);
  });

  console.log(fileList);

  let path = decodeURI(params.slug);

  const test = fs.readFileSync(`memo/Javascript/${path}.md`, "utf8");

  const file = await unified()
    .use(markdown, { gfm: true }) // Parse Markdown
    .use(wikiLinkPlugin, {
      hrefTemplate: (permalink) => `/post/${permalink}`,
    })
    .use(remark2rehype)
    .use(rehypeReact, {
      createElement: React.createElement, // Use React.createElement for rendering
    });

  const htmlContent = file.processSync(test).result;

  return (
    <div>
      {/* <Link href="/blog/test">test</Link> */}
      {htmlContent}
    </div>
  );
};

export default page;
