const rows = 4;
const cols = 6;

function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function processJson() {
    const jsonInput = document.getElementById('jsonInput').value;
    
    try {
        const groups = JSON.parse(jsonInput);
        let classroom = Array(rows).fill(null).map(() => Array(cols).fill(null));
        let currentRow = 0;
        let currentCol = 0;

        function placeGroup(group) {
            let seatsNeeded = group.names.length;
            if (currentCol + seatsNeeded <= cols) {
                for (let i = 0; i < seatsNeeded; i++) {
                    classroom[currentRow][currentCol++] = { name: group.names[i], color: group.color };
                }
                return true;
            }
            return false;
        }

        function fillRow() {
            let skippedGroups = [];
            while (groups.length > 0) {
                let group = groups.shift();
                if (!placeGroup(group)) {
                    skippedGroups.push(group);
                }
            }
            groups = skippedGroups;
        }

        function handleOverflow() {
            while (currentRow < rows && groups.length > 0) {
                fillRow();
                currentRow++;
                currentCol = 0;
            }
        }

        groups.forEach(group => {
            group.color = generateRandomColor();
        });

        fillRow();
        handleOverflow();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (!classroom[row][col]) {
                    classroom[row][col] = { name: '', color: '' };
                }
            }
        }

        displaySeating(classroom);
    } catch (error) {
        alert('Invalid JSON format');
    }
}

function displaySeating(classroom) {
    const seatingChart = document.getElementById('seatingChart');
    seatingChart.innerHTML = '';

    classroom.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        row.forEach((seat, colIndex) => {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat');
            seatDiv.textContent = seat.name;
            seatDiv.style.backgroundColor = seat.color;
            if (!seat.name) {
                seatDiv.classList.add('empty');
            }
            rowDiv.appendChild(seatDiv);

            if (colIndex === 2) {
                const aisleDiv = document.createElement('div');
                aisleDiv.classList.add('aisle');
                aisleDiv.classList.add('aisle-middle');
                rowDiv.appendChild(aisleDiv);
            }
        });

        seatingChart.appendChild(rowDiv);
    });
}

function resetJson() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('seatingChart').innerHTML = '';
}
