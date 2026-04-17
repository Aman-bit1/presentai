import { useEffect, useState } from "react";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import { useAnalysis } from "@/contexts/AnalysisContext";
import VideoPlayer from "@/components/analysis/VideoPlayer";
import OverallScore from "@/components/analysis/OverallScore";
import CategoryScores from "@/components/analysis/CategoryScores";
import FeedbackList from "@/components/analysis/FeedbackList";
import DetailedAnalysis from "@/components/analysis/DetailedAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { exportToPDF } from "@/lib/exportPdf";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoAnalysis() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id);
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const { setCurrentEvaluationId, evaluation, isLoading, error, refetchEvaluation } = useAnalysis();

  useEffect(() => {
    setCurrentEvaluationId(id);
    let intervalId: number | undefined;
    if (evaluation && evaluation.status === "processing") {
      intervalId = window.setInterval(() => refetchEvaluation(), 3000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [id, evaluation?.status, setCurrentEvaluationId, refetchEvaluation]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(evaluation);
      toast({ title: "Export started", description: "Your PDF is being generated." });
    } catch (err) {
      toast({ title: "Export failed", description: err instanceof Error ? err.message : "Unable to export PDF", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-start flex-col gap-2">
              <span>{error.message || "An error occurred."}</span>
              <span className="text-sm text-destructive/80">Please try again or contact support.</span>
            </AlertDescription>
          </Alert>
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Something went wrong</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">We couldn't load your analysis.</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Header title={isLoading ? "Loading..." : `Analysis: ${evaluation?.title || "Presentation"}`} description="AI-powered feedback on your presentation" />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-slate-600 dark:text-slate-400">Loading your analysis...</p>
              </div>
            </div>
          </motion.div>
        ) : evaluation?.status === "processing" ? (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Analysis in Progress</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">We're analyzing your presentation...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card><CardContent className="p-6"><Skeleton className="h-4 w-40 mb-4" /><Skeleton className="aspect-video rounded-lg" /></CardContent></Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <VideoPlayer evaluation={evaluation} videoUrl={evaluation?.videoUrl || ""} />
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <Button onClick={handleExportPDF} disabled={isExporting || isLoading || evaluation?.status === "processing"} className="w-full mb-4" variant="outline">
                  {isExporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting...</> : <><Download className="mr-2 h-4 w-4" />Export as PDF</>}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent><p>Download your analysis report as a PDF</p></TooltipContent>
          </Tooltip>

          {isLoading ? (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}><Card><CardContent className="p-6"><Skeleton className="h-4 w-40 mb-4" /><Skeleton className="h-36 w-36 rounded-full mx-auto mb-4" /><Skeleton className="h-4 w-full" /></CardContent></Card></motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}><Card><CardContent className="p-6"><Skeleton className="h-4 w-40 mb-4" /><div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-2 w-full rounded-full" /></div>)}</div></CardContent></Card></motion.div>
            </>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}><OverallScore evaluation={evaluation} /></motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}><CategoryScores evaluation={evaluation} /></motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}><FeedbackList evaluation={evaluation} /></motion.div>
            </>
          )}
        </div>
      </div>

      <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        {isLoading ? <Card><CardContent className="p-6"><Skeleton className="h-4 w-40 mb-4" /><Skeleton className="h-64 w-full rounded-lg" /></CardContent></Card> : <DetailedAnalysis evaluation={evaluation} />}
      </motion.div>
    </div>
  );
}
