import { Pool } from "pg";
import { FormattedNotification } from "@/types/notifications";
import { sendNotificationToUser } from "./socketio";

// Singleton para conexão PG LISTEN
let pgListenConnection: Pool | null = null;
let isListening = false;

interface NotificationPayload {
  event: string;
  userId: string;
  notification: FormattedNotification;
}

// Interface para eventos de notificação do Postgres
interface PgNotification {
  channel: string;
  payload?: string;
  processId?: number;
}

/**
 * Inicializa a conexão para escutar notificações do PostgreSQL
 */
export const initPgListen = async () => {
  if (isListening) return;

  try {
    // Criar uma conexão dedicada para o LISTEN
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1, // Apenas uma conexão para o LISTEN
    });

    // Testar a conexão
    const client = await pool.connect();

    // Configurar o cliente para escutar o canal de notificações
    await client.query("LISTEN notifications_channel");

    console.log("PG LISTEN conectado e escutando o canal de notificações");

    // Configurar o handler para notificações
    client.on("notification", (msg: PgNotification) => {
      try {
        if (!msg.payload) return;

        const payload: NotificationPayload = JSON.parse(msg.payload);

        if (payload.event === "new_notification") {
          // Reenviar a notificação para o usuário via WebSocket (em outras instâncias)
          sendNotificationToUser(payload.userId, payload.notification);
          console.log(
            `[PG NOTIFY] Notificação recebida para usuário ${payload.userId}`
          );
        }
      } catch (error) {
        console.error("Erro ao processar notificação do PostgreSQL:", error);
      }
    });

    // Configurar handlers de erro
    client.on("error", (err: Error) => {
      console.error("Erro na conexão LISTEN do PostgreSQL:", err);
      // Tentar reconectar após um tempo
      setTimeout(() => {
        isListening = false;
        initPgListen().catch(console.error);
      }, 5000);
    });

    // Armazenar a conexão e marcar como conectado
    pgListenConnection = pool;
    isListening = true;

    // Esta conexão não deve retornar ao pool
    // Será dedicada para o LISTEN
  } catch (error) {
    console.error("Erro ao inicializar PG LISTEN:", error);

    // Tentar reconectar após um tempo
    setTimeout(() => {
      isListening = false;
      initPgListen().catch(console.error);
    }, 5000);
  }
};

/**
 * Encerra a conexão LISTEN
 */
export const closePgListen = async () => {
  if (pgListenConnection) {
    await pgListenConnection.end();
    pgListenConnection = null;
    isListening = false;
    console.log("Conexão PG LISTEN encerrada");
  }
};
