import { Message, User } from '@prisma/client'

type MessageWithSender = Message & {
  sender: User & {
    clientProfile: { companyName: string } | null
    specialistProfile: { displayName: string } | null
  }
}

interface MessageListProps {
  messages: MessageWithSender[]
}

export function MessageList({ messages }: MessageListProps) {
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

        return (
          <li key={message.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-gray-900">{senderName}</span>
              <span className="text-xs text-gray-400">
                {message.createdAt.toLocaleString('ru-RU')}
              </span>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{message.content}</p>
          </li>
        )
      })}
    </ul>
  )
}
