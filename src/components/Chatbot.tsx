import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import { chatService } from '@/services/chatService'
import type { Message } from '@/services/chatService'
import { MessageCircle, X, Send, Loader2, Bot, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [isAIThinking, setIsAIThinking] = useState(false)
    const [chatId, setChatId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { user } = useAuthStore()

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Load chat history khi mở chatbot
    useEffect(() => {
        if (isOpen) {
            loadChatHistory()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const loadChatHistory = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để sử dụng chatbot', {
                description: 'Chatbot yêu cầu đăng nhập',
            })
            setIsOpen(false)
            return
        }

        setIsLoading(true)
        try {
            // Lấy danh sách chats của user (mỗi user chỉ có 1 chat duy nhất)
            const chatsResponse = await chatService.getChats()
            console.log('📋 Chats response:', chatsResponse)

            // Nếu user đã có chat, load messages từ chat đó
            if (chatsResponse.data && chatsResponse.data.length > 0) {
                const userChat = chatsResponse.data[0] // Lấy chat duy nhất
                setChatId(userChat._id)

                // Load tất cả messages cũ từ chat này
                const messagesResponse = await chatService.getMessages(userChat._id)
                console.log('💬 Messages loaded:', messagesResponse.data)
                setMessages(messagesResponse.data)
            } else {
                // User chưa có chat nào, sẽ tạo mới khi gửi tin nhắn đầu tiên
                setMessages([])
                setChatId(null)
            }
        } catch (error) {
            console.error('❌ Failed to load chat history:', error)
            toast.error('Không thể tải lịch sử chat', {
                description: 'Vui lòng thử lại sau',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error('Vui lòng đăng nhập để gửi tin nhắn')
            return
        }

        if (!inputMessage.trim() || isSending) return

        const messageContent = inputMessage.trim()
        setInputMessage('')
        setIsSending(true)

        // Tạo temporary message để hiển thị ngay lập tức
        const tempUserMessage: Message = {
            _id: `temp-${Date.now()}`,
            chatId: chatId || '',
            accountId: user?.id || '',
            content: messageContent,
            role: 'user',
            createdAt: new Date().toISOString(),
        }

        // Hiển thị tin nhắn của user ngay lập tức
        if (chatId) {
            setMessages((prev) => [...prev, tempUserMessage])
        } else {
            setMessages([tempUserMessage])
        }

        // Hiển thị AI thinking indicator
        setIsAIThinking(true)

        // Debug: Check token
        const token = localStorage.getItem('access_token')
        console.log('🔑 Token check:', token ? 'Token exists' : 'No token found')

        try {
            if (chatId) {
                // Gửi tin nhắn vào chat đã có
                const response = await chatService.sendMessage(chatId, {
                    content: messageContent,
                })

                console.log('✅ Chat response:', response)

                // Replace temp message với message thật và thêm AI response
                setMessages((prev) => [
                    ...prev.filter((m) => m._id !== tempUserMessage._id),
                    response.userMessage,
                    response.assistantMessage,
                ])
            } else {
                // Tạo chat mới với AI bot
                const response = await chatService.createChat({
                    content: messageContent,
                })

                console.log('✅ Chat created:', response)

                // Set chatId sau khi tạo chat mới
                setChatId(response.chatId)

                // Replace temp message và add AI response
                setMessages([response.userMessage, response.assistantMessage])
            }
        } catch (error) {
            // Xóa temp message nếu có lỗi
            setMessages((prev) => prev.filter((m) => m._id !== tempUserMessage._id))

            const err = error as { response?: { data?: { message?: string }; status?: number } }

            // Hiển thị thông báo lỗi chi tiết hơn
            if (err.response?.status === 500) {
                toast.error('Lỗi máy chủ. AI đang gặp sự cố, vui lòng thử lại sau.', {
                    description: err.response?.data?.message || 'Server không phản hồi',
                    duration: 5000,
                })
            } else if (err.response?.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn', {
                    description: 'Vui lòng đăng nhập lại',
                })
            } else {
                toast.error('Không thể gửi tin nhắn', {
                    description: err.response?.data?.message || 'Vui lòng thử lại',
                })
            }

            // Khôi phục input nếu gửi thất bại
            setInputMessage(messageContent)
        } finally {
            setIsAIThinking(false)
            setIsSending(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh')
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh không được vượt quá 5MB')
            return
        }

        if (!chatId) {
            toast.error('Vui lòng gửi tin nhắn đầu tiên trước khi gửi ảnh')
            return
        }

        setIsSending(true)
        try {
            const response = await chatService.sendImage(chatId, {
                image: file,
                content: 'Hãy phân tích ảnh này giúp tôi',
            })

            // Add cả user message (ảnh) và AI response
            setMessages((prev) => [
                ...prev,
                response.userMessage,
                response.assistantMessage,
            ])

            toast.success('Đã gửi ảnh thành công!')
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } }
            toast.error(err.response?.data?.message || 'Không thể gửi ảnh')
        } finally {
            setIsSending(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <>
            {/* Chat Button - Fixed position - Chỉ hiển thị khi đã đăng nhập */}
            {!isOpen && user && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-linear-to-r from-primary to-orange-500 hover:scale-110 transition-transform duration-200 z-9999"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-3xl z-9999 flex flex-col border border-border bg-white dark:bg-neutral-900 bg-opacity-100 backdrop-filter-none text-foreground rounded-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-white dark:bg-neutral-900 bg-opacity-100 backdrop-filter-none">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border border-border">
                                    <AvatarImage src="/ai-bot-avatar.png" alt="AI Assistant" />
                                    <AvatarFallback className="bg-linear-to-br from-primary to-orange-500 text-white">
                                        <Bot className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary dark:text-orange-400 drop-shadow">Trợ lý AI</h3>
                                <p className="text-xs text-primary dark:text-orange-300 font-semibold">Luôn trực tuyến</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-accent"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-neutral-900 bg-opacity-100 backdrop-filter-none text-white dark:text-foreground">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                                <div className="p-4 bg-muted rounded-full">
                                    <Bot className="h-12 w-12 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-2">Xin chào!</h4>
                                    <p className="text-sm text-white/80 dark:text-muted-foreground flex flex-col items-center gap-2">
                                        Tôi là trợ lý AI của MLN122.
                                        <span className="flex items-center gap-1 justify-center">
                                            Hỏi tôi về kinh tế Việt Nam nhé!
                                            <MessageCircle className="inline-block h-4 w-4 text-primary ml-1" />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => {
                                const isAI = message.role === 'assistant'
                                const isUser = message.role === 'user'

                                return (
                                    <div
                                        key={message._id}
                                        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'
                                            }`}
                                    >
                                        <Avatar className="h-8 w-8 shrink-0">
                                            {isAI ? (
                                                <AvatarFallback className="bg-linear-to-br from-primary to-orange-500 text-white">
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            ) : (
                                                <>
                                                    <AvatarImage src={user?.avatar || undefined} />
                                                    <AvatarFallback className="bg-primary text-white">
                                                        {user?.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </>
                                            )}
                                        </Avatar>
                                        <div
                                            className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'
                                                }`}
                                        >
                                            <div
                                                className={`rounded-2xl px-4 py-2 ${isUser
                                                    ? 'bg-linear-to-r from-primary to-orange-500 text-white'
                                                    : 'bg-neutral-800 text-white dark:bg-muted dark:text-foreground border border-border'
                                                    }`}
                                            >
                                                {message.mediaUrl && message.mediaType === 'image' && (
                                                    <img
                                                        src={message.mediaUrl}
                                                        alt="Uploaded"
                                                        className="max-w-full h-auto rounded-lg mb-2"
                                                    />
                                                )}
                                                {message.content && (
                                                    <div className={`text-sm ${isUser ? 'text-white' : 'text-white dark:text-foreground'}`}>
                                                        {/* Format tin nhắn AI với line breaks và styling */}
                                                        {isAI ? (
                                                            <div className="space-y-2">
                                                                {message.content.split('\n').map((paragraph, idx) => {
                                                                    // Kiểm tra nếu là tiêu đề (bắt đầu bằng ###, ##, #)
                                                                    if (paragraph.startsWith('### ')) {
                                                                        return (
                                                                            <h4 key={idx} className="font-bold text-base mt-3 mb-1">
                                                                                {paragraph.replace('### ', '')}
                                                                            </h4>
                                                                        )
                                                                    }
                                                                    if (paragraph.startsWith('## ')) {
                                                                        return (
                                                                            <h3 key={idx} className="font-bold text-lg mt-3 mb-2">
                                                                                {paragraph.replace('## ', '')}
                                                                            </h3>
                                                                        )
                                                                    }
                                                                    if (paragraph.startsWith('# ')) {
                                                                        return (
                                                                            <h2 key={idx} className="font-bold text-xl mt-4 mb-2">
                                                                                {paragraph.replace('# ', '')}
                                                                            </h2>
                                                                        )
                                                                    }

                                                                    // Kiểm tra nếu là list item (bắt đầu bằng - hoặc *)
                                                                    if (paragraph.match(/^[-*]\s/)) {
                                                                        return (
                                                                            <div key={idx} className="flex gap-2 items-start ml-2">
                                                                                <span className="text-primary mt-1">•</span>
                                                                                <span className="flex-1">
                                                                                    {paragraph.replace(/^[-*]\s/, '')}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    }

                                                                    // Kiểm tra nếu là numbered list (bắt đầu bằng số.)
                                                                    if (paragraph.match(/^\d+\.\s/)) {
                                                                        const number = paragraph.match(/^(\d+)\./)?.[1]
                                                                        return (
                                                                            <div key={idx} className="flex gap-2 items-start ml-2">
                                                                                <span className="text-primary font-semibold mt-0.5">{number}.</span>
                                                                                <span className="flex-1">
                                                                                    {paragraph.replace(/^\d+\.\s/, '')}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    }

                                                                    // Paragraph thông thường
                                                                    if (paragraph.trim()) {
                                                                        return (
                                                                            <p key={idx} className="leading-relaxed">
                                                                                {paragraph}
                                                                            </p>
                                                                        )
                                                                    }

                                                                    // Empty line for spacing
                                                                    return <div key={idx} className="h-2" />
                                                                })}
                                                            </div>
                                                        ) : (
                                                            // User message - simple display
                                                            <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                                                                {message.content}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-white/60 dark:text-muted-foreground mt-1 px-1">
                                                {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}

                        {/* AI Thinking Indicator */}
                        {isAIThinking && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="bg-linear-to-br from-primary to-orange-500 text-white">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <div className="rounded-2xl px-4 py-3 bg-muted">
                                        <div className="flex gap-1 items-center">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-white/60 dark:text-muted-foreground mt-1 px-1">
                                        Đang suy nghĩ...
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSendMessage}
                        className="p-4 border-t bg-background text-white dark:text-foreground"
                    >
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <Button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSending}
                                variant="outline"
                                size="icon"
                                className="h-11 w-11 shrink-0 border-2 hover:bg-accent"
                            >
                                <ImagePlus className="h-5 w-5" />
                            </Button>
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Nhập câu hỏi của bạn..."
                                disabled={isSending}
                                className="flex-1 h-11 border-2 focus:border-primary text-white placeholder:text-white/60 dark:text-foreground dark:placeholder:text-muted-foreground"
                            />
                            <Button
                                type="submit"
                                disabled={!inputMessage.trim() || isSending}
                                className="h-11 w-11 p-0 bg-linear-to-r from-primary to-orange-500 hover:opacity-90"
                                size="icon"
                            >
                                {isSending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-white/70 dark:text-muted-foreground mt-2 text-center">
                            <Bot /> Được hỗ trợ bởi AI - Có thể có sai sót
                        </p>
                    </form>
                </Card>
            )}
        </>
    )
}
