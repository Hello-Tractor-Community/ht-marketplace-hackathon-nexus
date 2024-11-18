// Components/ConversationList.js
const ConversationList = ({ conversations, onSelect, selectedId, userPresence, typingUsers }) => {
  const getPresenceIndicator = (userId) => {
    const presence = userPresence[userId] || { status: 'offline' };
    const colors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-400'
    };
    
    return {
      color: colors[presence.status],
      text: presence.status === 'away' 
        ? 'Away' 
        : presence.status === 'online' 
          ? 'Online'
          : 'Offline'
    };
  };

  return (
    <div className="flex flex-col h-full border-r">
      {conversations.map((conv) => {
        const buyer = conv.participants.find(p => p.role === 'buyer').user;
        const presence = getPresenceIndicator(buyer._id);
        const isTyping = (typingUsers[conv._id] || []).length > 0;
        
        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
              selectedId === conv._id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${presence.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate">
                    {buyer.firstName} {buyer.lastName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {presence.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span className="truncate">{conv.product.name}</span>
                  </div>
                {isTyping ? (
                  <p className="text-sm text-gray-600 italic">
                    Typing...
                  </p>
                ) : (
                  conv.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage.content}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
