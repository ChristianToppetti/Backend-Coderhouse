(async function () {
    const btnBuy = document.getElementById('btn_buy')
    const btnsDeleteProduct = document.getElementsByClassName('button_delete')
    const user = await (await fetch('/api/account/current')).json()

    btnBuy.addEventListener('click', async (e) => {
        e.preventDefault()

        const stripe = Stripe('pk_test_51Opi0WERgwWZ8XBoeOghJIbO0X660DeFqFhvugIRjJpgxL5eussFmZjvgybGXYd1s7Gfg3ZFpmbSKUJeD61TOqkz00qkEzqndM');

        if(user.role == 'admin') {
            return Swal.fire({
                position: "center",
                icon: 'error',
                title: `Admins are not allowed to buy stuff`,
                showConfirmButton: true
            })
        }

        const { clientSecret, ticketCode } = await (await fetch(`/api/payment/${user.cart._id}/payment-intents`)).json()

        if(!clientSecret || !ticketCode) return location.reload()

        const checkout = await stripe.initEmbeddedCheckout({
            clientSecret,
            onComplete: () => {
                handleComplete(ticketCode)
            }
        })

        checkout.mount('#checkout')

        const cartContainer = document.getElementById('cart')
        cartContainer.hidden = true
    })

    for(btn of btnsDeleteProduct) {
        btn.addEventListener('click', async (e) => {
            e.preventDefault()
            const productId = e.target.id.split('_')[1]
            const result = await fetch(`/api/carts/${user.cart._id}/products/${productId}`, { method: 'DELETE'})
            if(result.status == 201) {
                e.target.parentElement.hidden = true
                Toastify({
                    text: "Product deleted",
                    className: "success",
                }).showToast()
            }
        })
    }

    const handleComplete = async (ticketCode) => {
        const ticket = await (await fetch(`/api/payment/success?id=${ticketCode}`)).json()
        console.log(ticket)
        Swal.fire({
            position: "center",
            title: `Purchase completed successfully`,
            icon: 'success',
            text: `Your ticket id is: ${ticketCode}`,
            showConfirmButton: true,
            timer: 0
        })
    }
})()