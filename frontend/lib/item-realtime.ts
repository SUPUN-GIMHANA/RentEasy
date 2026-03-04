import { Client, IMessage, StompSubscription } from "@stomp/stompjs"
import SockJS from "sockjs-client"

export interface ItemRealtimeEvent {
  action: "CREATED" | "UPDATED" | "DELETED"
  itemId: string
  item?: any
}

const getWebSocketUrl = () => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"
  return apiBase.replace(/\/api\/?$/, "")
}

export const connectToItemUpdates = (onEvent: (event: ItemRealtimeEvent) => void) => {
  const wsBaseUrl = getWebSocketUrl()

  const client = new Client({
    webSocketFactory: () => new SockJS(`${wsBaseUrl}/ws`),
    reconnectDelay: 5000,
    debug: () => {
      // Keep debug logging disabled by default
    },
  })

  let subscription: StompSubscription | null = null

  client.onConnect = () => {
    subscription = client.subscribe("/topic/items", (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body) as ItemRealtimeEvent
        onEvent(payload)
      } catch {
        // Ignore malformed realtime payload
      }
    })
  }

  client.onStompError = () => {
    // Keep runtime resilient: no throw from transport-level errors
  }

  client.activate()

  return () => {
    subscription?.unsubscribe()
    client.deactivate()
  }
}
