function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function allocatePairs(pairs) {
    const rows = 4;
    const cols = 6; // 3 on each side of the aisle
    let classroom = Array(rows).fill(null).map(() => Array(cols).fill(null));

    // Shuffle the pairs to randomize seating
    pairs = shuffleArray(pairs);

    let currentRow = 0;
    let currentCol = 0;

    pairs.forEach(pair => {
        if (pair.length > 3) {
            throw new Error("Only pairs or triplets are allowed.");
        }

        let seatsNeeded = pair.length;

        while (true) {
            if (currentRow >= rows) {
                currentRow = 0; // Start over from the top row
                currentCol = 0;
            }

            // Check if the pair/triplet can be placed in the current row without crossing the aisle
            if (currentCol + seatsNeeded <= 3 || (currentCol >= 3 && currentCol + seatsNeeded <= cols)) {
                // Place the pair or triplet side by side
                for (let i = 0; i < pair.length; i++) {
                    classroom[currentRow][currentCol++] = pair[i];
                }

                // If a triplet was placed, handle possible null space
                if (pair.length === 3 && currentCol % 3 === 0) {
                    currentCol++; // Skip to the next seat on the opposite side of the aisle
                }

                break; // Move to the next pair after placing
            } else {
                // If a triplet cannot be seated in the current row, skip to the next row
                if (pair.length === 3 && currentCol + seatsNeeded > cols) {
                    currentRow++;
                    currentCol = 0;
                    continue;
                }

                // Move to the next row if there's not enough space in the current one
                currentRow++;
                currentCol = 0;
            }
        }
    });

    return classroom;
}

// Example usage:
let pairs = [
    ["Alice", "Bob"],
    ["Charlie", "Dave"],
    ["Eve", "Frank", "Grace"],
    ["Heidi", "Ivan"],
    ["Judy", "Mallory"]
];

let seating = allocatePairs(pairs);

console.log(seating);
