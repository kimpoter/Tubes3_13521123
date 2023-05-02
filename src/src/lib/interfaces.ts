export interface MessageRequestBody {
  choice: "KMP" | "BM";
  question: string;
  sessionId: number | undefined;
}
