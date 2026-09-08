import careerContent from "../generated/career-content.json";

export type EvidenceDocument = (typeof careerContent.documents)[number];

function tokenize(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9+#.]+/g) ?? [];
}

export function retrieveEvidence(query: string, limit = 14): EvidenceDocument[] {
  const documents = careerContent.documents;
  const queryTerms = [...new Set(tokenize(query))];
  const tokenized = documents.map((document) => tokenize(document.content));
  const averageLength =
    tokenized.reduce((sum, tokens) => sum + tokens.length, 0) /
    Math.max(tokenized.length, 1);

  return documents
    .map((document, index) => {
      const tokens = tokenized[index];
      const frequencies = new Map<string, number>();
      for (const token of tokens) {
        frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
      }

      const score = queryTerms.reduce((total, term) => {
        const frequency = frequencies.get(term) ?? 0;
        if (!frequency) return total;
        const documentFrequency = tokenized.reduce(
          (count, candidate) => count + Number(candidate.includes(term)),
          0,
        );
        const inverseDocumentFrequency = Math.log(
          1 +
            (documents.length - documentFrequency + 0.5) /
              (documentFrequency + 0.5),
        );
        const denominator =
          frequency + 1.5 * (0.25 + 0.75 * (tokens.length / averageLength));
        return total + inverseDocumentFrequency * ((frequency * 2.5) / denominator);
      }, 0);

      return { document, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ document }) => document);
}

export function formatEvidence(documents: EvidenceDocument[]): string {
  return documents
    .map(
      (document) =>
        `[EVIDENCE ${document.id}]\nSource: ${document.source}\n${document.content}`,
    )
    .join("\n\n---\n\n");
}
