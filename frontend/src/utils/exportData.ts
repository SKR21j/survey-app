import { SurveyResponse } from '../types/Response';
import { Survey } from '../types/Survey';

export function exportToCSV(survey: Survey, responses: SurveyResponse[]): void {
  const headers = ['Response ID', 'Submitted At', ...survey.questions.map((q) => q.text)];

  const rows = responses.map((response) => {
    const answerMap: Record<number, string> = {};
    response.answers.forEach((a) => {
      answerMap[a.questionId] = Array.isArray(a.value) ? a.value.join('; ') : String(a.value);
    });
    return [
      String(response.id),
      response.submittedAt,
      ...survey.questions.map((q) => answerMap[q.id] ?? ''),
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  downloadFile(csvContent, `survey-${survey.id}-responses.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON(survey: Survey, responses: SurveyResponse[]): void {
  const data = {
    survey: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
    },
    responses: responses.map((r) => ({
      id: r.id,
      submittedAt: r.submittedAt,
      answers: r.answers.map((a) => {
        const question = survey.questions.find((q) => q.id === a.questionId);
        return {
          question: question?.text ?? String(a.questionId),
          answer: a.value,
        };
      }),
    })),
  };

  downloadFile(
    JSON.stringify(data, null, 2),
    `survey-${survey.id}-responses.json`,
    'application/json'
  );
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
