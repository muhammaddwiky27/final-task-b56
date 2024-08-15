function hitungBarang(kualitas, qty) {
    let harga;
    let potongan = 0;
    let totalHarga;

    if (kualitas === 'A') {
        harga = 4550;
        totalHarga = harga * qty;
        if (qty > 13) {
            potongan = 231 * qty;
        }
    } else if (kualitas === 'B') {
        harga = 5330;
        totalHarga = harga * qty;
        if (qty > 7) {
            potongan = totalHarga * 0.23;
        }
    } else if (kualitas === 'C') {
        harga = 8653;
        totalHarga = harga * qty;
        
    } else {
        console.log('Kualitas barang tidak valid');
        return;
    }

    let totalBayar = totalHarga - potongan;

    console.log(`- Total harga barang : ${totalHarga}`);
    console.log(`- Potongan : ${potongan}`);
    console.log(`- Total yang harus dibayar : ${totalBayar}`);
}

// Hasil Input
hitungBarang('A', 14);
