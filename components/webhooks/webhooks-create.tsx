"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, HelpCircle, AlertCircle, Check, Copy, Code, ArrowRight, Rocket, Webhook, Trash, ChevronDown, ChevronUp, MoveVertical } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Templates de webhooks pré-configurados
const webhookTemplates = [
  {
    id: "user-events",
    title: "Eventos de Usuários",
    description: "Receba notificações sobre criação, atualização e remoção de usuários.",
    events: ["user.created", "user.updated", "user.deleted"],
    icon: <Webhook className="h-5 w-5 text-blue-500" />,
    schema: `[{
  "userId": "number",
  "action": "string",
  "timestamp": "string",
  "data": "object",
  "keyHook": "string"
}]`
  },
  {
    id: "payment-events",
    title: "Eventos de Pagamentos",
    description: "Receba notificações sobre pagamentos, reembolsos e falhas de transação.",
    events: ["payment.succeeded", "payment.failed", "payment.refunded"],
    icon: <Rocket className="h-5 w-5 text-green-500" />,
    schema: `[{
  "userId": "number",
  "value": "string",
  "currency": "string",
  "itemId": "number",
  "status": "string",
  "keyHook": "string"
}]`
  },
  {
    id: "product-events",
    title: "Eventos de Produtos",
    description: "Receba notificações sobre criação e atualização de produtos no catálogo.",
    events: ["product.created", "product.updated", "product.deleted"],
    icon: <Code className="h-5 w-5 text-purple-500" />,
    schema: `[{
  "productId": "number",
  "name": "string",
  "price": "string",
  "action": "string",
  "keyHook": "string"
}]`
  }
];

// Todos os eventos disponíveis para seleção
const availableEvents = [
  { category: "Usuários", events: ["user.created", "user.updated", "user.deleted", "user.login", "user.logout"] },
  { category: "Pagamentos", events: ["payment.succeeded", "payment.failed", "payment.refunded", "payment.pending", "subscription.created", "subscription.cancelled"] },
  { category: "Produtos", events: ["product.created", "product.updated", "product.deleted", "product.stock.updated"] },
  { category: "Sistema", events: ["system.error", "system.notification", "system.maintenance"] },
];

type FieldType = "string" | "number" | "boolean" | "object" | "array";

interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  description?: string;
}

export function WebhooksCreate() {
  const { toast } = useToast();
  const [events, setEvents] = useState<string[]>([]);
  const [newEvent, setNewEvent] = useState("");
  const [fields, setFields] = useState<SchemaField[]>([
    { id: "1", name: "userId", type: "number", required: true, description: "ID do usuário" },
    { id: "2", name: "value", type: "string", required: true, description: "Valor da transação" },
    { id: "3", name: "currency", type: "string", required: true, description: "Moeda (ex: BRL, USD)" },
    { id: "4", name: "itemId", type: "number", required: true, description: "ID do item" },
    { id: "5", name: "keyHook", type: "string", required: true, description: "Chave de autenticação" }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    hookName: "",
    url: "",
    secret: "",
    description: "",
    isActive: true,
    retryOnFailure: true,
    maxRetries: 5,
    eventFormat: "json",
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newField, setNewField] = useState<SchemaField>({ 
    id: "", 
    name: "", 
    type: "string", 
    required: true,
    description: ""
  });

  const generateSchemaFromFields = (): string => {
    const schemaObj = fields.reduce((acc, field) => {
      acc[field.name] = field.type;
      return acc;
    }, {} as Record<string, string>);
    
    return `[{\n${Object.entries(schemaObj)
      .map(([key, value]) => `  "${key}": "${value}"`)
      .join(",\n")}\n}]`;
  };

  const parseSchemaToFields = (schema: string): SchemaField[] => {
    try {
      // Remover colchetes e chaves extras para obter apenas o objeto interno
      const cleanSchema = schema
        .replace(/^\[\s*{/, '')
        .replace(/}\s*\]$/, '')
        .trim();
      
      // Dividir em linhas e processar cada campo
      const lines = cleanSchema.split(',\n');
      
      return lines.map((line, index) => {
        // Extrair nome e tipo
        const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
        if (!match) return { id: `temp-${index}`, name: "campo", type: "string", required: true };
        
        const [, name, type] = match;
        return {
          id: `${index + 1}`,
          name,
          type: (type as FieldType) || "string",
          required: true,
          description: ""
        };
      });
    } catch (error) {
      console.error("Erro ao analisar schema:", error);
      return [
        { id: "1", name: "userId", type: "number", required: true },
        { id: "2", name: "keyHook", type: "string", required: true }
      ];
    }
  };

  const addEvent = () => {
    if (newEvent && !events.includes(newEvent)) {
      setEvents([...events, newEvent]);
      setNewEvent("");
    }
  };

  const removeEvent = (event: string) => {
    setEvents(events.filter((e) => e !== event));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = webhookTemplates.find(t => t.id === templateId);
    if (template) {
      setEvents(template.events);
      setSelectedTemplate(templateId);
      
      // Converter o schema do template para campos visuais
      setFields(parseSchemaToFields(template.schema));
      
      toast({
        title: "Template aplicado",
        description: `O template "${template.title}" foi aplicado com sucesso.`,
        duration: 3000
      });
    }
  };

  const addField = () => {
    if (!newField.name) {
      toast({
        title: "Nome do campo necessário",
        description: "Por favor, informe um nome para o campo.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    const newId = (fields.length + 1).toString();
    setFields([...fields, { ...newField, id: newId }]);
    setNewField({ id: "", name: "", type: "string", required: true, description: "" });
  };

  const removeField = (id: string) => {
    // Nunca remover o campo keyHook que é obrigatório
    if (fields.find(f => f.id === id)?.name === "keyHook") {
      toast({
        title: "Campo obrigatório",
        description: "O campo 'keyHook' é obrigatório para autenticação e não pode ser removido.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    setFields(fields.filter(field => field.id !== id));
  };

  const moveField = (id: string, direction: "up" | "down") => {
    const index = fields.findIndex(field => field.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }
    
    const newFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    // Trocar posições
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    setFields(newFields);
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const generateSecret = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "whsec_";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      secret: result
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.hookName || !formData.secret) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    // Verificar se há o campo keyHook
    if (!fields.some(field => field.name === "keyHook")) {
      toast({
        title: "Campo keyHook obrigatório",
        description: "Seu schema deve incluir o campo 'keyHook' para autenticação.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    // Simulação de envio do formulário
    toast({
      title: "Webhook criado com sucesso!",
      description: "Seu novo webhook foi configurado e está pronto para receber eventos.",
      duration: 5000
    });
    
    // Limpar formulário
    setEvents([]);
    setFormData({
      name: "",
      hookName: "",
      url: "",
      secret: "",
      description: "",
      isActive: true,
      retryOnFailure: true,
      maxRetries: 5,
      eventFormat: "json",
    });
    setFields([
      { id: "1", name: "userId", type: "number", required: true, description: "ID do usuário" },
      { id: "2", name: "value", type: "string", required: true, description: "Valor da transação" },
      { id: "3", name: "currency", type: "string", required: true, description: "Moeda (ex: BRL, USD)" },
      { id: "4", name: "itemId", type: "number", required: true, description: "ID do item" },
      { id: "5", name: "keyHook", type: "string", required: true, description: "Chave de autenticação" }
    ]);
    setSelectedTemplate(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Templates Rápidos</CardTitle>
          <CardDescription>
            Comece rapidamente selecionando um modelo pré-configurado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {webhookTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer border-2 transition-all ${
                  selectedTemplate === template.id 
                    ? "border-primary bg-primary/5" 
                    : "hover:border-primary/30"
                }`}
                onClick={() => applyTemplate(template.id)}
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  {template.icon}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.events.map(event => (
                      <Badge key={event} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Webhook</CardTitle>
          <CardDescription>Configure um novo webhook para receber notificações em tempo real</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome do Webhook <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="name" 
                placeholder="Ex: Notificação de Cadastros" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hookName">
                Nome Técnico do Hook <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="hookName"
                  placeholder="Ex: payment-webhook"
                  value={formData.hookName}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase()
                      .replace(/\s+/g, '-')       // Substituir espaços por hífens
                      .replace(/[^a-z0-9-]/g, ''); // Remover caracteres não alfanuméricos
                    
                    setFormData({
                      ...formData,
                      hookName: value,
                      url: value ? `https://api.metrics-saas.com/${value}` : ""
                    });
                  }}
                  className="flex-1"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" type="button">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Nome técnico que será usado na URL (apenas letras, números e traços)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground">
                Este nome aparecerá na URL: https://api.metrics-saas.com/<strong>{formData.hookName || "seu-hook"}</strong>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">
                URL do Webhook
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="url" 
                  value={formData.hookName ? `https://api.metrics-saas.com/${formData.hookName}` : ""}
                  placeholder="URL gerada automaticamente a partir do nome técnico"
                  onChange={handleInputChange}
                  className="flex-1 font-mono text-sm bg-muted"
                  disabled
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          const url = `https://api.metrics-saas.com/${formData.hookName}`;
                          navigator.clipboard.writeText(url);
                          toast({
                            title: "URL copiada",
                            description: "A URL do webhook foi copiada para a área de transferência.",
                            duration: 3000
                          });
                        }}
                        disabled={!formData.hookName}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar URL do webhook para a área de transferência</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground">
                Esta URL é gerada automaticamente a partir do nome técnico e receberá notificações em formato JSON
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="secret">Chave Secreta (keyHook) <span className="text-destructive">*</span></Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  onClick={generateSecret}
                  className="h-7 text-xs"
                >
                  Gerar aleatória
                </Button>
              </div>
              <div className="flex gap-2">
                <Input 
                  id="secret" 
                  type="text" 
                  placeholder="whsec_..." 
                  value={formData.secret}
                  onChange={handleInputChange}
                  className="flex-1 font-mono text-sm"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" type="button">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chave secreta que será enviada no corpo da requisição para validação</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground">
                Esta chave deve ser incluída em todas as requisições como <code className="bg-muted px-1 py-0.5 rounded">keyHook</code> no corpo JSON
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                placeholder="Descrição do propósito deste webhook" 
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="webhook-active" 
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
              <Label htmlFor="webhook-active">Ativar webhook imediatamente após a criação</Label>
            </div>
          </div>
          
          <div className="pt-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-lg font-medium mb-2">
                Construtor de Dados
                <span className="text-sm font-normal ml-2 text-muted-foreground">
                  Defina quais campos seu webhook aceitará
                </span>
              </Label>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Dica</AlertTitle>
                <AlertDescription>
                  Defina os campos que você espera receber nas requisições. O campo "keyHook" é obrigatório 
                  para autenticação e já foi adicionado automaticamente.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="border rounded-md mt-4">
              <div className="bg-muted p-3 border-b">
                <div className="grid grid-cols-12 gap-2 font-medium text-sm">
                  <div className="col-span-4">Nome do Campo</div>
                  <div className="col-span-2">Tipo</div>
                  <div className="col-span-1">Obrigatório</div>
                  <div className="col-span-4">Descrição</div>
                  <div className="col-span-1">Ações</div>
                </div>
              </div>
              
              <div className="divide-y">
                {fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                    <div className="col-span-4">
                      <Input 
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className={field.name === "keyHook" ? "bg-muted" : ""}
                        disabled={field.name === "keyHook"}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(field.id, { type: value as FieldType })}
                        disabled={field.name === "keyHook"}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">Texto</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="boolean">Sim/Não</SelectItem>
                          <SelectItem value="object">Objeto</SelectItem>
                          <SelectItem value="array">Lista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Switch 
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        disabled={field.name === "keyHook"}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input 
                        value={field.description || ""}
                        onChange={(e) => updateField(field.id, { description: e.target.value })}
                        placeholder="Descrição do campo"
                        className={field.name === "keyHook" ? "bg-muted" : ""}
                        disabled={field.name === "keyHook"}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveField(field.id, "up")}
                        disabled={fields.indexOf(field) === 0 || field.name === "keyHook"}
                        className="h-7 w-7"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveField(field.id, "down")}
                        disabled={fields.indexOf(field) === fields.length - 1 || field.name === "keyHook"}
                        className="h-7 w-7"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeField(field.id)} 
                        disabled={field.name === "keyHook"}
                        className="h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t bg-muted/50">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Input 
                      placeholder="Nome do campo"
                      value={newField.name}
                      onChange={(e) => setNewField({...newField, name: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Select
                      value={newField.type}
                      onValueChange={(value) => setNewField({...newField, type: value as FieldType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="boolean">Sim/Não</SelectItem>
                        <SelectItem value="object">Objeto</SelectItem>
                        <SelectItem value="array">Lista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Switch 
                      checked={newField.required}
                      onCheckedChange={(checked) => setNewField({...newField, required: checked})}
                    />
                  </div>
                  <div className="col-span-4">
                    <Input 
                      placeholder="Descrição do campo"
                      value={newField.description || ""}
                      onChange={(e) => setNewField({...newField, description: e.target.value})}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={addField}
                      disabled={!newField.name}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium mb-2">Exemplo de Requisição</h3>
              <div className="rounded-md overflow-hidden">
                <SyntaxHighlighter 
                  language="typescript" 
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: '0.75rem', borderRadius: '0.375rem' }}
                  showLineNumbers
                >
                  {`// Exemplo de requisição com Axios e TypeScript
import axios from 'axios';

// Definição da interface com os tipos corretos
interface WebhookPayload {${
  fields.map(field => {
    let typeDefinition = '';
    switch(field.type) {
      case 'string': typeDefinition = 'string'; break;
      case 'number': typeDefinition = 'number'; break;
      case 'boolean': typeDefinition = 'boolean'; break;
      case 'object': typeDefinition = 'Record<string, any>'; break;
      case 'array': typeDefinition = 'any[]'; break;
    }
    return `\n  ${field.name}${field.required ? '' : '?'}: ${typeDefinition}; // ${field.description || ''}`;
  }).join('')
}\n}

// Função para enviar o webhook
async function enviarWebhook() {
  try {
    const data: WebhookPayload = {${
      fields.map(field => {
        let exampleValue = '';
        switch(field.type) {
          case 'string': exampleValue = field.name === 'keyHook' ? `'${formData.secret || 'whsec_...123'}'` : "'valor de exemplo'"; break;
          case 'number': exampleValue = '123'; break;
          case 'boolean': exampleValue = 'true'; break;
          case 'object': exampleValue = '{ chave: "valor" }'; break;
          case 'array': exampleValue = '["item1", "item2"]'; break;
        }
        return `\n      ${field.name}: ${exampleValue},`;
      }).join('')
    }
    };

    const response = await axios.post(
      'https://api.metrics-saas.com/${formData.hookName || "seu-hook"}',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Webhook enviado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    throw error;
  }
}`}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="retryOnFailure">Tentar novamente em caso de falha</Label>
                <Switch 
                  id="retryOnFailure" 
                  checked={formData.retryOnFailure}
                  onCheckedChange={(checked) => handleSwitchChange("retryOnFailure", checked)}
                />
              </div>
              {formData.retryOnFailure && (
                <div className="pl-6 border-l-2 border-muted space-y-2">
                  <Label htmlFor="maxRetries" className="text-sm">Número máximo de tentativas</Label>
                  <Select
                    value={formData.maxRetries.toString()}
                    onValueChange={(value) => setFormData({...formData, maxRetries: parseInt(value)})}
                  >
                    <SelectTrigger id="maxRetries" className="w-[180px]">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 tentativa</SelectItem>
                      <SelectItem value="3">3 tentativas</SelectItem>
                      <SelectItem value="5">5 tentativas</SelectItem>
                      <SelectItem value="10">10 tentativas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-6 px-6 py-4 border-t">
          <Button variant="outline" type="button" className="w-full sm:w-auto">
            Cancelar
          </Button>
          
          <div className="flex-1 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">
              Criar Webhook
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

