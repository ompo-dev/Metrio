"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Bell, AlertCircle, CheckCircle } from "lucide-react"

export function WebhookStatusIndicator() {
  const [lastEvents, setLastEvents] = useState<{
    count: number;
    timestamp: Date;
    status: "success" | "error";
    message?: string;
  }>({ count: 0, timestamp: new Date(), status: "success" });
  
  useEffect(() => {
    // Simular recebimento de eventos a cada 8-15 segundos
    const interval = setInterval(() => {
      const isSuccess = Math.random() > 0.1; // 90% chance de sucesso
      setLastEvents({
        count: lastEvents.count + 1,
        timestamp: new Date(),
        status: isSuccess ? "success" : "error",
        message: isSuccess ? undefined : "Timeout ao processar webhook"
      });
    }, 8000 + Math.random() * 7000);
    
    return () => clearInterval(interval);
  }, [lastEvents]);
  
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Status dos Webhooks</p>
              <p className="text-xs text-muted-foreground">
                {lastEvents.count > 0 
                  ? `Último evento recebido há ${Math.floor((new Date().getTime() - lastEvents.timestamp.getTime()) / 1000)} segundos`
                  : "Aguardando eventos..."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={lastEvents.status === "success" ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {lastEvents.status === "success" 
                ? <><CheckCircle className="h-3 w-3" /> Operacional</> 
                : <><AlertCircle className="h-3 w-3" /> Erro</>}
            </Badge>
            
            <Badge variant="outline" className="ml-2">
              {lastEvents.count} eventos hoje
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 