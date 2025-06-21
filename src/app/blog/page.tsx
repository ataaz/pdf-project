
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { blogPosts, type BlogPost } from '@/lib/blog-posts';
import { AdBanner } from '@/components/AdBanner';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogCard = ({ post }: { post: BlogPost }) => (
  <Link href={`/blog/${post.slug}`} className="block group">
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30">
      <div className="relative aspect-video">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="blog post"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{post.date}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{post.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="p-0">
          Read More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  </Link>
);


export default function BlogPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Our Blog</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Insights, tips, and updates from the PDFry team.
        </p>
      </header>
      <AdBanner className="mb-8" />
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </main>
    </div>
  );
}
