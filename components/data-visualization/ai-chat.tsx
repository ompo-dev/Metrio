"use client"

import * as React from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Message, DataPoint } from "./types"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

interface AIChatProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  isAiThinking: boolean
  currentMessage: string
  setCurrentMessage: React.Dispatch<React.SetStateAction<string>>
  handleSendMessage: () => void
  setShowAiChat: React.Dispatch<React.SetStateAction<boolean>>
  data: DataPoint[]
  activeSeries: string[]
}

export function AIChat({
  messages,
  setMessages,
  isAiThinking,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  setShowAiChat,
  data,
  activeSeries,
}: AIChatProps) {
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])
  
  // Lista de perguntas sugeridas
  const suggestedQuestions = [
    "Qual é a tendência geral das vendas?",
    "Quais são as categorias com melhor desempenho?",
    "Existe algum padrão sazonal nos dados?",
    "Pode me dar um resumo dos dados?",
    "Compare as categorias de produtos",
    "Mostre um exemplo de tabela em markdown",
  ]

  return (
    <div className="border-t">
      <div className="border-b bg-gray-50 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-700">Análise com IA</h3>
            <p className="text-[10px] sm:text-xs text-gray-500">Faça perguntas sobre seus dados</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0"
            onClick={() => setShowAiChat(false)}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px]">
        {/* Chat Messages */}
        <div ref={chatContainerRef} className="h-[200px] sm:h-[250px] md:h-[300px] overflow-y-auto border-r p-2 sm:p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("mb-2 sm:mb-4 flex", {
                "justify-end": message.role === "user",
              })}
            >
              {message.role === "assistant" && (
                <Avatar className="mr-2 h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs sm:text-sm">AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn("max-w-[85%] rounded-lg px-2 sm:px-4 py-1.5 sm:py-2", {
                  "bg-white text-gray-700": message.role === "assistant",
                  "bg-emerald-500 text-white": message.role === "user",
                })}
              >
                <div className={cn("text-xs sm:text-sm markdown-content", {
                  "markdown-content-dark": message.role === "user",
                })}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div
                  className={cn("mt-1 text-right text-[10px] sm:text-xs", {
                    "text-gray-400": message.role === "assistant",
                    "text-emerald-200": message.role === "user",
                  })}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isAiThinking && (
            <div className="mb-2 sm:mb-4 flex">
              <Avatar className="mr-2 h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs sm:text-sm">AI</AvatarFallback>
              </Avatar>
              <div className="max-w-[85%] rounded-lg bg-white px-2 sm:px-4 py-2 sm:py-3 text-gray-700">
                <div className="flex space-x-1">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div
                    className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div className="p-2 sm:p-4">
          <h4 className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium text-gray-700">Perguntas Sugeridas</h4>
          <div className="space-y-1 sm:space-y-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-xs sm:text-sm"
                onClick={() => {
                  setCurrentMessage(question)
                  setTimeout(() => {
                    handleSendMessage()
                  }, 100)
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t p-2 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-2"
        >
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Faça uma pergunta sobre os dados... (Markdown suportado)"
            className="min-h-[32px] sm:min-h-[40px] resize-none font-mono text-xs sm:text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-emerald-500 hover:bg-emerald-600"
            disabled={!currentMessage.trim() || isAiThinking}
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
} 