import type { Evaluation, FeedbackItem } from "../../../shared/schema";

export async function exportToPDF(evaluation: Evaluation | null): Promise<void> {
  if (!evaluation) {
    throw new Error("No evaluation data to export");
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Unable to open print window. Please check your popup blocker settings.");
  }

  const feedback = evaluation.feedback || [];
  const overallScore = evaluation.overallScore || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getCategoryScore = (score: number | null): number => score || 0;

  const formatFeedbackType = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "positive": return { label: "Strength", class: "strength" };
      case "negative": return { label: "Improvement", class: "improvement" };
      default: return { label: "Suggestion", class: "suggestion" };
    }
  };

  const feedbackItemsHtml = feedback.map((item) => {
    const ft = formatFeedbackType(item.type);
    return `<li class="feedback-item"><span class="feedback-type ${ft.class}">${ft.label}</span><p class="feedback-text">${item.message}</p></li>`;
  }).join("");

  const printContent = `<!DOCTYPE html><html><head><title>PresentAI - ${evaluation.title || "Presentation Analysis"}</title><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;line-height:1.6;color:#1f2937;padding:40px;max-width:800px;margin:0 auto}.header{text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:2px solid #6366f1}.header h1{font-size:28px;color:#4f46e5;margin-bottom:8px}.header p{color:#6b7280;font-size:14px}.score-section{display:flex;align-items:center;justify-content:center;margin:40px 0;padding:30px;background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%);border-radius:16px}.score-circle{width:140px;height:140px;border-radius:50%;background:conic-gradient(${getScoreColor(overallScore)} ${overallScore}%,#e5e7eb 0);display:flex;align-items:center;justify-content:center}.score-inner{width:110px;height:110px;border-radius:50%;background:white;display:flex;flex-direction:column;align-items:center;justify-content:center}.score-value{font-size:36px;font-weight:700;color:${getScoreColor(overallScore)}}.score-label{font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px}.section{margin:30px 0}.section-title{font-size:18px;font-weight:600;color:#4f46e5;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #e5e7eb}.category-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.category-card{padding:16px;background:#f9fafb;border-radius:12px;border-left:4px solid ${getScoreColor(getCategoryScore(evaluation.confidenceScore))}}.category-name{font-size:14px;font-weight:500;color:#374151;margin-bottom:4px}.category-value{font-size:24px;font-weight:700;color:${getScoreColor(getCategoryScore(evaluation.confidenceScore))}}.feedback-list{list-style:none}.feedback-item{padding:16px;margin-bottom:12px;background:#f9fafb;border-radius:12px;border-left:4px solid #6366f1}.feedback-type{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;text-transform:uppercase;margin-bottom:8px}.feedback-type.improvement{background:#fef3c7;color:#92400e}.feedback-type.strength{background:#d1fae5;color:#065f46}.feedback-type.suggestion{background:#dbeafe;color:#1e40af}.feedback-text{font-size:14px;color:#374151}.footer{margin-top:50px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#9ca3af}</style></head><body><div class="header"><h1>PresentAI Analysis Report</h1><p>${evaluation.title || "Presentation Evaluation"}</p><p class="date">Generated on ${new Date().toLocaleDateString()}</p></div><div class="score-section"><div class="score-circle"><div class="score-inner"><span class="score-value">${overallScore}</span><span class="score-label">Overall Score</span></div></div></div><div class="section"><h2 class="section-title">Category Scores</h2><div class="category-grid"><div class="category-card"><div class="category-name">Confidence</div><div class="category-value">${getCategoryScore(evaluation.confidenceScore)}%</div></div><div class="category-card"><div class="category-name">Facial Expressions</div><div class="category-value">${getCategoryScore(evaluation.facialExpressionsScore)}%</div></div><div class="category-card"><div class="category-name">Eye Contact</div><div class="category-value">${getCategoryScore(evaluation.eyeContactScore)}%</div></div><div class="category-card"><div class="category-name">Body Language</div><div class="category-value">${getCategoryScore(evaluation.bodyLanguageScore)}%</div></div></div></div>${feedback.length > 0 ? `<div class="section"><h2 class="section-title">Feedback & Recommendations</h2><ul class="feedback-list">${feedbackItemsHtml}</ul></div>` : ""}<div class="footer"><p>Powered by PresentAI - AI-Powered Presentation Coach</p></div><script>window.onload=function(){setTimeout(function(){window.print();window.onafterprint=function(){window.close()}},500)}</script></body></html>`;

  printWindow.document.write(printContent);
  printWindow.document.close();
}
