const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}



const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, path.join('assets', 'icon.ico')),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      // contextIsolation: false
    },
  });
  
  mainWindow.setMenuBarVisibility(false);

  if (process.env.NODE_ENV !== 'development') {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Esconder a barra de rolagem
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      ::-webkit-scrollbar {
        display: none;
      }
    `);
  });

  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function saveFormData(formData) {
  const filePath = path.join(app.getPath('userData'), "formData.json");
  
  // Tenta ler o arquivo existente
  fs.readFile(filePath, 'utf8', (err, data) => {
    let formArray = [];

    if (!err) {
      // Se o arquivo existe, parse para um array de objetos
      try {
        formArray = JSON.parse(data);
      } catch (parseErr) {
        console.error("Erro ao parsear o JSON existente:", parseErr);
      }
    }

    // Adiciona o novo formulário ao array
    formArray.push(formData);

    // Escreve o array atualizado no arquivo JSON
    fs.writeFile(filePath, JSON.stringify(formArray, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Erro ao salvar os dados do formulário:', writeErr);
      } else {
        console.log('Dados do formulário salvos com sucesso.');
      }
    });
  });
}

function saveGabarito(formData) {
  const filePath = path.join(app.getPath('userData'), "gabarito.json");
  
  fs.writeFile(filePath, JSON.stringify(formData, null, 2), (writeErr) => {
    if (writeErr) {
      console.error('Erro ao salvar os dados do formulário:', writeErr);
    } else {
      console.log('Dados do formulário salvos com sucesso.');
    }
  });
  
}

function deleteFormData(groupName) {
  const filePath = path.join(app.getPath('userData'), "formData.json");

  // Tenta ler o arquivo existente
  fs.readFile(filePath, 'utf8', (err, data) => {
    let formArray = [];

    if (!err) {
      // Se o arquivo existe, parse para um array de objetos
      try {
        formArray = JSON.parse(data);
      } catch (parseErr) {
        console.error("Erro ao parsear o JSON existente:", parseErr);
      }
    }

    // Filtra o array para remover o objeto com o groupName correspondente
    const updatedFormArray = formArray.filter(item => item.groupName !== groupName);

    // Escreve o array atualizado no arquivo JSON
    fs.writeFile(filePath, JSON.stringify(updatedFormArray, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Erro ao salvar os dados do formulário:', writeErr);
      } else {
        console.log('Dados do formulário atualizados com sucesso.');
      }
    });
  });
}

function loadFormData() {
  try {
    const data = fs.readFileSync(path.join(app.getPath('userData'), 'formData.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading formData.json:", err);
    return []; // Return an empty array or handle the error as needed
  }
}

function loadGabarito() {
  try {
    const data = fs.readFileSync(path.join(app.getPath('userData'), 'gabarito.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading gabarito.json:", err);
    return {}; // Return an empty object or handle the error as needed
  }
}


// Escuta o evento para deletar dados do formulário
ipcMain.on('delete-form-data', (event, groupName) => {
  deleteFormData(groupName);
  event.reply('delete-form-data-reply', 'Dados do formulário deletados com sucesso.');
});

// Escuta os dados do formulário e chama a função de salvar
ipcMain.on('form-data', (event, formData) => {
  saveFormData(formData);
  event.reply('form-data-reply', 'Dados do formulário salvos com sucesso.');
});

ipcMain.on('gabarito', (event, formData) => {
  saveGabarito(formData);
  event.reply('form-data-reply', 'Dados do formulário salvos com sucesso.');
});

ipcMain.handle('load-form-data', () => {
  return loadFormData();
});

ipcMain.handle('load-gabarito', () => {
  return loadGabarito();
});