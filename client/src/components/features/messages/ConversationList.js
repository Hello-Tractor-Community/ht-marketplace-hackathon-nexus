// Components/ConversationList.js
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, User, Package } from 'lucide-react';

const ConversationList = ({ conversations, onSelect, selectedId }) => {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      <div className="overflow-y-auto flex-1">
        {conversations.map((conv) => {
          const buyer = conv.participants.find(p => p.role === 'buyer').user;
          return (
            <div
              key={conv._id}
              onClick={() => onSelect(conv)}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                selectedId === conv._id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">
                      {buyer.firstName} {buyer.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span className="truncate">{conv.product.name}</span>
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;