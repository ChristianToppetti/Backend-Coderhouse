
(function () {
    const addToCartButtons = document.querySelectorAll('.button_add_to_cart')
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.id
            const testCartId = "65430bc4a9cfc883844519eb"
            fetch(`/api/carts/${testCartId}/products/${productId}`, { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    Swal.fire({
                        position: "center",
                        title: `Product successfully added to cart with id: ${testCartId}`,
                        showConfirmButton: true,
                        timer: 0
                      });
                })
            console.log("asd");
        })
    })
})()