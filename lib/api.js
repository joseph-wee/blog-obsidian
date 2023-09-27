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
import { visit } from "unist-util-visit";

/** 메모가 저장되는 메모폴더의 디렉토리 트리 획득 */
export const getDirectoryTree = () => {
  const directoryList = fs.readdirSync("memo")
  let tree = [];

  directoryList.forEach((el) => {
    if (el === ".obsidian") {
      return;
    }
    if (el.split(".")[1] === "md") {
      return;
    }

    let obj = {}
    obj[el] = fs.readdirSync(`memo/${el}`)
    tree.push(obj)

  })

  return tree;
}

/** tree에서 .md 제거하여 메뉴 획득 */
export const getMenu = () => {
  const tree = getDirectoryTree();
  let menu = []

  menu = tree.map((el) => {
    el[Object.keys(el)] = el[Object.keys(el)].map((fileName) => {
      return fileName.split(".md")[0]
    })
    return el
  })

  return menu
}

/** pre-render할 slug리스트 획득 */
export const getSlugList = () => {
  const tree = getDirectoryTree();
  let slugList = [];

  tree.forEach((el) => {
    let obj = {}
    slugList.push(...el[Object.keys(el)].map((fileName) => {
      return { slug: fileName.split(".md")[0].replace(/ /g, "_") }
    }))
  })

  return slugList
}

/** params.slug에 해당하는 파일 주소 획득 */
export const getPath = (params) => {
  const tree = getDirectoryTree();
  const fileName = decodeURI(params.slug).replace(/_/g, " ") + ".md"
  let dir = "";
  let path = ""

  tree.forEach((el) => {
    if (Object.values(el)[0].includes(fileName)) {
      dir = Object.keys(el)[0]
    }
  })
  path = `memo/${dir}/${fileName}`
  return path
}

/** md -> html -> react element로 변환 */
export const mdToHtml = (path) => {
  const file = fs.readFileSync(path, "utf-8")

  const htmlContnet = unified()
    .use(markdown, { gfm: true }) // Parse Markdown
    .use(wikiLinkPlugin, {  // 백링크 변환
      pageResolver: (pageName) => [pageName.replace(/ /g, "_")],
      hrefTemplate: (permalink) => `/post/${permalink}`,
    })
    .use(remark2rehype) // hast 노드로 변환..? 아마도...
    // .use((options) => (tree) => { // visit을 통해 노드 조작 
    //   visit(tree,
    //     (node) => node.tagName === 'a',
    //     (node) => (node.tagName = "a"))
    // })
    .use(rehypeReact, { // react element형태로 변환
      createElement: React.createElement, // Use React.createElement for rendering
    })
    .processSync(file).result;

  return htmlContnet
}

/** node test */
export const nodeTest = (path) => {
  const file = fs.readFileSync(path, "utf-8")

  const htmlContnet = unified()
    .use(markdown, { gfm: true }) // Parse Markdown
    .use(wikiLinkPlugin, {
      pageResolver: (pageName) => [pageName.replace(/ /g, "_")],
      hrefTemplate: (permalink) => `/post/${permalink}`,
    })
    .use(remark2rehype)
    .use((options) => (tree) => {
      visit(tree,
        (node) => node.tagName === 'a',
        (node) => (node.tagName = "Link"))
    })
    .use((options) => (rehypeTree) => console.log(JSON.stringify(rehypeTree))) // 추가
    .use(rehypeStringify)
    .processSync(file).toString();

  console.log(htmlContnet)
}