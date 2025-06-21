
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug } from '@/lib/blog-posts';
import { AdBanner } from '@/components/AdBanner';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - PDFry',
      description: 'The blog post you are looking for does not exist.'
    }
  }

  return {
    title: `${post.title} - PDFry`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.imageUrl],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      <article className="prose dark:prose-invert lg:prose-xl max-w-none">

        <header className="mb-8 not-prose">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
            </div>
          </div>
        </header>

        <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden not-prose">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="blog post"
          />
        </div>

        <AdBanner className="my-8 not-prose" />
        
        <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}
