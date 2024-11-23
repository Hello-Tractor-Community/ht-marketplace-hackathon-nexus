import React from "react";

const MessageBox = ({
  conversation,
  messages,
  fetchingMessages,
  closeOverlay,
}) => {
    console.log("messages..", messages);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "500px",
          maxHeight: "80%",
          overflowY: "auto",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Conversation with {conversation.admin ? "Admin" : "Buyer"}</h2>

        {fetchingMessages ? (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p>Loading...</p>
          </div>
        ) : (
          <div
            style={{
              margin: "20px 0",
              maxHeight: "60vh",
              overflowY: "scroll",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  style={{
                    marginBottom: "15px",
                    textAlign:
                      message.sender._id === conversation.admin
                        ? "right"
                        : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      maxWidth: "70%",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor:
                        message.sender._id === conversation.admin
                          ? "#cce5ff"
                          : "#e2e3e5",
                      color: "#333",
                      textAlign: "left",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "bold",
                      }}
                    >
                      {message.sender.firstName} {message.sender.lastName}
                    </p>
                    <p style={{ margin: "5px 0" }}>{message.content}</p>
                    <small>
                      {new Intl.DateTimeFormat("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Africa/Nairobi",
                      }).format(new Date(message.createdAt))}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "gray" }}>
                No messages to display.
              </p>
            )}
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <textarea
            rows="4"
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Type your response..."
          ></textarea>
          <div style={{ textAlign: "right" }}>
            <button
              onClick={closeOverlay}
              style={{
                marginRight: "10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
