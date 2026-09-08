import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const knowledgeBaseRoot = resolve(repositoryRoot, "content/knowledge-base");
const outputPath = resolve(scriptDirectory, "../src/generated/career-content.json");

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? markdownFiles(path) : path;
    }),
  );

  return files
    .flat()
    .filter((path) => extname(path) === ".md" && !path.endsWith("README.md"))
    .sort();
}

function splitDocument(raw) {
  const frontmatterMatch = raw.match(/^---\n[\s\S]*?\n---\n?/);
  const metadata = frontmatterMatch?.[0].trim() ?? "";
  const body = raw.slice(frontmatterMatch?.[0].length ?? 0).trim();
  const sections = body.split(/(?=^# )/m).filter((section) => section.trim());

  return (sections.length ? sections : [body]).map((section) =>
    [metadata, section.trim()].filter(Boolean).join("\n\n"),
  );
}

const documents = [];
for (const path of await markdownFiles(knowledgeBaseRoot)) {
  const source = relative(knowledgeBaseRoot, path).replaceAll("\\", "/");
  const category = source.split("/")[0] ?? "general";
  const raw = await readFile(path, "utf8");

  for (const [index, content] of splitDocument(raw).entries()) {
    documents.push({
      id: `${source}#${index + 1}`,
      source,
      category,
      content,
    });
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ documents }, null, 2)}\n`);
console.log(`Bundled ${documents.length} shared career evidence sections.`);
