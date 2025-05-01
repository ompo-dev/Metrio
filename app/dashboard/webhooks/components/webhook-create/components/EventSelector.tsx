import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { availableEvents } from "../constants";

interface EventSelectorProps {
  events: string[];
  setEvents: React.Dispatch<React.SetStateAction<string[]>>;
}

export function EventSelector({ events, setEvents }: EventSelectorProps) {
  const addEvent = (event: string) => {
    if (!events.includes(event)) {
      setEvents([...events, event]);
      console.log(`Evento adicionado: ${event}`);
    }
  };

  const removeEvent = (event: string) => {
    setEvents(events.filter((e) => e !== event));
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">
        Eventos
        <span className="text-sm font-normal ml-2 text-muted-foreground">
          Selecione quais eventos irão acionar este webhook
        </span>
      </Label>

      <div className="flex flex-wrap gap-2 mb-4">
        {events.map((event) => (
          <Badge key={event} variant="secondary" className="px-2 py-1">
            {event}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEvent(event)}
              className="h-4 w-4 ml-1 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {events.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Nenhum evento selecionado. O webhook responderá ao evento
            "custom.event".
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableEvents.map((category) => (
          <div key={category.category} className="border rounded-md p-3">
            <h3 className="font-medium mb-2">{category.category}</h3>
            <div className="space-y-2">
              {category.events.map((event) => (
                <div key={event} className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addEvent(event)}
                    className="h-7 w-7 p-0 mr-2"
                    disabled={events.includes(event)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{event}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
