document.getElementById('submitButton').addEventListener('click', (e) => {
    e.preventDefault()
    const form = document.getElementById('questionnaireForm');
    const formData = {};

    // console.log(new FormData(form))
    // Extract form data

    // console.log(form)
    // console.log(new FormData(form))

    new FormData(form).forEach((value, key) => {
        formData[key] = value;
    });

    
    if (!'groupName' in formData || formData['groupName'] === ''){
        document.getElementById('responseMessage').textContent = "Formulário inválido, por favor preencha ao menos o nome da equipe, e resubmeta.";
        console.log("inválido")
        return;
    }

    // Send data to main process
    // console.log("tudo certo!")
    window.electronAPI.sendFormData(formData);
    window.location.href = window.electronAPI.joinPath('/index.html');
  });

  // Listen for the reply
  window.electronAPI.onFormDataReply((event, message) => {
    document.getElementById('responseMessage').textContent = message;
  });