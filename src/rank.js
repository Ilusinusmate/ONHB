function handleIconClick(teamName){
    window.electronAPI.deleteGroupFromFormData(teamName);
    window.location.reload();
}


function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table body before populating

    data.forEach(item => {
        const row = document.createElement('tr');
        
        // Create cells for each data item
        const rankCell = document.createElement('td');
        rankCell.textContent = item.rank;
        row.appendChild(rankCell);

        const groupNameCell = document.createElement('td');
        groupNameCell.textContent = item.groupName;
        row.appendChild(groupNameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = item.score;
        row.appendChild(scoreCell);

        // Create an icon cell
        const iconCell = document.createElement('td');
        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.innerHTML = '<i class="fas fas fa-trash" style="cursor: pointer;"></i>'; // Font Awesome icon
        icon.onclick = () => handleIconClick(item.groupName); // Set the click handler
        iconCell.appendChild(icon);
        row.appendChild(iconCell);

        // Append row to table body
        tableBody.appendChild(row);
    });
}

async function fitData(parsedData){
    const responseMessage  = document.getElementById("responseMessage");
    let finalData = [];
    try{
        const gabarito = await window.electronAPI.loadGabarito();
        
        let ac = 0;

        for (const item of parsedData) {
            Object.entries(item).forEach(([key, value]) => {
                if (key === "groupName") { return; } // Skip if key is "groupName"
                ac += parseInt(gabarito[key][value]); 
            });
            finalData.push({"groupName":item.groupName, "score":ac});
            ac = 0;
        };

        finalData.sort((a, b) => b.score - a.score);

        
        finalData.forEach((item, index) => {
            item.rank = index + 1;
        });

    }catch(error){
        console.error(error);
        responseMessage.textContent = 'Nenhum Gabarito Encontrado.'
        return;
    }

    return finalData;
}


document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        const jsonData = await window.electronAPI.loadFormData();
        console.log(jsonData)
        const treatedData = await fitData(jsonData); // Parse JSON
        populateTable(treatedData); // Pass data to the display function
    } catch (error) {
        console.error("Error reading or parsing JSON file:", error);
    }
});