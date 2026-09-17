
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

    // Ambil data dari struk
    const customer =
        document.getElementById("receiptCustomer").textContent || "Pelanggan";

    const orderNumber =
        document.getElementById("receiptNumber").textContent || "-";

    const orderDate =
        document.getElementById("receiptDate").textContent || "-";

    const total =
        document.getElementById("receiptTotal").textContent || "Rp0";


    // Buat isi struk
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
            align: "center",
            bold: true
        },

        {
            type: "text",
            text: "Order Sheet",
            align: "center"
        },

        {
            type: "feed",
            lines: 1
        },

        {
            type: "divider"
        },

        {
            type: "text",
            text: "No. Pesanan : " + orderNumber
        },

        {
            type: "text",
            text: "Tanggal     : " + orderDate
        },

        {
            type: "text",
            text: "Nama        : " + customer
        },

        {
            type: "divider"
        }
    ];


    // Masukkan semua barang dari cart
    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;

        receipt.push({

            type: "row",

            left:
                item.name + " x" + item.quantity,

            right:
                formatRupiah(subtotal)
                    .replace("Rp", "")
                    .trim()
        });

    });


    // Total dan bagian bawah struk
    receipt.push(

        {
            type: "divider"
        },

        {
            type: "row",
            left: "TOTAL",
            right:
                total
                    .replace("Rp", "")
                    .trim(),
            bold: true
        },

        {
            type: "feed",
            lines: 1
        },

        {
            type: "text",
            text: "Terima kasih sudah memesan",
            align: "center"
        },

        {
            type: "text",
            text: "Kopsim - Kopi Simpang",
            align: "center"
        },

        {
            type: "feed",
            lines: 3
        }

    );


    // Kirim ke Cleanter
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


        if (response.ok) {

            alert("Pesanan berhasil dicetak! 🖨️");

            console.log("Print berhasil:", result);

        } else {

            alert(
                "Gagal mencetak: " +
                (result.error || "Printer bermasalah")
            );

            console.error(result);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Tidak dapat terhubung ke Cleanter.\n\n" +
            "Pastikan Cleanter aktif dan printer EP5859 terhubung."
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
