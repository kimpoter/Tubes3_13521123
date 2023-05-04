export interface MessageRequestBody {
  choice: "KMP" | "BM";
  question: string;
  sessionId: number | undefined;
}

export interface AuthSession {
  id: string;
  role: string;
  email: string;
}
