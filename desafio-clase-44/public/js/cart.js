(function () {
    const btnBuy = document.getElementById('btn_buy')
    
    btnBuy.addEventListener('click', async (e) => {
        e.preventDefault()

        const user = await (await fetch('/api/account/current')).json()
        const result = await (await fetch(`/api/carts/${user.cart._id}/purchase`)).json()
        if (result.error) {
            Swal.fire({
                position: "center",
                icon: 'error',
                title: result.error,
                showConfirmButton: true,
                timer: 0
            })
            return
        }

        console.log(result);
        Swal.fire({
            position: "center",
            title: `Purchase completed successfully`,
            showConfirmButton: true,
            timer: 0
        })
    })
})()