(function () {
    const addToCart = (cartId, productId) => {
        console.log(cartId);
        fetch(`/api/carts/${cartId}/products/${productId}`, { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    console.log("Db response: ", data.status)
                    if (data.status && data.status == "error") {
                        Swal.fire({
                            position: "center",
                            icon: 'error',
                            title: data.message,
                            text: data.cause,
                            showConfirmButton: true,
                            timer: 0
                          })
                        
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            title: `Product successfully added to cart with id: ${cartId}`,
                            showConfirmButton: true,
                            timer: 0
                          })
                    }
                })
    }

    const addToCartButtons = document.querySelectorAll('.button_add_to_cart')
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.id
            fetch('/api/account/current')
                .then(res => res.json())
                .then(data => {
                    console.log(data.cart);
                    addToCart(data.cart._id, productId)})
        })
    })
})()