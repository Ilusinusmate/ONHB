document.getElementById('submitButton').addEventListener('click', (e) => {
    e.preventDefault()
    const form = document.getElementById('questionnaireForm');
    const formData = {};

    // console.log(new FormData(form))
    // Extract form data

    // console.log(form)
    // console.log(new FormData(form))

    new FormData(form).forEach((value, key) => {
        if (value === ""){
            document.getElementById('responseMessage').textContent = "Formulário inválido, por favor preencha todas as questões, e resubmeta.";
            console.log("inválido");
            return;
        }
        if (value > 5){ value = "5";}

        const questionMatch = key.match(/(question\d+)([A-Z])/);
        if (questionMatch) {
            const questionNumber = questionMatch[1]; // "question1"
            const optionLetter = questionMatch[2]; // "A", "B", etc.

            // Inicializa o objeto da questão se ainda não existir
            if (!formData[questionNumber]) {
                formData[questionNumber] = {};
            }

            // Define o valor da opção
            formData[questionNumber][optionLetter] = parseInt(value);
        }
    });

    
    if (Object.keys(formData).length !== 15){
        document.getElementById('responseMessage').textContent = "Formulário inválido, por favor preencha todas as questões, e resubmeta.";
        console.log("inválido");
        return;
    }

    // Send data to main process
    // console.log("tudo certo!")
    window.electronAPI.sendGabarito(formData);
    window.location.href = window.electronAPI.joinPath('/index.html');
  });

  // Listen for the reply
  window.electronAPI.onFormDataReply((event, message) => {
    document.getElementById('responseMessage').textContent = message;
});


const validNumbers = ['0', '1', '4', '5'];
        
function validateEntry(input) {
    const valor = input.value;

    // Permitir apenas 0, 1, 4 ou 5
    if (valor !== '' && !validNumbers.includes(valor)) {
        input.value = '0'; // Define o valor para 0 se o valor não for permitido
        alert('Por favor, insira apenas os números 0, 1, 4 ou 5. O valor foi redefinido para 0.');
    }
}

function increment() {
    const input = document.getElementById('numberInput');
    const currentIndex = validNumbers.indexOf(input.value);
    const nextIndex = (currentIndex + 1) % validNumbers.length; // Volta ao início quando chega ao final
    input.value = validNumbers[nextIndex];
}

function decrement() {
    const input = document.getElementById('numberInput');
    const currentIndex = validNumbers.indexOf(input.value);
    const nextIndex = (currentIndex - 1 + validNumbers.length) % validNumbers.length; // Volta ao final quando chega ao início
    input.value = validNumbers[nextIndex];
}