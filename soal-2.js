function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] dan arr[j + 1]
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// Hasil array
let arr = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21];

// Mengurutkan array
let sortedArray = bubbleSort(arr);

// Output array
console.log("Array setelah diurutkan:");
console.log(sortedArray);
