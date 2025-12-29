import { GameRecordPage } from "@/pages/game-record/ui/game-record-page";

interface PageProps {
  params: Promise<{
    gameId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { gameId } = await params;
  return <GameRecordPage gameId={gameId} />;
}
