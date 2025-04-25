"use client";

import Link from "next/link";

export default function NotificationsDocsPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8">
        Sistema de Notificações em Tempo Real
      </h1>

      <nav className="mb-10 p-4 bg-slate-100 rounded-lg">
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link href="#arquitetura" className="text-blue-600 hover:underline">
              Arquitetura
            </Link>
          </li>
          <li>
            <Link href="#componentes" className="text-blue-600 hover:underline">
              Componentes
            </Link>
          </li>
          <li>
            <Link href="#uso" className="text-blue-600 hover:underline">
              Como Usar
            </Link>
          </li>
          <li>
            <Link href="#api" className="text-blue-600 hover:underline">
              API
            </Link>
          </li>
          <li>
            <Link href="#socket" className="text-blue-600 hover:underline">
              WebSockets
            </Link>
          </li>
          <li>
            <Link href="#validacao" className="text-blue-600 hover:underline">
              Validação
            </Link>
          </li>
          <li>
            <Link
              href="#escalabilidade"
              className="text-blue-600 hover:underline"
            >
              Escalabilidade
            </Link>
          </li>
        </ul>
      </nav>

      <section id="arquitetura" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Arquitetura</h2>
        <p className="mb-4">
          O sistema de notificações em tempo real combina várias tecnologias
          para garantir entrega confiável e experiência de usuário responsiva:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>
            <strong>Persistência</strong>: Notificações são armazenadas no
            PostgreSQL para garantir durabilidade e recuperação.
          </li>
          <li>
            <strong>Tempo Real</strong>: WebSockets via Socket.IO proporcionam
            comunicação instantânea bidirecional.
          </li>
          <li>
            <strong>Sincronização</strong>: PostgreSQL LISTEN/NOTIFY para
            sincronizar eventos entre múltiplas instâncias do servidor.
          </li>
          <li>
            <strong>Validação</strong>: Zod para validação de esquema tanto no
            cliente quanto no servidor.
          </li>
        </ul>

        <div className="border rounded-md p-4 bg-slate-50">
          <h3 className="text-lg font-medium mb-2">Fluxo de Dados</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>
              Evento ocorre no servidor (ex: usuário adicionado a uma equipe)
            </li>
            <li>Notificação é criada no banco de dados (persistência)</li>
            <li>
              Notificação é enviada via WebSocket para o usuário conectado
            </li>
            <li>
              NOTIFY do PostgreSQL sincroniza entre instâncias do servidor
            </li>
            <li>Notificações não lidas são recuperadas no login do usuário</li>
          </ol>
        </div>
      </section>

      <section id="componentes" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Componentes do Sistema</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">Modelo de Dados</h3>
            <p className="mb-2">
              A tabela <code>Notification</code> armazena:
            </p>
            <ul className="list-disc pl-6">
              <li>ID único</li>
              <li>Tipo da notificação (TEAM_ADDED, INVITE, etc.)</li>
              <li>Conteúdo em formato JSON</li>
              <li>Status de leitura (read)</li>
              <li>Data de criação</li>
              <li>ID do usuário destinatário</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">
              Comunicação em Tempo Real
            </h3>
            <p className="mb-2">O sistema usa:</p>
            <ul className="list-disc pl-6">
              <li>Socket.IO para WebSockets</li>
              <li>PostgreSQL LISTEN/NOTIFY para sincronização</li>
              <li>Reconexão automática em caso de falhas</li>
              <li>Mapeamento de usuários para sockets ativos</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">Frontend</h3>
            <ul className="list-disc pl-6">
              <li>
                Hook <code>useSocket</code> para integração com WebSockets
              </li>
              <li>Context Provider para compartilhar estado</li>
              <li>Tipagem TypeScript para segurança</li>
              <li>Componentes para exibição e interação</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-medium mb-2">Backend</h3>
            <ul className="list-disc pl-6">
              <li>API REST para CRUD de notificações</li>
              <li>Socket.IO para entrega em tempo real</li>
              <li>Prisma para acesso ao banco de dados</li>
              <li>Sistema PubSub para sincronização</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="uso" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Como Usar</h2>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">No Frontend</h3>
          <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
            <pre>{`// Usando o contexto de socket no componente
import { useSocketContext } from "@/lib/providers/SocketProvider";

function MeuComponente() {
  const { 
    notifications, 
    isConnected,
    markAsRead,
    markAllAsRead 
  } = useSocketContext();
  
  // Acessar as notificações
  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.type}: {notification.content}
          <button onClick={() => markAsRead(notification.id)}>
            Marcar como lida
          </button>
        </div>
      ))}
    </div>
  );
}`}</pre>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">No Backend</h3>
          <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
            <pre>{`// Enviando uma notificação
import { createAndSendNotification } from "@/app/api/notifications/route";

// Em um controlador de rota
async function meuHandler() {
  // Validar dados com Zod
  const validData = teamAddedSchema.parse({
    userId: "user-id",
    teamId: "team-id",
    teamName: "Nome da Equipe",
    projectId: "project-id",
  });
  
  // Criar e enviar notificação
  const result = await createAndSendNotification(
    validData.userId,
    "TEAM_ADDED",
    {
      teamId: validData.teamId,
      teamName: validData.teamName,
      projectId: validData.projectId,
      senderName: "Nome do Remetente",
    }
  );
}`}</pre>
          </div>
        </div>
      </section>

      <section id="api" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API</h2>

        <p className="mb-4">
          O sistema de notificações expõe os seguintes endpoints:
        </p>

        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium">GET /api/notifications</h3>
            <p className="text-sm text-gray-600 mb-2">
              Lista todas as notificações não lidas do usuário autenticado
            </p>
            <p className="text-sm">
              <strong>Resposta:</strong> Array de notificações formatadas
            </p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium">PATCH /api/notifications</h3>
            <p className="text-sm text-gray-600 mb-2">
              Marca notificações como lidas
            </p>
            <p className="text-sm">
              <strong>Parâmetros:</strong> <code>notificationId</code> ou{" "}
              <code>markAllAsRead</code>
            </p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium">POST /api/notifications/team-added</h3>
            <p className="text-sm text-gray-600 mb-2">
              Cria uma notificação de adição à equipe
            </p>
            <p className="text-sm">
              <strong>Corpo:</strong> userId, teamId, teamName, projectId
            </p>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium">
              POST /api/notifications/team-removed
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Cria uma notificação de remoção da equipe
            </p>
            <p className="text-sm">
              <strong>Corpo:</strong> userId, teamId, teamName, projectId
            </p>
          </div>
        </div>

        <p className="mt-4">
          A documentação completa da API está disponível em{" "}
          <Link href="/docs" className="text-blue-600 hover:underline">
            /docs
          </Link>
        </p>
      </section>

      <section id="socket" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">WebSockets</h2>

        <p className="mb-4">
          A comunicação WebSocket é gerenciada através de Socket.IO com os
          seguintes eventos:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Evento</th>
                <th className="border p-2 text-left">Direção</th>
                <th className="border p-2 text-left">Descrição</th>
                <th className="border p-2 text-left">Payload</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-mono text-sm">connect</td>
                <td className="border p-2">Cliente ← Servidor</td>
                <td className="border p-2">Conexão estabelecida</td>
                <td className="border p-2">N/A</td>
              </tr>
              <tr>
                <td className="border p-2 font-mono text-sm">connected</td>
                <td className="border p-2">Cliente ← Servidor</td>
                <td className="border p-2">Autenticação confirmada</td>
                <td className="border p-2">
                  <code>{`{ success: boolean, userId: string }`}</code>
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-mono text-sm">notification</td>
                <td className="border p-2">Cliente ← Servidor</td>
                <td className="border p-2">Nova notificação</td>
                <td className="border p-2">
                  <code>FormattedNotification</code>
                </td>
              </tr>
              <tr>
                <td className="border p-2 font-mono text-sm">disconnect</td>
                <td className="border p-2">Cliente ↔ Servidor</td>
                <td className="border p-2">Desconexão</td>
                <td className="border p-2">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="validacao" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Validação com Zod</h2>

        <p className="mb-4">
          Todos os dados de notificação são validados usando Zod tanto no
          cliente quanto no servidor:
        </p>

        <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
          <pre>{`// Schema para notificação de equipe adicionada
export const teamAddedSchema = z.object({
  userId: z.string().uuid({ message: "ID de usuário inválido" }),
  teamId: z.string().min(1, { message: "ID da equipe é obrigatório" }),
  teamName: z.string().min(1, { message: "Nome da equipe é obrigatório" }),
  projectId: z.string().min(1, { message: "ID do projeto é obrigatório" }),
  projectName: z.string().optional().default("Projeto"),
});

// Uso no cliente ou servidor
const result = teamAddedSchema.safeParse(data);
if (result.success) {
  // Dados válidos
  const validData = result.data;
} else {
  // Erros de validação
  const errors = result.error.format();
}`}</pre>
        </div>
      </section>

      <section id="escalabilidade" className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Escalabilidade</h2>

        <p className="mb-4">
          O sistema foi projetado para escalar horizontalmente com múltiplas
          instâncias do servidor:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>PostgreSQL LISTEN/NOTIFY</strong>: Sincroniza eventos entre
            instâncias em tempo real
          </li>
          <li>
            <strong>Persistência</strong>: Todas as notificações são salvas no
            banco antes do envio
          </li>
          <li>
            <strong>Reconexão automática</strong>: WebSockets e PostgreSQL
            LISTEN têm mecanismos de retry
          </li>
          <li>
            <strong>Recuperação offline</strong>: Notificações não lidas são
            carregadas quando o usuário se conecta
          </li>
        </ul>

        <div className="border rounded-md p-4 mt-4 bg-blue-50">
          <h3 className="font-medium mb-2">Recomendações para produção</h3>
          <ul className="list-disc pl-6">
            <li>
              Usar sticky sessions no balanceador de carga para WebSockets
            </li>
            <li>
              Monitorar a tabela de notificações para crescimento e performance
            </li>
            <li>Implementar policy de retenção para notificações antigas</li>
            <li>
              Considerar Redis para armazenamento de estado de conexão em
              clusters grandes
            </li>
          </ul>
        </div>
      </section>

      <div className="border-t pt-6 mt-12">
        <p className="text-center text-gray-600">
          <Link href="/docs" className="text-blue-600 hover:underline">
            Voltar para a documentação principal
          </Link>
        </p>
      </div>
    </div>
  );
}
