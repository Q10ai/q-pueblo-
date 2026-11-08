/* Progressive enhancement: on-page only, no network, storage, analytics, or profiling. */
(() => {
  'use strict';
  for (const button of document.querySelectorAll('[data-check-level]')) {
    button.addEventListener('click', () => {
      const level = button.closest('.level');
      if (!level) return;
      const questions = [...level.querySelectorAll('.question')];
      let correct = 0, attempted = 0;
      for (const question of questions) {
        const marked = question.querySelector('input[type="radio"]:checked');
        const feedback = question.querySelector('.feedback');
        if (!marked) {
          feedback.textContent = 'Not answered yet. You can try it or open the explanation.';
          feedback.dataset.status = 'unanswered';
          continue;
        }
        attempted++;
        if (Number(marked.value) === Number(question.dataset.answer)) {
          correct++;
          feedback.textContent = 'Correct. Open the explanation for the source and reasoning.';
          feedback.dataset.status = 'correct';
        } else {
          feedback.textContent = 'Review the explanation and try again. Learning is not a pass/fail judgment.';
          feedback.dataset.status = 'review';
        }
      }
      const result = level.querySelector('.score-result');
      result.textContent = `${correct} correct out of ${attempted} answered (${questions.length} total). Review explanations and retry whenever you wish.`;
      result.tabIndex = -1;
      result.focus();
    });
  }
})();
