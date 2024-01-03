(function () {
    const btnBuy = document.getElementById('btn_buy')
    
    btnBuy.addEventListener('click', async (e) => {
        e.preventDefault()

        const user = await (await fetch('/api/account/current')).json()
        const result = await fetch(`/api/carts/${user.cart._id}/purchase`)
        console.log(await result.json());
        Swal.fire({
            position: "center",
            title: `Purchase completed successfully`,
            showConfirmButton: true,
            timer: 0
          })
    })
})()