import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const knowledgeBaseRoot = resolve(repositoryRoot, "content/knowledge-base");
const jobsRoot = resolve(repositoryRoot, "content/jobs");
const outputPath = resolve(
  scriptDirectory,
  "../src/generated/agent-content.json",
);

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

function frontmatterValue(raw, field) {
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/)?.[1];
  const line = frontmatter
    ?.split("\n")
    .find((candidate) => candidate.startsWith(`${field}:`));
  const value = line?.slice(field.length + 1).trim();

  return value?.replace(/^(["'])(.*)\1$/, "$2") ?? "";
}

const knowledgeDocuments = [];
for (const path of await markdownFiles(knowledgeBaseRoot)) {
  const source = relative(knowledgeBaseRoot, path).replaceAll("\\", "/");
  const category = source.split("/")[0] ?? "general";
  const raw = await readFile(path, "utf8");

  for (const [index, content] of splitDocument(raw).entries()) {
    knowledgeDocuments.push({
      id: `${source}#${index + 1}`,
      source,
      category,
      content,
    });
  }
}

const jobs = {};
const jobProfiles = {};
for (const path of await markdownFiles(jobsRoot)) {
  const id = relative(jobsRoot, path).replace(/\.md$/, "");
  const raw = await readFile(path, "utf8");
  jobs[id] = raw;
  jobProfiles[id] = {
    companyName: frontmatterValue(raw, "company_name"),
    recruiterName: frontmatterValue(raw, "recruiter_name"),
  };
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify({ knowledgeDocuments, jobs, jobProfiles }, null, 2)}\n`,
);

console.log(
  `Bundled ${knowledgeDocuments.length} knowledge sections and ${Object.keys(jobs).length} job contexts.`,
);
