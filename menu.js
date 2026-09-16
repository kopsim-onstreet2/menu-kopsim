
/* =========================
   DATA KERANJANG
========================= */

let cart = [];


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(number) {

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);

}


/* =========================
   TAMBAH KE KERANJANG
========================= */

function addToCart(name, price) {

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    openCart();
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const cartItems =
        document.getElementById('cartItems');

    const cartCount =
        document.getElementById('cartCount');

    const cartTotal =
        document.getElementById('cartTotal');


    cartItems.innerHTML = '';

    let total = 0;
    let totalQuantity = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
                    <div class="empty-cart">
                        Belum ada pesanan.
                    </div>
                `;

    }


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        totalQuantity += item.quantity;


        cartItems.innerHTML += `

                    <div class="cart-item">

                        <div class="cart-item-top">

                            <span class="cart-item-name">
                                ${item.name}
                            </span>

                            <span class="cart-item-price">
                                ${formatRupiah(itemTotal)}
                            </span>

                        </div>

                        <div class="quantity">

                            <button
                                onclick="decreaseQuantity(${index})">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="increaseQuantity(${index})">
                                +
                            </button>

                        </div>

                    </div>

                `;

    });


    cartCount.textContent = totalQuantity;

    cartTotal.textContent =
        formatRupiah(total);

}


/* =========================
   TAMBAH JUMLAH
========================= */

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();

}


/* =========================
   KURANG JUMLAH
========================= */

function decreaseQuantity(index) {

    cart[index].quantity--;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    updateCart();

}


/* =========================
   BUKA CART
========================= */

function openCart() {

    document
        .getElementById('cartPanel')
        .classList.add('active');

    document
        .getElementById('overlay')
        .classList.add('active');

}


/* =========================
   TUTUP CART
========================= */

function closeCart() {

    document
        .getElementById('cartPanel')
        .classList.remove('active');

    document
        .getElementById('overlay')
        .classList.remove('active');

}


/* =========================
   BUAT PESANAN
========================= */

function createOrder() {

    if (cart.length === 0) {

        alert('Silakan pilih menu terlebih dahulu.');

        return;

    }


    const customerName =
        document
            .getElementById('customerName')
            .value
            .trim();


    if (customerName === '') {

        alert('Silakan masukkan nama pelanggan.');

        return;

    }


    const orderNumber =
        'KP-' +
        Math.floor(
            1000 + Math.random() * 9000
        );


    // TANGGAL
    const now = new Date();


    const date =
        now.toLocaleDateString('id-ID') +
        ' ' +
        now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });


    document
        .getElementById('receiptNumber')
        .textContent = orderNumber;


    document
        .getElementById('receiptDate')
        .textContent = date;


    document
        .getElementById('receiptCustomer')
        .textContent = customerName;


    /* =========================
   ITEM PESANAN
========================= */
    const receiptItems =
        document.getElementById('receiptItems');


    receiptItems.innerHTML = '';


    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        receiptItems.innerHTML += `

                    <div class="receipt-item">

                        <span>
                            ${item.quantity}x
                            ${item.name}
                        </span>

                        <span>
                            ${formatRupiah(itemTotal)}
                        </span>

                    </div>

                `;

    });


    document
        .getElementById('receiptTotal')
        .textContent =
        formatRupiah(total);


    closeCart();


    document
        .getElementById('receiptContainer')
        .classList.add('active');

}


/* =========================
   CETAK
========================= */

async function printReceipt() {

    const receipt = [
        {
            type: "text",
            text: "KOPSIM",
            align: "center",
            bold: true,
            size: "large"
        },

        {
            type: "text",
            text: "KOPI SIMPANG",
            align: "center"
        },

        {
            type: "divider"
        },

        {
            type: "text",
            text: "TEST PESANAN",
            align: "center"
        },

        {
            type: "feed",
            lines: 3
        }
    ];

    try {

        const response = await fetch(
            "http://localhost:9100/print",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cut: true,
                    content: receipt
                })
            }
        );

        const result = await response.json();

        console.log("Cleanter:", result);

        if (response.ok) {

            alert("Perintah cetak berhasil dikirim 🖨️");

        } else {

            alert(
                "Cleanter menolak cetak:\n" +
                (result.error || "Tidak diketahui")
            );

        }

    } catch (error) {

        console.error("PRINT ERROR:", error);

        alert(
            "Website tidak bisa menghubungi Cleanter.\n\n" +
            error.message
        );
    }
}



/* =========================
   TUTUP RECEIPT
========================= */

function closeReceipt() {

    document
        .getElementById('receiptContainer')
        .classList.remove('active');

    cart = [];

    document
        .getElementById('customerName')
        .value = '';

    updateCart();

}


/* =========================
   INITIAL
========================= */

updateCart();
