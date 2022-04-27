import ReactDOMServer from "react-dom/server";
import React from "react";
import {app, DOMParser, http404} from "primate";
import {File, Path} from "runtime-compat";
import babel from "@babel/core";

const cwd = new Path(import.meta.url).directory;
const presets = ["@babel/preset-react"];
const plugins = [["replace-import-extension", {"extMapping": {".jsx": ".js"}}]];
const ending = ".jsx";

const {"paths": {"components": path}} = app.conf;
const _public = app.conf.paths.public;
const jsx_path = `${_public}/jsx/`;
if (!await File.exists(_public)) {
  await File.create(_public);
}
if (!await File.exists(jsx_path)) {
  await File.create(jsx_path);
}
const components = {};
if (await File.exists(path)) {
  (await Promise.all((await File.list(path))
    .filter(name => name.endsWith(ending))
    .map(async name => {
      const __html = await File.read(`${path}/${name}`);
      const {code} = babel.transformSync(__html, {cwd, presets, plugins});
      const write_path = `${jsx_path}/${name.slice(0, -ending.length)}.js`;
      await File.write(write_path, code);
      return {name, write_path};
    })))
    .forEach(async ({name, write_path}) => {
      components[name.slice(0, -4)] = (await import(write_path)).default;
    });
}

const render = (component, attributes) =>
  ReactDOMServer.renderToString(React.createElement(component, attributes));

const last = -1;
export default async (strings, ...keys) => {
  const tag = (await DOMParser.parse(strings
    .slice(0, last)
    .map((string, i) => `${string}$${i}`)
    .join("") + strings[strings.length+last], await Promise.all(keys)))
    .children[0];
  const {tag_name, attributes} = tag;
  if (components[tag_name] !== undefined) {
    const component = components[tag_name];
    const html = render(component, attributes);
    const body = app.index.replace("<body>", () => `<body>${html}`);
    const code = 200;
    const headers = {"Content-Type": "text/html"};
    return {body, code, headers};
  } else {
    return http404;
  }
};
