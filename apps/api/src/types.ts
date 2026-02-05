export type ActorContext =
  | {
      actorType: "api_key";
      actorId: string;
      tenantId: string;
      apiKeyId: string;
      allowedSmtpAccountIds: string[];
      rateLimitPerMinute: number;
      allowedIps: string[];
    }
  | {
      actorType: "user";
      actorId: string;
      tenantId: string;
      role: "owner" | "admin" | "readonly";
    };
