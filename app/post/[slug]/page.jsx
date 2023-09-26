import React from "react";

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
import {
  getDirectoryTree,
  getPath,
  getSlugList,
  mdToHtml,
  nodeTest,
} from "@/lib/api";

/** pre-render */
export function generateStaticParams() {
  const slugList = getSlugList();
  return slugList;
}

const page = async ({ params }) => {
  const path = getPath(params);
  const htmlContent = mdToHtml(path);

  nodeTest(path);

  return (
    <div>
      {htmlContent}
      <Link href="Test">test</Link>
    </div>
  );
};

export default page;
