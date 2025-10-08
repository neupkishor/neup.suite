
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection } from "@/firebase";
import { useFirestore } from "@/firebase/provider";
import { collection, CollectionReference } from "firebase/firestore";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Article = {
    id: string;
    title: string;
    status: string;
};

function ArticleCard({ article }: { article: Article }) {
    return (
        <Card>
            <CardContent className="p-4">
                <Link href={`/knowledge/${article.id}`} className="font-semibold text-lg hover:underline">{article.title}</Link>
                <p className="text-sm text-muted-foreground">{article.status}</p>
            </CardContent>
        </Card>
    )
}

export default function KnowledgePage() {
    const firestore = useFirestore();

    const articlesCollection = useMemo(() => {
        if (!firestore) return null;
        return collection(firestore, 'knowledge') as CollectionReference<Article>;
    }, [firestore]);

    const { data: articles, loading } = useCollection<Article>(articlesCollection);

  return (
    <div className="space-y-6">
        <CardHeader className="p-0">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="font-headline text-2xl">Knowledge Base</CardTitle>
                    <CardDescription>
                    Browse and manage your internal knowledge base.
                    </CardDescription>
                </div>
                <Button asChild>
                    <Link href="/knowledge/add">Add Article</Link>
                </Button>
            </div>
        </CardHeader>
      <div className="space-y-4">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {articles?.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
       {!loading && articles?.length === 0 && (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                No articles found.
            </CardContent>
        </Card>
      )}
    </div>
  );
}
