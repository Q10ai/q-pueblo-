'use strict';
(() => {
  // Designated public inquiries address supplied by the project owner on 2026-11-09. Email delivery is not independently tested.
  const CONTACT_EMAIL = 'Q10pueblo@gmail.com';
  const $ = id => document.getElementById(id);
  const clean = (value, max) => String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  let prepared = null;
  const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  $('request-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!$('request-form').reportValidity()) return;
    const type = clean($('type').value, 100), topic = clean($('subject').value, 160),
      request = clean($('description').value, 3000), source = clean($('source').value, 500),
      timing = clean($('timing').value, 120);
    if (source && !/^https:\/\/[^\s<>"']+$/i.test(source)) {
      $('contact-status').textContent = 'Use a public HTTPS link for the supporting source or remove it.';
      $('draft').hidden = false;
      $('email-link').hidden = true;
      return;
    }
    const subject = 'Q-Pueblo inquiry: ' + type + (topic ? ' — ' + topic : '');
    const body = ['Hello Q-Pueblo,', '', 'I would like to request information or a quote for:', type,
      '', 'Issue / organization / item: ' + (topic || 'Not specified'), '', 'What I need:', request,
      '', 'Public source: ' + (source || 'None attached'), 'Requested timing: ' + (timing || 'Flexible'),
      '', 'Please confirm scope, delivery, availability, price, conditions and any conflicts before proceeding.',
      'I understand this inquiry is not a payment, order or accepted commission.',
      '', 'Thank you.'].join('\n');
    prepared = { subject, body };
    $('email-subject').textContent = subject;
    $('email-body').textContent = body;
    $('draft').hidden = false;
    const mail = $('email-link');
    if (validEmail(CONTACT_EMAIL)) {
      mail.hidden = false;
      mail.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      $('contact-status').textContent = 'Email draft addressed to Q10pueblo@gmail.com. Opening your email app does not send it automatically.';
    } else {
      mail.hidden = true;
      mail.removeAttribute('href');
      $('contact-status').textContent = 'The project has not yet published a verified inquiries email address. You can copy or download this request now; sending becomes available after the address is configured.';
    }
    $('draft').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  $('copy').addEventListener('click', async () => {
    if (!prepared) return;
    const text = 'Subject: ' + prepared.subject + '\n\n' + prepared.body;
    try { await navigator.clipboard.writeText(text); $('contact-status').textContent = 'Request copied. Sending remains your choice.'; }
    catch { $('contact-status').textContent = 'Browser copy permission unavailable. Select and copy the draft text above.'; }
  });
  $('download').addEventListener('click', () => {
    if (!prepared) return;
    const blob = new Blob(['Subject: ' + prepared.subject + '\n\n' + prepared.body], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'Q-Pueblo-email-inquiry.txt';
    document.body.appendChild(link); link.click(); link.remove();
    URL.revokeObjectURL(url);
    $('contact-status').textContent = 'Text request downloaded. Nothing was submitted.';
  });
})();
