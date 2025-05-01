import { Client } from "pg";
import { FormattedNotification } from "@/types/notifications";
import { sendNotificationToUser } from "./socketio";

// Canal PostgreSQL para pub/sub
const NOTIFICATION_CHANNEL = "server_notifications";

// Cliente PostgreSQL para pub/sub
let client: Client | null = null;

// Interface para mensagens publicadas no canal
interface PubSubMessage {
  userId: string;
  notification: FormattedNotification;
}

/**
 * Inicializa o sistema PubSub com PostgreSQL LISTEN/NOTIFY
 * Estabelece conexão com o banco e configura listeners
 */
export async function initPubSub() {
  try {
    // Usar a mesma string de conexão da aplicação
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL não definida no ambiente");
    }

    // Criar cliente PostgreSQL dedicado para pub/sub
    client = new Client({
      connectionString: dbUrl,
    });

    await client.connect();
    console.log("PubSub: Conectado ao PostgreSQL");

    // Configurar listener para o canal de notificações
    await client.query(`LISTEN ${NOTIFICATION_CHANNEL}`);

    // Configurar handler para notificações recebidas
    client.on("notification", async (msg) => {
      if (msg.channel === NOTIFICATION_CHANNEL && msg.payload) {
        try {
          // Processar a mensagem recebida
          const data: PubSubMessage = JSON.parse(msg.payload);
          console.log(
            `PubSub: Notificação recebida para usuário ${data.userId}`
          );

          // Tentar enviar via WebSocket
          sendNotificationToUser(data.userId, data.notification);
        } catch (err) {
          console.error("PubSub: Erro ao processar notificação:", err);
        }
      }
    });

    // Configurar handler para erros
    client.on("error", (err) => {
      console.error("PubSub: Erro na conexão PostgreSQL:", err);
      // Tentar reconectar
      setTimeout(() => {
        if (client) {
          client.end();
          client = null;
        }
        initPubSub().catch(console.error);
      }, 5000);
    });

    return true;
  } catch (err) {
    console.error("PubSub: Falha ao inicializar:", err);
    throw err;
  }
}

/**
 * Publica uma notificação no canal PubSub
 * Primeiro tenta enviar diretamente via WebSocket, depois publica no canal
 * para outras instâncias do servidor
 */
export async function publishNotification(
  userId: string,
  notification: FormattedNotification
): Promise<boolean> {
  try {
    // Tentar enviar diretamente via WebSocket primeiro
    const sent = sendNotificationToUser(userId, notification);

    // Publicar no canal para outras instâncias do servidor
    if (client) {
      const message: PubSubMessage = { userId, notification };
      await client.query(`NOTIFY ${NOTIFICATION_CHANNEL}, $1`, [
        JSON.stringify(message),
      ]);
      console.log(`PubSub: Notificação publicada para usuário ${userId}`);
      return true;
    } else {
      console.warn(
        "PubSub: Cliente não inicializado, não foi possível publicar"
      );
      return sent; // Retorna se conseguiu enviar via WebSocket
    }
  } catch (err) {
    console.error("PubSub: Erro ao publicar notificação:", err);
    return false;
  }
}

/**
 * Fecha a conexão com o PostgreSQL
 */
export async function closePubSub() {
  if (client) {
    try {
      await client.end();
      client = null;
      console.log("PubSub: Conexão encerrada");
      return true;
    } catch (err) {
      console.error("PubSub: Erro ao fechar conexão:", err);
      return false;
    }
  }
  return true;
}
