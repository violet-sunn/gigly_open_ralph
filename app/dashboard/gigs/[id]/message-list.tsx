import { Message, User } from '@prisma/client'

type MessageWithSender = Message & {
  sender: User & {
    clientProfile: { companyName: string } | null
    specialistProfile: { displayName: string } | null
  }
}

interface MessageListProps {
  messages: MessageWithSender[]
  currentUserId: string
  gigClientId: string
}

export function MessageList({ messages, currentUserId, gigClientId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        No messages yet. Start the conversation below.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {messages.map((message) => {
        const senderName =
          message.sender.specialistProfile?.displayName ||
          message.sender.clientProfile?.companyName ||
          message.sender.email

        const isClientMessage = message.senderId === gigClientId
        const isOwnMessage = message.senderId === currentUserId

        return (
          <li key={message.id} className="pb-3 last:pb-0">
            <div className={`flex ${isClientMessage ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${
                isClientMessage
                  ? 'border-l-4 border-blue-500 pl-3 bg-blue-50'
                  : 'border-r-4 border-green-500 pr-3 bg-green-50'
              } p-3 rounded`}>
                <div className="flex justify-between items-start mb-1 gap-3">
                  <span className="text-sm font-medium text-gray-900">{senderName}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {message.createdAt.toLocaleString('ru-RU')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
