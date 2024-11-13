// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  deleteGroupFromFormData: (groupName) => ipcRenderer.send('delete-form-data', groupName),
  sendFormData: (formData) => ipcRenderer.send('form-data', formData),
  sendGabarito: (formData) => ipcRenderer.send('gabarito', formData),
  onFormDataReply: (callback) => ipcRenderer.on('form-data-reply', callback),
  loadFormData: () => ipcRenderer.invoke('load-form-data'),
  loadGabarito: () => ipcRenderer.invoke('load-gabarito'),
  joinPath: (filePath) => path.join(__dirname, filePath),
});
