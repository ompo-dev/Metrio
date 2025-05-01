// Tipos compartilhados para os componentes de webhook

export type FieldType = "string" | "number" | "boolean" | "object" | "array";

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  description?: string;
}

export interface WebhookFormData {
  name: string;
  hookName: string;
  url: string;
  secret: string;
  description: string;
  isActive: boolean;
  retryOnFailure: boolean;
  maxRetries: number;
  eventFormat: string;
  isShared: boolean;
}

export interface Project {
  id: string;
  name: string;
}

export interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    activeProject?: Project | null;
  };
}

export interface WebhookTemplate {
  id: string;
  title: string;
  description: string;
  events: string[];
  icon: React.ReactNode;
  schema: string;
}

export interface EventCategory {
  category: string;
  events: string[];
}
