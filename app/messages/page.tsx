"use client"

import * as React from "react"
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const conversations = [
  {
    id: 1,
    name: "John Smith",
    company: "TechCorp Solutions",
    lastMessage: "Perfecto, nos vemos entonces el viernes",
    time: "10:30 AM",
    unread: 2,
    avatar: "/avatars/1.png",
  },
  {
    id: 2,
    name: "Jane Doe",
    company: "StartupXYZ",
    lastMessage: "¿Podríamos agendar una reunión para revisar el proyecto?",
    time: "Ayer",
    unread: 0,
    avatar: "/avatars/2.png",
  },
  {
    id: 3,
    name: "Robert Johnson",
    company: "BigCo Enterprise",
    lastMessage: "El pago ya fue procesado",
    time: "2 días",
    unread: 0,
    avatar: "/avatars/3.png",
  },
  {
    id: 4,
    name: "Maria Garcia",
    company: "DevServices Pro",
    lastMessage: "Gracias por la actualización",
    time: "3 días",
    unread: 1,
    avatar: "/avatars/4.png",
  },
]

const messages = [
  {
    id: 1,
    sender: "me",
    content: "Hola John, ¿cómo estás?",
    time: "9:00 AM",
  },
  {
    id: 2,
    sender: "John Smith",
    content: "Muy bien gracias, ¿y tú?",
    time: "9:15 AM",
  },
  {
    id: 3,
    sender: "me",
    content: "Excelente. Quería confirmar nuestra reunión del viernes",
    time: "9:20 AM",
  },
  {
    id: 4,
    sender: "John Smith",
    content: "Perfecto, nos vemos entonces el viernes",
    time: "10:30 AM",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = React.useState(
    conversations[0]
  )
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground">
          Comunicación con clientes y equipo
        </p>
      </div>

      {/* Messages Interface */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Conversaciones</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation.id === conversation.id
                      ? "bg-accent"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {conversation.name}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {conversation.company}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.time}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>
                    {selectedConversation.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {selectedConversation.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedConversation.company}
                  </CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    Marcar como favorito
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    Archivar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar conversación
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.sender === "me"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder="Escribe un mensaje..."
                className="min-h-[60px] resize-none"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
