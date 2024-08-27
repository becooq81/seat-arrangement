const pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', 
    '#C2C2F0', '#D5AAFF', '#FFB2B2', '#FF9A9A', '#FF9EAA',
    '#B3F5B3', '#F5B3B3', '#B3D9FF', '#D9B3FF', '#B3B3F5'
];

const rows = 4;
const cols = 6;

function parseTextarea() {
    const textarea = document.getElementById('input-text-area');
    const rawData = textarea.value.trim();
    
    const groups = rawData.split('\n').map(line => {
        return line.split(/[\s,]+/).map(name => name.trim()).filter(name => name.length > 0);
    }).filter(group => group.length > 0);

    return groups;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffleNamesInGroup(group) {
    return shuffleArray(group);
}

function allocateSeating() {
    let groups = parseTextarea().map(group => {
        const shuffledGroup = shuffleNamesInGroup(group);
        const color = getNextColor();
        return { names: shuffledGroup, color: color };
    });

    shuffleArray(groups);

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
}

function displaySeating(classroom) {
    const seatingChart = document.getElementById('seating-chart');
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

let colorIndex = 0;

function getNextColor() {
    const color = pastelColors[colorIndex];
    colorIndex = (colorIndex + 1) % pastelColors.length;
    return color;
}

initializeSeating();

function initializeSeating() {
    let classroom = Array(rows).fill(null).map(() => Array(cols).fill(''));
    displaySeating(classroom);
}
