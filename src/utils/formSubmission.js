import { 
  validatePlayerName, 
  isValidGoogleFormUrl, 
  extractFormId, 
  sanitizeForLogging,
  sanitizeHtml 
} from './security.js';

export const submitToForm = async (result, state = {}, setState = () => {}) => {
  // Default state object if none provided
  const currentState = state || {};
  
  // If submission was already successful, don't submit again
  if (currentState.submissionStatus === 'success') {
    console.log('Result already successfully submitted, skipping...');
    return true;
  }

  console.log('Starting form submission...');
  const formUrl = localStorage.getItem('worldle_webhook_url');
  const playerName = localStorage.getItem('worldle_player_name');
  
  if (!formUrl || !playerName) {
    console.error('Form URL or player name not set', sanitizeForLogging({ formUrl: !!formUrl, playerName: !!playerName }));
    setState({ ...currentState, submissionStatus: 'error' });
    return false;
  }

  // Validate player name
  const sanitizedPlayerName = validatePlayerName(playerName);
  if (!sanitizedPlayerName) {
    console.error('Invalid player name');
    setState({ ...currentState, submissionStatus: 'error' });
    return false;
  }

  // Validate form URL
  if (!isValidGoogleFormUrl(formUrl)) {
    console.error('Invalid or unsafe form URL');
    setState({ ...currentState, submissionStatus: 'error' });
    return false;
  }

  // Extract form ID from the URL
  const formId = extractFormId(formUrl);
  if (!formId) {
    console.error('Could not extract form ID from URL');
    setState({ ...currentState, submissionStatus: 'error' });
    return false;
  }

  const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  console.log('Submit URL prepared');
  
  // Sanitize result data before submission
  const sanitizedResult = sanitizeHtml(result);
  
  // Create form data
  const formData = new FormData();
  formData.append('entry.1664276276', sanitizedPlayerName);  // Name field
  formData.append('entry.1677763324', sanitizedResult);      // Result field

  console.log('Form data prepared for submission');

  try {
    console.log('Attempting direct POST request...');
    // First try a direct POST request
    const response = await fetch(submitUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    console.log('Direct POST completed');
    setState({ ...currentState, submissionStatus: 'success' });
    return true;
  } catch (error) {
    console.error('Error with direct POST:', error.message);
    
    // Fallback to traditional form submission
    try {
      console.log('Attempting fallback form submission...');
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = submitUrl;
      form.style.display = 'none';

      // Add name field
      const nameInput = document.createElement('input');
      nameInput.name = 'entry.1664276276';
      nameInput.value = sanitizedPlayerName;
      nameInput.type = 'hidden'; // Use hidden input for security
      form.appendChild(nameInput);

      // Add result field
      const resultInput = document.createElement('input');
      resultInput.name = 'entry.1677763324';
      resultInput.value = sanitizedResult;
      resultInput.type = 'hidden'; // Use hidden input for security
      form.appendChild(resultInput);

      document.body.appendChild(form);
      form.submit();
      
      console.log('Fallback form submitted');

      // Update submission status
      setState({ ...currentState, submissionStatus: 'success' });

      // Clean up form after submission
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
          console.log('Cleanup: form removed from document');
        }
      }, 5000);

      return true;
    } catch (fallbackError) {
      console.error('Fallback submission failed:', fallbackError.message);
      setState({ ...currentState, submissionStatus: 'error' });
      return false;
    }
  }
};