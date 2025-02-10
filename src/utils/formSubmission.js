export const submitToForm = async (result) => {
  const formUrl = localStorage.getItem('worldle_form_url');
  const playerName = localStorage.getItem('worldle_player_name');
  
  if (!formUrl || !playerName) {
    console.error('Form URL or player name not set');
    return false;
  }

  // Extract form ID from the URL
  const formId = formUrl.match(/\/e\/([a-zA-Z0-9_-]+)/)?.[1];
  if (!formId) {
    console.error('Invalid form URL');
    return false;
  }
  
  // Create iframe for submission
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // Create form inside iframe
  const form = iframe.contentDocument.createElement('form');
  form.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  form.method = 'POST';
  
  // Add name field
  const nameInput = iframe.contentDocument.createElement('input');
  nameInput.name = 'entry.1664276276';  // Name field
  nameInput.value = playerName;
  form.appendChild(nameInput);
  
  // Add result field
  const resultInput = iframe.contentDocument.createElement('input');
  resultInput.name = 'entry.1677763324';  // Result field
  resultInput.value = result;
  form.appendChild(resultInput);
  
  // Add form to iframe and submit
  iframe.contentDocument.body.appendChild(form);
  
  try {
    form.submit();
    setTimeout(() => document.body.removeChild(iframe), 5000); // Clean up iframe after 5s
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    document.body.removeChild(iframe);
    return false;
  }
};