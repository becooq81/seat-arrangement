        const defaultData = [
            ['박준', '강희'],
            ['고금', '이하', '정혜'],
            ['구본', '왕한'],
            ['김성', '손정'],
            ['김준', '진성'],
            ['문인', '육종'],
            ['김서', '주시'],
            ['김정', '조희'],
            ['박윤', '최민'],
            ['유호', '이호'],
            ['홍', '황인']
        ];

        const rows = 4;
        const cols = 6;

        function populateInputs() {
            const inputContainer = document.getElementById('inputContainer');
            inputContainer.innerHTML = '';
            defaultData.forEach(pair => {
                const newInput = document.createElement('div');
                newInput.classList.add('pair-input');
                newInput.innerHTML = `
                    <input type="text" class="name" value="${pair[0]}">
                    <input type="text" class="name" value="${pair[1]}">
                    ${pair[2] ? `<input type="text" class="name" value="${pair[2]}">` : '<input type="text" class="name" placeholder="Name 3 (optional)">'}
                `;
                inputContainer.appendChild(newInput);
            });
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function allocateSeating() {
            let groups = [];
            document.querySelectorAll('.pair-input').forEach(inputGroup => {
                const group = Array.from(inputGroup.querySelectorAll('.name'))
                                   .map(input => input.value.trim())
                                   .filter(name => name.length > 0);

                if (group.length > 0) {
                    groups.push(group);
                }
            });

            shuffleArray(groups);

            let classroom = Array(rows).fill(null).map(() => Array(cols).fill(null));
            let currentRow = 0;
            let currentCol = 0;

            function placeGroup(group) {
                let seatsNeeded = group.length;
                if (currentCol + seatsNeeded <= cols) {
                    for (let i = 0; i < seatsNeeded; i++) {
                        classroom[currentRow][currentCol++] = group[i];
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
                        classroom[row][col] = '';
                    }
                }
            }

            displaySeating(classroom);
        }

        function displaySeating(classroom) {
            const seatingChart = document.getElementById('seatingChart');
            seatingChart.innerHTML = '';

            classroom.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.classList.add('row');

                row.forEach(seat => {
                    const seatDiv = document.createElement('div');
                    seatDiv.classList.add('seat');
                    seatDiv.textContent = seat;
                    if (!seat) {
                        seatDiv.classList.add('empty');
                    }
                    rowDiv.appendChild(seatDiv);
                });

                seatingChart.appendChild(rowDiv);
            });
        }

        populateInputs();
