interface ArticleContentProps {
  content: string
}

// Render article content as HTML. The project previously used `react-markdown`.
// To avoid adding a new dependency for this build, render the content
// directly via `dangerouslySetInnerHTML`. Ensure server provides safe HTML.
export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none mb-10"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
