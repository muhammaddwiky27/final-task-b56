function drawImage(size) {
    if (size % 2 === 0) {
        console.log("Parameter harus bernilai ganjil.");
        return;
    }

    for (let i = 0; i < size; i++) {
        let line = "";
        for (let j = 0; j < size; j++) {
            if (i === j || i + j === size - 1) {
                line += "# ";
            } else {
                line += "* ";
            }
        }
        console.log(line);
    }
}

console.log("drawImage(5);");
drawImage(5);

console.log("\ndrawImage(7);");
drawImage(7);
