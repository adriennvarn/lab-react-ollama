import { useState } from "react"
import Ollama from "ollama"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function OllamaChat() {
    // Add state for input, messages, loading, and error.
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAsk = async () => {
        // Prevent empty submissions and duplicate submissions while loading.
        if (!input.trim() || isLoading) return
        // Create a user message object.
        const newMessage = {
            role: "user",
            content: input.trim()
        }
        // Add the user message to the message thread.
        const updatedMessages = [...messages, newMessage]
        setMessages(updatedMessages)
        // Clear the input, reset errors, and turn loading on.
        setInput("")
        setError("")
        setIsLoading(true)
        // Call Ollama.chat with model "llama3.2" and the updated message history.
        try {
            const res = await Ollama.chat({
                model: "llama3.2",
                messages: updatedMessages
            })
            // Add the assistant response to the message thread.
            const assistantMessage = res.message
            setMessages((prevMessages) => ([...prevMessages, assistantMessage]))
        }
        catch (err) {
            // Show a helpful error if the request fails.
            console.error(err)
            setError("Failed to get response from Ollama")
        }
        finally {
            // Turn loading off after success or failure.
            setIsLoading(false)
        }
    }

    const clearChat = () => {
        setInput("")
        setMessages([])
        setError("")
    }

    return (
        <section className="chat-shell">
            <div className="chat-card">
                <header className="chat-header">
                    <h1>HR Help Assistant</h1>
                    <p>
                        Build a local AI chatbot prototype that helps employees ask general HR questions.
                    </p>
                </header>

                <p className="chat-guidance">
                    Ask about general HR topics such as benefits, time off, policies, or workplace procedures.
                    Do not enter private, sensitive, or personal information.
                </p>

                <div className="chat-input-area">
                    <label htmlFor="chat-prompt" className="sr-only">
                        Ask the HR assistant
                    </label>
                    <textarea
                        id="chat-prompt"
                        rows="5"
                        className="chat-textarea"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about benefits, PTO, or workplace policies..."
                    />
                </div>

                {/* Configure buttons */}
                <div className="chat-actions">
                    <button className="chat-button" onClick={handleAsk} disabled={!input.trim()}>Send</button>
                    <button className="chat-button chat-button-secondary" onClick={clearChat} disabled={messages.length === 0}>Clear thread</button>
                </div>

                <div className="message-list" aria-label="Conversation thread">
                    {/* Render user and assistant messages here. */}
                    {messages.map((msg, i) => (
                        <article key={i} className={`message message-${msg.role}`}>
                            <div className="message-label">
                                {msg.role === "user" ? "You" : "Assistant"}
                            </div>
                            <div className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </article>
                    ))
                    }

                    {/* Render a temporary Assistant / Thinking... message while loading. */}
                    {isLoading && (
                        <article className="message message-assistant">
                            <div className="message-label">Assistant</div>
                            <p>Thinking...</p>
                        </article>
                    )}
                </div>

                <div>
                    {error && (
                        <p style={{color: "red"}}>Error: {error}</p>
                    )}
                </div>
            </div>
        </section>
    )
}