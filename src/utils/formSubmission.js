export const submitToForm = async (result) => {
  console.log('Starting form submission...');
  const formUrl = localStorage.getItem('worldle_form_url');
  const playerName = localStorage.getItem('worldle_player_name');
  
  if (!formUrl || !playerName) {
    console.error('Form URL or player name not set', { formUrl, playerName });
    return false;
  }

  // Extract form ID from the URL
  const formId = formUrl.match(/\/e\/([a-zA-Z0-9_-]+)/)?.[1];
  if (!formId) {
    console.error('Invalid form URL, could not extract form ID', { formUrl });
    return false;
  }

  const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  console.log('Submit URL:', submitUrl);
  
  // Create form data
  const formData = new FormData();
  formData.append('entry.1664276276', playerName);  // Name field
  formData.append('entry.1677763324', result);      // Result field

  console.log('Form data prepared:', {
    playerName,
    result,
    formEntries: Array.from(formData.entries())
  });

  try {
    console.log('Attempting direct POST request...');
    // First try a direct POST request
    const response = await fetch(submitUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    console.log('Direct POST completed', { response });
    return true;
  } catch (error) {
    console.error('Error with direct POST:', error);
    
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
      nameInput.value = playerName;
      form.appendChild(nameInput);

      // Add result field
      const resultInput = document.createElement('input');
      resultInput.name = 'entry.1677763324';
      resultInput.value = result;
      form.appendChild(resultInput);

      document.body.appendChild(form);
      form.submit();
      
      console.log('Fallback form submitted');

      // Clean up form after submission
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
          console.log('Cleanup: form removed from document');
        }
      }, 5000);

      return true;
    } catch (fallbackError) {
      console.error('Fallback submission failed:', fallbackError);
      return false;
    }
  }
};