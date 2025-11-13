import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ArticleContentProps {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
