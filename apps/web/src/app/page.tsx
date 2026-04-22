import { BrainCircuit, FileUp, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { IconButton } from '@/components/ui/icon-button';

export default function HelloPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <BrainCircuit className="w-16 h-16 text-foreground mb-8" />

      <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to your RAG BRAIN</h1>

      <p className="text-muted-foreground max-w-xl mb-10 text-lg">
        Transform your documents into an intelligent knowledge base. Parse your files to add them to
        the system's brain, then use the interactive chat to instantly retrieve answers and insights
        based on your data.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <Link href="/docs" className="w-full">
          <IconButton
            size="lg"
            variant="outline"
            icon={FileUp}
            label="Parse Docs"
            className="w-full"
          />
        </Link>
        <Link href="/chat" className="w-full">
          <IconButton
            size="lg"
            variant="outline"
            icon={MessageSquareText}
            label="Use Chat"
            className="w-full"
          />
        </Link>
      </div>
    </main>
  );
}
