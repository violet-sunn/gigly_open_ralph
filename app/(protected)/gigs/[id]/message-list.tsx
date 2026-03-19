import { Message, User } from '@prisma/client'
import EmptyState from '@/app/components/onboarding/EmptyState'

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
      <EmptyState
        icon="💬"
        heading="No Messages Yet"
        description="Start the conversation! Use messages to clarify requirements, share updates, and coordinate work."
      />
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const senderName =
          message.sender.specialistProfile?.displayName ||
          message.sender.clientProfile?.companyName ||
          message.sender.email

        const isClientMessage = message.senderId === gigClientId
        const isOwnMessage = message.senderId === currentUserId

        return (
          <div key={message.id} className="pb-3 last:pb-0">
            <div className={`flex ${isClientMessage ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${
                isClientMessage
                  ? 'border-l-4 border-blue-500 pl-3 bg-blue-500/10'
                  : 'border-r-4 border-success-500 pr-3 bg-success-500/10'
              } p-3 rounded`}>
                <div className="flex justify-between items-start mb-1 gap-3">
                  <span className="text-sm font-medium text-white">{senderName}</span>
                  <span className="text-xs text-gray-300 whitespace-nowrap">
                    {message.createdAt.toLocaleString('ru-RU')}
                  </span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
