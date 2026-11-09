import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const config = yaml.load(fs.readFileSync(path.join(root, ".pages.yml"), "utf8"));

/** Validate the exact schema used by the visual editor, including local uploads. */
export function validateContent(entry, data) {
  const errors = [];
  const fail = (location, message) => errors.push(`${entry.path}: ${location} ${message}`);
  function fieldValue(field, value, location) {
    if (value === undefined || value === null || value === "") {
      if (field.required) fail(location, "is required.");
      return;
    }
    if (field.list) {
      if (!Array.isArray(value)) { fail(location, "must be a list."); return; }
      const { min = 0, max = Infinity } = typeof field.list === "object" ? field.list : {};
      if (value.length < min || value.length > max) fail(location, `must contain ${min === max ? min : `${min}–${max}`} items.`);
      value.forEach((item, index) => fieldValue({ ...field, list: false }, item, `${location}[${index}]`));
      return;
    }
    if (field.type === "object") {
      if (typeof value !== "object" || Array.isArray(value)) { fail(location, "must be an object."); return; }
      const names = new Set(field.fields.map(item => item.name));
      Object.keys(value).forEach(key => { if (!names.has(key)) fail(`${location}.${key}`, "has no editor field."); });
      field.fields.forEach(child => fieldValue(child, value[child.name], `${location}.${child.name}`));
      return;
    }
    if (typeof value !== "string" || (field.required && !value.trim())) { fail(location, "must be non-empty text."); return; }
    if (field.pattern) {
      const regex = typeof field.pattern === "string" ? field.pattern : field.pattern.regex;
      if (!new RegExp(regex).test(value)) fail(location, typeof field.pattern === "object" ? field.pattern.message : "has an invalid format.");
    }
    if (field.type === "image" || field.type === "file") {
      const media = config.media.find(item => item.name === field.options.media);
      if (!media || !value.startsWith(`${media.output}/`)) { fail(location, "must reference the configured media library."); return; }
      const publicRoot = path.join(root, "public");
      const resolved = path.resolve(publicRoot, `.${value}`);
      if (!resolved.startsWith(publicRoot + path.sep) || !fs.existsSync(resolved)) fail(location, `references a missing local file: ${value}`);
      const extension = path.extname(value).slice(1).toLowerCase();
      if (!media.extensions.includes(extension)) fail(location, "uses an unsupported media extension.");
    }
  }
  fieldValue({ type: "object", fields: entry.fields }, data, entry.name);
  if (entry.name === "project" && !data.video?.src?.trim() && !data.video?.url?.trim()) {
    fail("project.video", "needs either an uploaded video file or a direct HTTPS video URL.");
  }
  return errors;
}

export function validateAllContent() {
  return config.content.flatMap(entry => {
    try { return validateContent(entry, JSON.parse(fs.readFileSync(path.join(root, entry.path), "utf8"))); }
    catch (error) { return [`${entry.path}: ${error.message}`]; }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = validateAllContent();
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log(`Pages CMS: ${config.content.length} content files, editor fields, and local media validated.`);
}
